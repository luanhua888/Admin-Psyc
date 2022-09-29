import React, { useEffect, useState } from 'react';
import { Button, message, Space, Image } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import { uploadFile } from '@/utils/uploadFile';
import {
  addZodiac,
  getZodiacs,
  deleteZodiac,
  updateZodiac,
  getAnZodiac,
} from '@/services/ant-design-pro/zodiac';
import showConfirm from '@/components/ModalConfirm';
import ProSkeleton from '@ant-design/pro-skeleton';
import ZodiacList from './component/ZodiacList';
import { Content } from 'antd/lib/layout/layout';

const Zodiac = () => {
  const buttonSubmitter = [
    {
      key: 'clearFieldFormZodiac',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddZodiac',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddZodiacName',
      label: 'Zodiac Name',
      width: 'lg',
      placeholder: 'Enter Zodiac Name',
      name: 'zodiacName',
      requiredField: 'true',
      ruleMessage: 'Input Zodiac Name before submit',
    },
    {
      fieldType: 'formCalendar',
      labelTimeDay: 'Zodiac Time Day Start',
      nameTimeDay: 'zodiacDayStart',
      minTimeDay: '1',
      maxTimeDay: '31',
      placeholderTimeDay: 'Zodiac Day Start',
      controlsTimeDay: 'false',

      labelTimeMonth: 'Zodiac Time Month Start',
      nameTimeMonth: 'zodiacMonthStart',
      minTimeMonth: '1',
      maxTimeMonth: '12',
      placeholderTimeMonth: 'Zodiac Month Start',
      controlsTimeMonth: 'false',
    },
    {
      fieldType: 'formCalendar',
      labelTimeDay: 'Zodiac Time Day End',
      nameTimeDay: 'zodiacDayEnd',
      minTimeDay: '1',
      maxTimeDay: '31',
      placeholderTimeDay: 'Zodiac Day End',
      controlsTimeDay: 'false',

      fieldType: 'formCalendar',
      labelTimeMonth: 'Zodiac Time Month End',
      nameTimeMonth: 'zodiacMonthEnd',
      minTimeMonth: '1',
      maxTimeMonth: '12',
      placeholderTimeMonth: 'Zodiac Month End',
      controlsTimeMonth: 'false',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Zodiac Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'zodiacIcon',
      nameUpload: 'iconZodiac',
      nameInputFile: 'zodiacFileToFirebase',
      readOnly: true,
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddZodiacDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter Zodiac description',
      name: 'zodiacDescription',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'zodiacMainContent',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldEditZodiacName',
      label: 'Zodiac Name',
      width: 'lg',
      placeholder: 'Enter Zodiac Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input Zodiac Name before submit',
    },
    {
      fieldType: 'formCalendar',
      labelTimeDay: 'Zodiac Time Day Start',
      nameTimeDay: 'zodiacDayStart',
      minTimeDay: '1',
      maxTimeDay: '31',
      placeholderTimeDay: 'Zodiac Day Start',
      controlsTimeDay: 'false',

      labelTimeMonth: 'Zodiac Time Month Start',
      nameTimeMonth: 'zodiacMonthStart',
      minTimeMonth: '1',
      maxTimeMonth: '12',
      placeholderTimeMonth: 'Zodiac Month Start',
      controlsTimeMonth: 'false',
    },
    {
      fieldType: 'formCalendar',
      labelTimeDay: 'Zodiac Time Day End',
      nameTimeDay: 'zodiacDayEnd',
      minTimeDay: '1',
      maxTimeDay: '31',
      placeholderTimeDay: 'Zodiac Day End',
      controlsTimeDay: 'false',

      fieldType: 'formCalendar',
      labelTimeMonth: 'Zodiac Time Month End',
      nameTimeMonth: 'zodiacMonthEnd',
      minTimeMonth: '1',
      maxTimeMonth: '12',
      placeholderTimeMonth: 'Zodiac Month End',
      controlsTimeMonth: 'false',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Zodiac Icon',
      width: 'lg',
      placeholder: 'Icon Link',
      name: 'icon',
      nameUpload: 'iconZodiac',
      nameInputFile: 'zodiacFileToFirebase',
      readOnly: true,
      requiredField: true,
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddZodiacDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter Zodiac description',
      name: 'descreiption',
      requiredField: 'true',
      ruleMessage: 'Input description before submit',
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'zodiacMainContent',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  const tableZodiacRef = React.useRef();
  const formZodiacRef = React.useRef();
  const editorRef = React.useRef();
  //state của uploadimg lên firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua text editor
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [zodiacRecord, setZodiacRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterZodiac, setButtonSubmitterZodiac] = React.useState(buttonSubmitter);
  const [formFieldAddZodiac, setFormFieldAddZodiac] = React.useState(formFieldAdd);
  const [formFieldEditZodiac, setFormFieldEditZodiac] = React.useState(formFieldEdit);
  //loading zodiac
  const [loadingZodiac, setLoadingZodiac] = useState(false);
  //trigger load list zodiac when add new
  const [triggerAddNewZodiac, setTriggerAddNewZodiac] = useState(false);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  //list data zodiac
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    (async () => {
      setLoadingZodiac(true);
      const listZodiac = await getZodiacs();
      if (listZodiac?.data) {
        const listDataSrc = [];
        listZodiac.data?.map((item) => {
          const zodiac = {};
          zodiac.id = item?.id;
          zodiac.avatar = item?.imageUrl;
          zodiac.name = item?.name;
          zodiac.title = item?.name;
          zodiac.selected = false;
          listDataSrc.push(zodiac);
        });
        setDataList(listDataSrc);
      }
      setLoadingZodiac(false);
    })();
  }, [triggerAddNewZodiac]);

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

  //xuli loading button submit form add or edit zodiac
  React.useEffect(() => {
    const newButtonSubmitZodiac = buttonSubmitterZodiac.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterZodiac(newButtonSubmitZodiac);
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
      const imgLink = await uploadFile(file, 'zodiac');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        if (flagEditForm) {
          formZodiacRef?.current?.setFieldsValue({
            ['icon']: imgLink,
          });
        } else {
          formZodiacRef?.current?.setFieldsValue({
            ['zodiacIcon']: imgLink,
          });
        }
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
    setZodiacRecord(null);
    setImgLinkFirebase(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setZodiacRecord(null);
    setImgLinkFirebase(null);
    setStateEditor(null);
    if (formZodiacRef) {
      formZodiacRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formZodiacRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormZodiac = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.zodiacMainContent);
    if (values.edit) {
      const idZodiac = zodiacRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      dataEdit.zodiacDescription = dataEdit.descreiption;
      delete dataEdit.descreiption;
      dataEdit.zodiacName = dataEdit.name;
      delete dataEdit.name;
      dataEdit.zodiacIcon = dataEdit.icon;
      delete dataEdit.icon;
      // handleCancelModal();
      await updateZodiac(idZodiac, dataEdit);
    } else {
      console.log(values);
      await addZodiac(values);
      handleResetForm();
      setStateEditor(null);
    }
    tableZodiacRef?.current?.reload();
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditZodiacForm = async (record) => {
    const idZodiac = record.id;
    setButtonEditLoading(true);
    const zodiac = await getAnZodiac(idZodiac);
    setButtonEditLoading(false);
    if (zodiac?.name) {
      const newObjRecord = { ...zodiac };
      newObjRecord.zodiacMainContent = newObjRecord.mainContent;
      delete newObjRecord.mainContent;
      setZodiacRecord(newObjRecord);
      setStateEditor(newObjRecord.zodiacMainContent);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formZodiacRef?.current?.setFieldsValue(newObjRecord);
    }
  };

  //xuli delete zodiac
  const handleOkDeleteZodiac = async (record) => {
    const result = await deleteZodiac(record.id);
    // console.log('record delete', record);
    if (result) {
      tableZodiacRef?.current?.reload();
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (content) => {
    if (content) {
      formZodiacRef?.current?.setFieldsValue({
        ['zodiacMainContent']: content,
      });
    }
  };

  //xuli up anh trong text editor
  const handleUploadImgInEditor = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      try {
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

  return (
    <>
      <PageContainer>
        <Content
          style={{
            padding: '50px 100px',
          }}
        >
          {/* <Button
            size="middle"
            key="buttonAddPlanet"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleModal()}
          >
            Thêm Cung Hoàng Đạo Mới
          </Button> */}
          {loadingZodiac ? (
            <ProSkeleton type="list" statistic={false} />
          ) : (
            <ZodiacList dataList={dataList} />
          )}
        </Content>
      </PageContainer>

      <ModalForm
        showModal={showModal}
        titleModal="Add New Zodiac"
        widthModal="900"
        handleCancelModel={handleCancelModal}
        formRef={formZodiacRef}
        buttonSubmitter={buttonSubmitterZodiac}
        handleSubmitForm={handleSubmitFormZodiac}
        formField={formFieldAddZodiac}
        customUpload={customUpload}
        imgLinkFirebase={imgLinkFirebase}
        stateEditor={stateEditor}
        handleChangeStateEditor={handleChangeStateEditor}
        editorRef={editorRef}
        handleUploadImgInEditor={handleUploadImgInEditor}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default Zodiac;
