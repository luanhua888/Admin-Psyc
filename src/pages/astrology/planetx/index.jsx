import { uploadFile } from '@/utils/uploadFile';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Image, message, Space } from 'antd';
import React from 'react';
import { addPlanet, getPlanets, deletePlanet, updatePlanet, getAnPlanet } from '@/services/planet';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';

const Planet = () => {
  //config column table
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
      width: '25%',
    },
    {
      title: 'Planet Name',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: true,
      onFilter: true,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Planet Name to search',
          },
        ],
      },
      width: '25%',
    },
    {
      title: 'Planet Icon',
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
                key="editPlanet"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditPlanetForm(record)}
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
                key="deletePlanet"
                type="danger"
                size="middle"
                block="true"
                icon={<DeleteOutlined />}
                onClick={() => handleOkDeletePlanet(record)}
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
      key: 'clearFieldFormPlanet',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddPlanet',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetName',
      label: 'Planet Name',
      width: 'lg',
      placeholder: 'Enter Planet Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input Planet Name before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetTitle',
      label: 'Planet Title',
      width: 'lg',
      placeholder: 'Enter Planet Title',
      name: 'title',
      requiredField: 'true',
      ruleMessage: 'Input Planet Title before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetTag',
      label: 'Planet Tag',
      width: 'lg',
      placeholder: 'Enter Planet Tag',
      name: 'tag',
      requiredField: 'true',
      ruleMessage: 'Input Planet Tag before submit',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Planet Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'icon',
      nameUpload: 'iconPlanet',
      nameInputFile: 'planetFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddPlanetDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter Planet description',
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
      key: 'fieldAddPlanetName',
      label: 'Planet Name',
      width: 'lg',
      placeholder: 'Enter Planet Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input Planet Name before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetTitle',
      label: 'Planet Title',
      width: 'lg',
      placeholder: 'Enter Planet Title',
      name: 'title',
      requiredField: 'true',
      ruleMessage: 'Input Planet Title before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddPlanetTag',
      label: 'Planet Tag',
      width: 'lg',
      placeholder: 'Enter Planet Tag',
      name: 'tag',
      requiredField: 'true',
      ruleMessage: 'Input Planet Tag before submit',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Planet Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'icon',
      nameUpload: 'iconPlanet',
      nameInputFile: 'planetFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddPlanetDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter Planet description',
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
  const tablePlanetRef = React.useRef();
  const formPlanetRef = React.useRef();
  const editorRef = React.useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua editor
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [planetRecord, setPlanetRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterPlanet, setButtonSubmitterPlanet] = React.useState(buttonSubmitter);
  const [formFieldAddPlanet, setFormFieldAddPlanet] = React.useState(formFieldAdd);
  const [formFieldEditPlanet, setFormFieldEditPlanet] = React.useState(formFieldEdit);
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

  //xuli loading button submit form add or edit planet
  React.useEffect(() => {
    const newButtonSubmitPlanet = buttonSubmitterPlanet.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterPlanet(newButtonSubmitPlanet);
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
      const imgLink = await uploadFile(file, 'planet');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formPlanetRef?.current?.setFieldsValue({
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
    setPlanetRecord(null);
    setImgLinkFirebase(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setPlanetRecord(null);
    setImgLinkFirebase(null);
    setStateEditor(null);
    if (formPlanetRef || tablePlanetRef) {
      formPlanetRef?.current?.resetFields();
      tablePlanetRef?.current?.reload();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formPlanetRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormPlanet = async (values) => {
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
      await updatePlanet(planetRecord.id, dataEdit);
    } else {
      await addPlanet(values);
      handleResetForm();
      setStateEditor(null);
    }
    tablePlanetRef?.current?.reload();
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditPlanetForm = async (record) => {
    const idPlanet = record.id;
    setButtonEditLoading(true);
    const planet = await getAnPlanet(idPlanet);
    setButtonEditLoading(false);
    if (planet?.name) {
      const newObjRecord = { ...planet };
      newObjRecord.description = newObjRecord.decription;
      delete newObjRecord.decription;
      setPlanetRecord(newObjRecord);
      setStateEditor(newObjRecord.mainContent);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formPlanetRef?.current?.setFieldsValue(newObjRecord);
    }
  };

  //xuli delete planet
  const handleOkDeletePlanet = async (record) => {
    const result = await deletePlanet(record.id);
    // console.log('record delete', record);
    if (result) {
      tablePlanetRef?.current?.reload();
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (state) => {
    if (state) {
      // setStateEditor(state);
      console.log('stateEditor', state);
      formPlanetRef?.current?.setFieldsValue({
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
        const imgLinkEditor = await uploadFile(file, 'editor');
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
  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          actionRef={tablePlanetRef}
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
              key="buttonAddPlanet"
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

              await getPlanets(newParams).then((res) => {
                res?.payload?.map((item, index) => {
                  item.number = index + 1;
                  data[index] = item;
                });
                setTotal(res?.total);
              });
            } else {
              await getPlanets().then((res) => {
                res?.payload.map((item, index) => {
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
          titleModal={`Edit ${planetRecord.name}`}
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formPlanetRef}
          buttonSubmitter={buttonSubmitterPlanet}
          handleSubmitForm={handleSubmitFormPlanet}
          formField={formFieldEditPlanet}
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
          titleModal="Add New Planet"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formPlanetRef}
          buttonSubmitter={buttonSubmitterPlanet}
          handleSubmitForm={handleSubmitFormPlanet}
          formField={formFieldAddPlanet}
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

export default Planet;
