import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, message, Space } from 'antd';
import React from 'react';
import { addHouse, getHouses, deleteHouse, updateHouse, getAnHouse } from '@/services/house';
import { uploadFile } from '@/utils/uploadFile';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import LifeTopic from './component/LifeTopic';
const House = () => {
  //config column table
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
      width: '15%',
    },
    {
      title: 'House Name',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: true,
      onFilter: true,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter House Name to search',
          },
        ],
      },
      width: '25%',
    },
    {
      title: 'House Icon',
      dataIndex: 'icon',
      copyable: true,
      search: false,
      render: (_, record) => {
        return (
          <Space>
            <Image width={50} src={record.icon} />
          </Space>
        );
      },
      width: '25%',
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
                key="editHouse"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditHouseForm(record)}
              >
                Edit
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
      key: 'clearFieldFormHouse',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddHouse',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddHouseName',
      label: 'House Name',
      width: 'lg',
      placeholder: 'Enter House Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input House Name before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddHouseTitle',
      label: 'House Title',
      width: 'lg',
      placeholder: 'Enter House Title',
      name: 'title',
      requiredField: 'true',
      ruleMessage: 'Input House Title before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddHouseTag',
      label: 'House Tag',
      width: 'lg',
      placeholder: 'Enter House Tag',
      name: 'tag',
      requiredField: 'true',
      ruleMessage: 'Input House Tag before submit',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'House Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'icon',
      nameUpload: 'iconHouse',
      nameInputFile: 'houseFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddHouseDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter House description',
      name: 'description',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'mainContent',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddHouseName',
      label: 'House Name',
      width: 'lg',
      placeholder: 'Enter House Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input House Name before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddHouseTitle',
      label: 'House Title',
      width: 'lg',
      placeholder: 'Enter House Title',
      name: 'title',
      requiredField: 'true',
      ruleMessage: 'Input House Title before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddHouseTag',
      label: 'House Tag',
      width: 'lg',
      placeholder: 'Enter House Tag',
      name: 'tag',
      requiredField: 'true',
      ruleMessage: 'Input House Tag before submit',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'House Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'icon',
      nameUpload: 'iconHouse',
      nameInputFile: 'houseFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddHouseDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter House description',
      name: 'description',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'mainContent',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  //ref cua table, editor, form
  const tableHouseRef = React.useRef();
  const formHouseRef = React.useRef();
  const editorRef = React.useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua editor
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [houseRecord, setHouseRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterHouse, setButtonSubmitterHouse] = React.useState(buttonSubmitter);
  const [formFieldAddHouse, setFormFieldAddHouse] = React.useState(formFieldAdd);
  const [formFieldEditHouse, setFormFieldEditHouse] = React.useState(formFieldEdit);
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(20);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
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
    if (buttonEditLoading) {
      message.loading('Loading...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [buttonEditLoading]);
  //xuli loading button submit form add or edit house
  React.useEffect(() => {
    const newButtonSubmitHouse = buttonSubmitterHouse.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterHouse(newButtonSubmitHouse);
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
      const imgLink = await uploadFile(file, 'house');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formHouseRef?.current?.setFieldsValue({
          ['icon']: imgLink,
        });
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
    setFlagEditForm('');
    setHouseRecord(null);
    setImgLinkFirebase(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setHouseRecord(null);
    setImgLinkFirebase(null);
    setStateEditor(null);
    if (formHouseRef) {
      formHouseRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formHouseRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormHouse = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.mainContent);
    if (values.edit) {
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      await updateHouse(houseRecord.id, dataEdit);
    } else {
      await addHouse(values);
      handleResetForm();
      setStateEditor(null);
    }
    tableHouseRef?.current?.reload();
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditHouseForm = async (record) => {
    const houseId = record.id;
    setButtonEditLoading(true);
    const house = await getAnHouse(houseId);
    setButtonEditLoading(false);
    if (house?.name) {
      const newObjRecord = { ...house };
      newObjRecord.description = newObjRecord.decription;
      delete newObjRecord.decription;
      setHouseRecord(newObjRecord);
      setStateEditor(newObjRecord.mainContent);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formHouseRef?.current?.setFieldsValue(newObjRecord);
    }
  };

  //xuli delete house
  const handleOkDeleteHouse = async (record) => {
    const result = await deleteHouse(record.id);
    if (result) {
      tableHouseRef?.current?.reload();
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (state) => {
    if (state) {
      formHouseRef?.current?.setFieldsValue({
        ['mainContent']: state,
      });
    }
  };

  //xuli up anh trong text editor
  const handleUploadImgInEditor = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    console.log('A');
    input.onchange = async () => {
      console.log('b');

      try {
        console.log('c');

        let file = input.files[0];
        message.loading('Upload...', 9999);
        const imgLinkEditor = await uploadFile(file, 'editor');
        message.destroy();
        if (imgLinkEditor) {
          message.success('Add Image Success!');
          const range = editorRef?.current?.getEditorSelection();
          editorRef?.current?.getEditor().insertEmbed(range.index, 'image', imgLinkEditor);
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  const expandedRowRender = (record) => {
    return <LifeTopic house={record} />;
  };
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          actionRef={tableHouseRef}
          rowKey={(record) => record.id}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
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
          expandable={{
            expandedRowRender,
          }}
          // toolBarRender={(action) => [
          //   <Button
          //     size="middle"
          //     key="buttonAddHouse"
          //     type="primary"
          //     icon={<PlusOutlined />}
          //     onClick={() => handleModal()}
          //   >
          //     Add
          //   </Button>,
          // ]}
          request={async (params, sort, filter) => {
            const currentAttr = 'current';
            const pageSizeAttr = 'pageSize';
            console.log(params);
            const data = [];
            if (params.name) {
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

              await getHouses(newParams).then((res) => {
                res?.payload?.map((item, index) => {
                  item.number = index + 1;
                  data[index] = item;
                });
                setTotal(res?.total);
              });
            } else {
              await getHouses().then((res) => {
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
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Edit ${houseRecord.name}`}
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formHouseRef}
          buttonSubmitter={buttonSubmitterHouse}
          handleSubmitForm={handleSubmitFormHouse}
          formField={formFieldEditHouse}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New House"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formHouseRef}
          buttonSubmitter={buttonSubmitterHouse}
          handleSubmitForm={handleSubmitFormHouse}
          formField={formFieldAddHouse}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      )}
    </>
  );
};

export default House;
