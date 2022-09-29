import ModalForm from '@/components/ModalForm';
import { addTopic, deleteTopic, getAnTopic, getTopics, updateTopic } from '@/services/lifetopic';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const LifeTopic = (props) => {
  const { house } = props;

  const column = [
    {
      title: 'Topic Name',
      dataIndex: 'name',
      search: false,
      //   width: '25%'
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
                key="editLifeTopic"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditLifeTopicForm(record)}
              >
                Edit
              </Button>
            </div>
            <div
              style={{
                width: '50%',
                marginRight: '8px',
              }}
            >
              <Button
                key="deleteHouse"
                type="danger"
                size="middle"
                block="true"
                icon={<DeleteOutlined />}
                onClick={() => handleOkDeleteLifeTopic(record)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      },
      width: '25%',
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFieldFormLifeTopic',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddLifeTopic',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddNameLifeTopic',
      label: 'Life Topic',
      width: 'lg',
      placeholder: 'Enter life topic name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input category name before submit',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddNameLifeTopic',
      label: 'Life Topic',
      width: 'lg',
      placeholder: 'Enter life topic name',
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
  const tableRef = useRef();
  const formLifeTopicRef = useRef();
  const editorRef = useRef();
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [lifeTopicRecord, setLifeTopicRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = useState('');
  //data table
  const [dataTable, setDataTable] = useState([]);
  //state trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //button submit
  const [buttonSubmitterLifeTopic, setButtonSubmitterLifeTopic] = useState(buttonSubmitter);
  //form field
  const [formFieldAddLifeTopic, setFormFieldAddLifeTopic] = useState(formFieldAdd);
  const [formFieldEditLifeTopic, setFormFieldEditLifeTopic] = useState(formFieldEdit);
  //paging table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(20);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);

  //get list lifetopic to table
  useEffect(() => {
    (async () => {
      const listLifeTopic = [];
      const params = {
        houseId: house.id,
        page: page,
        pageSize: pageSize,
      };
      const data = await getTopics(params);
      if (data?.payload) {
        data?.payload?.map((item, index) => {
          listLifeTopic[index] = item;
        });
        setTotal(data?.total);
        setDataTable(listLifeTopic);
      }
    })();
  }),
    [triggerDataTable];

  React.useEffect(() => {
    if (buttonEditLoading) {
      message.loading('Loading...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [buttonEditLoading]);

  //xuli loading button submit form add or edit
  useEffect(() => {
    const newButtonSubmitLifeTopic = buttonSubmitterLifeTopic.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterLifeTopic(newButtonSubmitLifeTopic);
  }, [buttonLoading]);

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setLifeTopicRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setLifeTopicRecord(null);
    if (formLifeTopicRef) {
      formLifeTopicRef?.current?.resetFields();
    }
  };

  const handleResetForm = () => {
    formLifeTopicRef?.current?.resetFields();
  };

  //xuli mo form edit planet House
  const handleEditLifeTopicForm = async (record) => {
    const idLifeTopic = record.id;
    setButtonEditLoading(true);
    const lifeTopic = await getAnTopic(idLifeTopic);
    setButtonEditLoading(false);
    if (lifeTopic?.id) {
      setLifeTopicRecord(lifeTopic);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formLifeTopicRef?.current?.setFieldsValue(lifeTopic);
    }
  };

  //handle submit form
  const handleSubmitFormLifeTopic = async (values) => {
    setButtonLoading(true);
    values.houseId = house.id;
    if (values.edit) {
      const idLifeTopic = lifeTopicRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      await updateTopic(idLifeTopic, dataEdit);
    } else {
      console.log('values ADD', values);
      await addTopic(values);
      handleResetForm();
    }
    setTriggerDataTable(!triggerDataTable);
    setButtonLoading(false);
  };

  const handleOkDeleteLifeTopic = (record) => {
    deleteTopic(record.id);
    setTriggerDataTable(!triggerDataTable);
  };

  const onChangePaging = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    setTriggerDataTable(!triggerDataTable);
  };

  return (
    <>
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
            width: '70%',
          }}
        >
          <ProTable
            columns={column}
            actionRef={tableRef}
            onReset={true}
            size="small"
            cardBordered={{
              table: true,
            }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: (page, pageSize) => onChangePaging(page, pageSize),
            }}
            search={false}
            toolBarRender={(action) => [
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button
                  size="middle"
                  key="buttonAddAspect"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleModal()}
                >
                  Add
                </Button>
              </div>,
            ]}
            dataSource={dataTable}
          />
        </div>
      </div>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal="Editing"
          handleCancelModel={handleCancelModal}
          formRef={formLifeTopicRef}
          buttonSubmitter={buttonSubmitterLifeTopic}
          handleSubmitForm={handleSubmitFormLifeTopic}
          formField={formFieldEditLifeTopic}
          handleResetForm={handleResetForm}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add"
          handleCancelModel={handleCancelModal}
          formRef={formLifeTopicRef}
          buttonSubmitter={buttonSubmitterLifeTopic}
          handleSubmitForm={handleSubmitFormLifeTopic}
          formField={formFieldAddLifeTopic}
          handleResetForm={handleResetForm}
        />
      )}
    </>
  );
};

export default LifeTopic;
