import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Input, Button, Modal } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import styles from './index.less';
import { values } from 'lodash';
import ModalForm from '@/components/ModalForm';
import { addCategory, deleteCategory, getCategories, updateCategory } from '@/services/category';

const Category = () => {
  const buttonSubmitter = [
    {
      key: 'clearFieldFormCategory',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddCategory',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];
  const formField = [
    {
      fieldType: 'formText',
      key: 'fieldAddNameCategory',
      label: 'Name',
      width: 'lg',
      placeholder: 'Enter category name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input category name before submit',
    },
  ];
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      ellipsis: true,
      sorter: (a, b) => a.number - b.number,
      search: false,
      width: '40%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
      copyable: true,
      ellipsis: true,
      valueType: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter name to search',
          },
        ],
      },
      filters: true,
      onFilter: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      search: false,
      render: (_, record) => {
        return (
          <div className={styles.column_ares}>
            <div className={styles.width_table_action}>
              <Button
                key="editCategory"
                type="primary"
                size="middle"
                icon={<EditOutlined />}
                block={true}
                onClick={() => handleEditRecord(record)}
              >
                Edit
              </Button>
            </div>
            <div className={styles.width_table_action}>
              <Button
                key="deleteCategory"
                type="danger"
                size="middle"
                icon={<DeleteOutlined />}
                block={true}
                onClick={() => handleDeleteCategory(record)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      },
    },
  ];
  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddNameCategory',
      label: 'Name',
      width: 'lg',
      placeholder: 'Enter category name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input category name before submit',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];
  const [showModal, setShowModel] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [categoryRecord, setCategoryRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterCategory, setButtonSubmitterCategory] = useState(buttonSubmitter);
  const [formFieldAddCategory, setFormFieldAddCategory] = useState(formField);
  const [formFieldEditCategory, setFormFieldEditCategory] = useState(formFieldEdit);
  const actionRef = useRef();
  const formAddCategoryRef = useRef();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(10);

  React.useEffect(() => {
    const newButtonSubmitCategory = buttonSubmitterCategory.map((item, index) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });

    setButtonSubmitterCategory(newButtonSubmitCategory);
  }, [buttonLoading]);

  React.useEffect(() => {
    if (categoryRecord) {
      formAddCategoryRef?.current?.setFieldsValue(categoryRecord);
    }
  }, [categoryRecord]);

  const handleModal = () => {
    setShowModel(!showModal);
  };

  const handleCancelModel = () => {
    setShowModel(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setCategoryRecord(null);
    if (formAddCategoryRef) {
      formAddCategoryRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formAddCategoryRef?.current?.resetFields();
  };

  const handleEditRecord = async (record) => {
    console.log('record', record);
    setFlagEditForm('edit');
    setShowModel(!showModal);
    setCategoryRecord(record);
  };

  //handle submit form add category
  const handleSubmitFormCategory = async (values) => {
    setButtonLoading(true);
    if (values.edit) {
      console.log('values edit', values);
      const idCategory = categoryRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      handleCancelModel();
      await updateCategory(idCategory, dataEdit);
    } else {
      await addCategory(values);
      handleResetForm();
    }
    actionRef?.current?.reload();
    setButtonLoading(false);
  };

  const handleDeleteCategory = async (record) => {
    const result = await deleteCategory(record.id);
    if (result) {
      actionRef?.current?.reload();
    }
  };

  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          // dataSource={}
          request={async (params, sort, filter) => {
            const currentAttr = 'current';
            const pageSizeAttr = 'pageSize';
            console.log(params);
            const data = [];
            // do day la params search tren form nen phai loai bo current va pageSize
            if (params.name) {
              const newParams = Object.keys(params).reduce((item, key) => {
                //code loai bo current va pagesize
                if (key != currentAttr && key != pageSizeAttr) {
                  if (key === 'name') {
                    item.name = params[key];
                  } else {
                    item[key] = params[key];
                  }
                }
                return item;
              }, {});
              console.log('params', newParams);

              await getCategories(newParams).then((res) => {
                res?.payload?.map((item, index) => {
                  item.number = index + 1;
                  data[index] = item;
                });
                setTotal(res?.total);
              });
            } else {
              await getCategories(params).then((res) => {
                res?.payload?.map((item, index) => {
                  item.number = index + 1;
                  data[index] = item;
                });
                setTotal(res?.total);
              });
            }
            return {
              data: data,
              success: true,
            };
          }}
          onReset={true}
          actionRef={actionRef}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onchange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey="idCategory"
          search={{
            labelWidth: 'auto',
            searchText: 'Search',
            submittext: 'Submit',
            resetText: 'Reset',
          }}
          toolBarRender={(action) => [
            <Button
              size="middle"
              key="buttonAddCategory"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModal()}
            >
              Add
            </Button>,
          ]}
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Edit ${categoryRecord.name}`}
          handleCancelModel={handleCancelModel}
          formRef={formAddCategoryRef}
          buttonSubmitter={buttonSubmitterCategory}
          handleSubmitForm={handleSubmitFormCategory}
          formField={formFieldEditCategory}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New Category"
          handleCancelModel={handleCancelModel}
          formRef={formAddCategoryRef}
          buttonSubmitter={buttonSubmitterCategory}
          handleSubmitForm={handleSubmitFormCategory}
          formField={formFieldAddCategory}
        />
      )}
    </>
  );
};

export default Category;
