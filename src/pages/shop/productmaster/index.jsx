import ModalForm from '@/components/ModalForm';
import { uploadFile } from '@/utils/uploadFile';
import { EditOutlined, PlusOutlined, FileAddOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Space, Tag } from 'antd';
import React from 'react';
import { addProductMaster, deleteProductMaster } from '@/services/productmaster';
import { getProductMasters, updateProductMaster } from '@/services/productmaster';
import { getCategories } from '@/services/category';
const ProductMaster = () => {
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      copyable: true,
      valueType: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter product name to search',
          },
        ],
      },
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      copyable: true,
      valueType: 'description',
      search: false,
      width: '40%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'status',
      render: (_, record) => (
        <Space>
          {record.status == '1' && <Tag color="green">Active</Tag>}
          {record.status == '0' && <Tag color="red">Unactive</Tag>}
        </Space>
      ),
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      search: false,
      render: (_, record) => {
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '50%',
                marginRight: '8px',
              }}
            >
              <Button
                key="editProduct"
                type="primary"
                size="middle"
                icon={<EditOutlined />}
                block="true"
                onClick={() => handleEditProductMasterForm(record)}
              >
                Edit
              </Button>
            </div>
            <div
              style={{
                width: '50%',
              }}
            >
              <Button
                key="assignProduct"
                type="default"
                size="middle"
                icon={<FileAddOutlined />}
                block="true"
                onClick={() => handleAddVariantProduct(record)}
              >
                Assign Product
              </Button>
            </div>
          </div>
        );
      },
      width: '50%',
    },
  ];

  const columnVariantTable = [
    {
      title: 'Size',
      dataIndex: 'size',
      copyable: true,
      valueType: 'size',
      sorter: (a, b) => a.size.localeCompare(b.size),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter size to search',
          },
        ],
      },
      width: '10%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      copyable: true,
      valueType: 'price',
      sorter: (a, b) => a.price.localeCompare(b.price),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter price to search',
          },
        ],
      },
      width: '15%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      copyable: true,
      valueType: 'gender',
      search: false,
      render: (_, record) => (
        <Space>
          {record.gender == '0' && <Tag color={'pink'}>Male</Tag>}
          {record.gender == '1' && <Tag color={'blue'}>Female</Tag>}
        </Space>
      ),
      width: '10%',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      valueType: 'color',
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Color to search',
          },
        ],
      },
      width: '15%',
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      copyable: true,
      valueType: 'inventory',
      sorter: (a, b) => a.inventory - b.inventory,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Inventory to search',
          },
        ],
      },
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      search: false,
      render: (_, record) => {
        return (
          <Button
            key="editProduct"
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            block="true"
            onClick={() => handleEditProductVariantForm(record)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFieldFormProduct',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddProduct',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddName',
      label: 'Name',
      width: 'lg',
      placeholder: 'Enter product name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input name before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter product description',
      name: 'description',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddDetail',
      label: 'Detail',
      width: 'lg',
      placeholder: 'Enter product detail',
      name: 'detail',
      requiredField: 'true',
      ruleMessage: 'Input detail before submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectCategoryId',
      name: 'categoryId',
      label: 'Category',
      placeholder: 'Select Category',
      requiredField: 'true',
      ruleMessage: 'Please select category',
      //lấy category và update lại formselect sau
      valueEnum: [],
    },
    {
      fieldType: 'uploadListImg',
      nameUpload: 'uploadListImg',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddName',
      label: 'Name',
      width: 'lg',
      placeholder: 'Enter product name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input name before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter product description',
      name: 'description',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddDetail',
      label: 'Detail',
      width: 'lg',
      placeholder: 'Enter product detail',
      name: 'detail',
      requiredField: 'true',
      ruleMessage: 'Input detail before submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectStatusProduct',
      name: 'status',
      label: 'Status',
      defaultValue: 1,
      valueEnum: [
        {
          valueName: 1,
          valueDisplay: 'Active',
        },
        {
          valueName: 0,
          valueDisplay: 'Unactive',
        },
      ],
      placeholder: 'Please select status',
      requiredField: 'true',
      ruleMessage: 'Please select product status',
    },
    {
      fieldType: 'formSelect',
      key: 'selectCategoryId',
      name: 'categoryId',
      label: 'Category',
      placeholder: 'Select Category',
      requiredField: 'true',
      ruleMessage: 'Please select category',
      //lấy category và update lại formselect sau
      valueEnum: [],
    },
    {
      fieldType: 'uploadListImg',
      nameUpload: 'uploadListImg',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];
  //ref
  const tableProductMasterRef = React.useRef();
  const formProductMasterRef = React.useRef();

  //state cua list category;
  const [categoryList, setCategoryList] = React.useState([]);
  //state cua upload img len firebase
  const [listImgLinkFirebase, setListImgLinkFirebase] = React.useState([]);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);

  // state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [productMasterRecord, setProductMasterRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterProductMaster, setButtonSubmitterProductMaster] =
    React.useState(buttonSubmitter);
  const [formFieldAddProductMaster, setFormFieldAddProductMaster] = React.useState(formFieldAdd);
  const [formFieldEditProductMaster, setFormFieldEditProductMaster] = React.useState(formFieldEdit);

  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(10);
  //paging product variant
  const [pageVariant, setPageVariant] = React.useState(1);
  const [pageSizeVariant, setPageSizeVariant] = React.useState(8);
  const [totalVariant, setTotalVariant] = React.useState(10);

  //xuli loading upload img firebase
  React.useEffect(() => {
    if (loadingUploadImgFirebase) {
      message.loading('Uploading', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [loadingUploadImgFirebase]);

  React.useEffect(() => {
    (async () => {
      const result = await getCategories();
      if (result?.payload?.length > 0) {
        setCategoryList(result?.payload);
        const valueEnum = [];
        result?.payload?.map((item) => {
          const el = {
            valueName: item.id,
            valueDisplay: item.name,
          };
          valueEnum.push(el);
        });
        const newFieldAdd = [];
        formFieldAdd?.map((item, i) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectCategoryId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        setFormFieldAddProductMaster(newFieldAdd);
        const newFieldEdit = [];
        formFieldEdit?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectCategoryId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        setFormFieldEditProductMaster(newFieldEdit);
      }
    })();
  }, []);

  //xuli pass productmaster record
  React.useEffect(() => {
    if (productMasterRecord) {
      formProductMasterRef?.current?.setFieldsValue(productMasterRecord);
    }
  }, [productMasterRecord]);

  //xuli loading button submit form add or edit planet
  React.useEffect(() => {
    const newButtonSubmitterPM = buttonSubmitterProductMaster.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterProductMaster(newButtonSubmitterPM);
  }, [buttonLoading]);
  //customupload img
  const customUpload = async ({ onError, onSuccess, file }) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      setLoadingUploadingImgFirebase(false);
      message.destroy();
      message.error('You can only upload IMAGE file!');
      return isImage;
    }
    const isLt4M = file.size / 1024 / 1024 < 4;
    if (!isLt4M) {
      message.error('Image must smaller than 4MB!');
      return isLt4M;
    }
    try {
      setLoadingUploadingImgFirebase(true);
      console.log('fileUploading', file);
      const imgLink = await uploadFile(file, 'productmaster');

      if (imgLink) {
        const newListImg = [...listImgLinkFirebase];
        console.log('newListImg', newListImg);

        newListImg.push(imgLink);
        setListImgLinkFirebase(newListImg);

        setLoadingUploadingImgFirebase(false);
        message.success('Upload Image Success!');
      }
    } catch (error) {
      setLoadingUploadingImgFirebase(false);
      onError(error);
    }
  };

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    //khi huy modal phai reset flag edit ve rong
    setFlagEditForm('');
    setProductMasterRecord(null);
    setListImgLinkFirebase([]);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setProductMasterRecord(null);
    setListImgLinkFirebase([]);
    if (formProductMasterRef) {
      formProductMasterRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formProductMasterRef?.current?.resetFields();
    setListImgLinkFirebase([]);
  };

  //xuli change list img
  const handleChangeListImgFirebase = (list) => {
    console.log('listImgFirebase', list);
    const newList = listImgLinkFirebase.filter((item) => {
      return item != list.file.thumbUrl;
    });
    setListImgLinkFirebase(newList);
  };

  //xuli submit form
  const handleSubmitFormProductMaster = async (values) => {
    setButtonLoading(true);
    if (values.edit) {
      const idPM = productMasterRecord.id;
      values.masterProductId = idPM;
      const newListImgEdit = [];
      listImgLinkFirebase.map((item) => {
        newListImgEdit.push(item);
      });
      values.imgLinksAdd = newListImgEdit;

      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      handleCancelModal();
      console.log('dataEdit', dataEdit);
      await updateProductMaster(idPM, dataEdit);
    } else {
      const newListImgAdd = [];
      listImgLinkFirebase.map((item) => {
        newListImgAdd.push(item);
      });
      values.imgLink = newListImgAdd;

      await addProductMaster(values);
      handleResetForm();
    }
    tableProductMasterRef?.current?.reload();
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditProductMasterForm = (record) => {
    setFlagEditForm('edit');
    setShowModal(!showModal);
    setProductMasterRecord(record);
    setListImgLinkFirebase(record.imgLinks);
    console.log('productmaster', record);
  };

  const handleAddVariantProduct = (record) => {};
  const expandedTableRender = () => {
    return <ProTable />;
  };
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          actionRef={tableProductMasterRef}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onchange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Search',
            submittext: 'Submit',
            resetText: 'Reset',
          }}
          toolBarRender={(action) => [
            <Button
              size="middle"
              key="buttonAddUser"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModal()}
            >
              Add
            </Button>,
          ]}
          request={async (params, sort, filter) => {
            const currentAttr = 'current';
            const pageSizeAttr = 'pageSize';
            const newParams = Object.keys(params).reduce((item, key) => {
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
            const data = [];
            await getProductMasters(newParams).then((res) => {
              console.log('res at table query', res);
              res?.payload?.map((item, index) => {
                item.number = index + 1;
                data[index] = item;
              });
              setTotal(res?.total);
            });
            return {
              data: data,
              success: true,
            };
          }}
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Edit ${productMasterRecord.name}`}
          handleCancelModel={handleCancelModal}
          formRef={formProductMasterRef}
          buttonSubmitter={buttonSubmitterProductMaster}
          handleSubmitForm={handleSubmitFormProductMaster}
          formField={formFieldEditProductMaster}
          customUpload={customUpload}
          listImgLinkFirebase={listImgLinkFirebase}
          handleResetForm={handleResetForm}
          handleChangeListImgFirebase={handleChangeListImgFirebase}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New Product Master"
          handleCancelModel={handleCancelModal}
          formRef={formProductMasterRef}
          buttonSubmitter={buttonSubmitterProductMaster}
          handleSubmitForm={handleSubmitFormProductMaster}
          formField={formFieldAddProductMaster}
          customUpload={customUpload}
          listImgLinkFirebase={listImgLinkFirebase}
          handleResetForm={handleResetForm}
        />
      )}
    </>
  );
};

export default ProductMaster;
