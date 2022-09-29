import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image, message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import style from './zodiacdetail.less';
import { Content } from 'antd/lib/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { uploadFile } from '@/utils/uploadFile';
import { updateZodiac } from '@/services/ant-design-pro/zodiac';
import ModalForm from '@/components/ModalForm';

const ZodiacDetail = (props) => {
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

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldEditZodiacName',
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
      requiredField: true,
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'ShortDescription',
      title: 'Short Description',
      nameTextArea: 'zodiacDescription',
    },
    {
      fieldType: 'EditorMainContent',
      title: 'MainContent',
      nameTextArea: 'zodiacMainContent',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];
  const { zodiac, handleTriggerLoadZodiac } = props;
  const formZodiacRef = useRef();
  const editorRef = useRef();
  const editorShortDescriptionRef = useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua editor
  const [stateEditor, setStateEditor] = React.useState(null);
  const [stateShortDescriptionEditor, setStateShortDescriptionEditor] = useState(null);

  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [buttonSubmitterZodiac, setButtonSubmitterZodiac] = React.useState(buttonSubmitter);
  const [formFieldEditZodiac, setFormFieldEditZodiac] = React.useState(formFieldEdit);
  const [flag, setFlag] = React.useState(false);
  const safeMainContent = DOMPurify.sanitize(zodiac?.descriptionDetail);
  const safeDescription = DOMPurify.sanitize(zodiac?.descriptionShort);

  //xuli loading upload img firebase
  useEffect(() => {
    if (loadingUploadImgFirebase) {
      message.loading('Uploading', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [loadingUploadImgFirebase]);

  useEffect(() => {
    const updateDescriptionZodiac = { ...zodiac };
    updateDescriptionZodiac.zodiacName = updateDescriptionZodiac.name;
    delete updateDescriptionZodiac.name;
    updateDescriptionZodiac.zodiacIcon = updateDescriptionZodiac.icon;
    delete updateDescriptionZodiac.icon;
    updateDescriptionZodiac.zodiacDescription = updateDescriptionZodiac.descreiption;
    delete updateDescriptionZodiac.descreiption;
    updateDescriptionZodiac.zodiacMainContent = updateDescriptionZodiac.mainContent;
    delete updateDescriptionZodiac.mainContent;
    formZodiacRef?.current?.setFieldsValue(updateDescriptionZodiac);
  }, [flag]);

  //xuli loading button submit form add or edit zodiac
  useEffect(() => {
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
        formZodiacRef?.current?.setFieldsValue({
          ['zodiacIcon']: imgLink,
        });
        setLoadingUploadingImgFirebase(false);
        message.success('Upload Image Success!');
      }
    } catch (error) {
      setLoadingUploadingImgFirebase(false);
      onError(error);
    }
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setImgLinkFirebase(null);
    setStateEditor(null);
    setStateShortDescriptionEditor(null);
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
    setStateShortDescriptionEditor(values.zodiacDescription);
    if (values.edit) {
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      await updateZodiac(zodiac?.id, dataEdit);
    }
    handleTriggerLoadZodiac();
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditZodiacForm = () => {
    if (zodiac?.name) {
      const newObjRecord = { ...zodiac };
      newObjRecord.zodiacDescription = newObjRecord.descreiption;
      delete newObjRecord.descreiption;
      setStateEditor(newObjRecord.mainContent);
      setStateShortDescriptionEditor(newObjRecord.zodiacDescription);
      setShowModal(!showModal);
      setFlag(!flag);
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (state) => {
    if (state) {
      formZodiacRef?.current?.setFieldsValue({
        ['zodiacMainContent']: state,
      });
    }
  };

  const handleChangeStateShortDescriptionEditor = (content) => {
    formZodiacRef?.current?.setFieldsValue({
      ['zodiacDescription']: content,
    });
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
      <Content
        className={style.site_layout_background}
        style={{
          padding: '40px 50px',
        }}
      >
        <Button
          className={style.button_floading}
          type="primary"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => handleEditZodiacForm()}
        />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Title className={style.title}>{zodiac?.name}</Title>
          <Image
            width={50}
            src={zodiac?.imageUrl}
            preview={false}
            style={{
              marginLeft: '12px',
              marginBottom: '12px',
            }}
          />
        </div>

        <Paragraph
          style={{
            margin: '12px 0px',
            width: '70%',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: safeDescription }} />
        </Paragraph>
        <Paragraph>
          <div dangerouslySetInnerHTML={{ __html: safeMainContent }} />
        </Paragraph>
      </Content>

      <ModalForm
        showModal={showModal}
        titleModal={`Edit ${zodiac.name}`}
        widthModal="900"
        handleCancelModel={handleCancelModal}
        formRef={formZodiacRef}
        buttonSubmitter={buttonSubmitterZodiac}
        handleSubmitForm={handleSubmitFormZodiac}
        formField={formFieldEditZodiac}
        customUpload={customUpload}
        imgLinkFirebase={imgLinkFirebase}
        stateEditor={stateEditor}
        stateShortDescriptionEditor={stateShortDescriptionEditor}
        handleChangeStateShortDescriptionEditor={handleChangeStateShortDescriptionEditor}
        handleChangeStateEditor={handleChangeStateEditor}
        editorRef={editorRef}
        handleUploadImgInEditor={handleUploadImgInEditor}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default ZodiacDetail;
