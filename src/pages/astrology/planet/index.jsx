import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, message, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { addPlanet, getPlanets } from '@/services/planet';
import { getZodiacs } from '@/services/ant-design-pro/zodiac';
import {
  getPlanetZodiacs,
  getAnPlanetZodiac,
  updatePlanetZodiac,
  addPlanetZodiac,
} from '@/services/planetzodiac';
import { uploadFile } from '@/utils/uploadFile';
import { PageContainer } from '@ant-design/pro-layout';
import ProSkeleton from '@ant-design/pro-skeleton';
import Meta from 'antd/lib/card/Meta';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import PlanetList from './component/PlanetList';
import { Content } from 'antd/lib/layout/layout';

const Planet = () => {
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
      fieldType: 'ShortDescription',
      title: 'Short Description',
      nameTextArea: 'description',
    },
    {
      fieldType: 'EditorMainContent',
      title: 'Content',
      nameTextArea: 'mainContent',
    },
  ];

  const formPlanetRef = useRef();
  const editorRef = useRef();
  const editorShortDescriptionRef = useRef();
  //state de render skeleton khi chua load dc list planet
  const [loadingPlanet, setLoadingPlanet] = useState(false);
  //data planet list
  const [dataList, setDataList] = useState([]);
  //state cua editor
  const [stateShortDescriptionEditor, setStateShortDescriptionEditor] = useState(null);
  const [stateEditor, setStateEditor] = useState(null);
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [planetRecord, setPlanetRecord] = useState(null);
  //state trigger render table
  const [triggerAddNewPlanet, setTriggerAddNewPlanet] = useState(false);

  //button submit
  const [buttonSubmitterPlanet, setButtonSubmitterPlanet] = useState(buttonSubmitter);
  //form field
  const [formFieldAddPlanet, setFormFieldAddPlanet] = useState(formFieldAdd);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);

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

  //load list Planet
  useEffect(() => {
    (async () => {
      setLoadingPlanet(true);
      const listPlanet = await getPlanets();
      if (listPlanet?.payload) {
        const listDataSrc = [];
        listPlanet?.payload?.map((item) => {
          const planet = {};
          planet.id = item?.id;
          planet.avatar = item?.icon;
          planet.name = item?.name;
          planet.title = item?.name;
          planet.selected = false;
          listDataSrc.push(planet);
        });
        setDataList(listDataSrc);
      }
      setLoadingPlanet(false);
    })();
  }, [triggerAddNewPlanet]);

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

  //handle click card
  const handleClickCard = (item) => {};

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setPlanetRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setPlanetRecord(null);
    setImgLinkFirebase(null);
    setStateEditor(null);
    setStateShortDescriptionEditor(null);
    if (formPlanetRef) {
      formPlanetRef?.current?.resetFields();
    }
  };

  const handleResetForm = () => {
    formPlanetRef?.current?.resetFields();
    setStateShortDescriptionEditor(null);
    setStateEditor(null);
  };

  //handle submit form
  const handleSubmitFormPlanet = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.mainContent);
    setStateShortDescriptionEditor(values.description);
    const result = await addPlanet(values);
    console.log('result', result);
    if (result.id) {
      handleResetForm();
      setStateEditor(null);
      setStateShortDescriptionEditor(null);
      setImgLinkFirebase(null);
      setButtonLoading(false);
      setTriggerAddNewPlanet(!triggerAddNewPlanet);
    }
  };

  const handleChangeStateEditor = (content) => {
    formPlanetRef?.current?.setFieldsValue({
      ['mainContent']: content,
    });
  };

  const handleChangeStateShortDescriptionEditor = (content) => {
    formPlanetRef?.current?.setFieldsValue({
      ['description']: content,
    });
  };

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
            Thêm Hành Tinh Mới
          </Button> */}
          {loadingPlanet ? (
            <ProSkeleton type="list" statistic={false} />
          ) : (
            <PlanetList dataList={dataList} />
          )}
        </Content>
      </PageContainer>

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
        stateShortDescriptionEditor={stateShortDescriptionEditor}
        handleChangeStateShortDescriptionEditor={handleChangeStateShortDescriptionEditor}
        handleChangeStateEditor={handleChangeStateEditor}
        editorRef={editorRef}
        editorShortDescriptionRef={editorShortDescriptionRef}
        handleUploadImgInEditor={handleUploadImgInEditor}
        handleResetForm={handleResetForm}
      />
    </>
  );
};

export default Planet;
