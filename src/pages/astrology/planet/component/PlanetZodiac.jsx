import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Modal, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getZodiacs } from '@/services/ant-design-pro/zodiac';
import {
  getPlanetZodiacs,
  getAnPlanetZodiac,
  updatePlanetZodiac,
  addPlanetZodiac,
} from '@/services/planetzodiac';
import { uploadFile } from '@/utils/uploadFile';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import { Content } from 'antd/lib/layout/layout';
import ProSkeleton from '@ant-design/pro-skeleton';
import ListZodiac from '@/components/ListZodiac/ListZodiac';
import { browserHistory } from 'react-router';
import PlanetZodiacDetail from './PlanetZodiacDetail';

const PlanetZodiac = (props) => {
  const { planet } = props;

  const buttonSubmitter = [
    {
      key: 'clearFieldFormPlanetZodiac',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddPlanetZodiac',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formSelect',
      key: 'selectZodiacId',
      name: 'zodiacId',
      label: 'Zodiac',
      placeholder: 'Select Zodiac',
      requiredField: 'true',
      ruleMessage: 'Please select Zodiac',
      valueEnum: [],
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'content',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formSelect',
      key: 'selectZodiacId',
      name: 'zodiacId',
      label: 'Zodiac',
      placeholder: 'Select Zodiac',
      requiredField: 'true',
      ruleMessage: 'Please select Zodiac',
      valueEnum: [],
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'content',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  const tableRef = useRef();
  const formPlanetZodiacRef = useRef();
  const editorRef = useRef();
  //state cua editor
  const [stateEditor, setStateEditor] = useState(null);
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [planetZodiacRecord, setPlanetZodiacRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = useState('');
  //data table
  const [dataTable, setDataTable] = useState([]);
  //state trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //button submit
  const [buttonSubmitterPlanetZodiac, setButtonSubmitterPlanetZodiac] = useState(buttonSubmitter);
  //form field
  const [formFieldAddPlanetZodiac, setFormFieldAddPlanetZodiac] = useState(formFieldAdd);
  const [formFieldEditPlanetZodiac, setFormFieldEditPlanetZodiac] = useState(formFieldEdit);
  //paging table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(20);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);
  //dataListZodiac
  const [dataList, setDataList] = useState([]);
  //loading List Zodiac
  const [loadingListZodiac, setLoadingListZodiac] = useState(false);
  //button view loading
  const [viewLoading, setViewLoading] = useState(false);
  //modalViewDetail
  const [modalViewDetail, setModalViewDetail] = useState(false);
  //destroy all modal when router change
  // browserHistory.listen(() => {
  //   Modal.destroyAll();
  // });
  //load list zodiac
  useEffect(() => {
    (async () => {
      setLoadingListZodiac(true);
      const result = await getZodiacs();
      if (result?.payload?.length > 0) {
        const listDataSrc = [];
        result?.payload?.map((item) => {
          const zodiac = {};
          zodiac.id = item.id;
          zodiac.avatar = item.icon;
          zodiac.name = item.name;
          zodiac.title = item.name;
          zodiac.selected = false;
          listDataSrc.push(zodiac);
        });
        setDataList(listDataSrc);
        //set field
        const valueEnum = [];
        result?.payload?.map((item) => {
          const el = {
            valueName: item.id,
            valueDisplay: item.name,
          };
          valueEnum.push(el);
        });
        const newFieldAdd = [];
        formFieldAddPlanetZodiac?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectZodiacId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        setFormFieldAddPlanetZodiac(newFieldAdd);
        const newFieldEdit = [];
        formFieldEditPlanetZodiac?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectZodiacId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        setFormFieldEditPlanetZodiac(newFieldEdit);
      }
      setLoadingListZodiac(false);
    })();
  }, []);

  React.useEffect(() => {
    if (buttonEditLoading || viewLoading) {
      message.loading('Loading...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [buttonEditLoading, viewLoading]);

  //xuli loading button submit form add or edit
  useEffect(() => {
    const newButtonSubmitPlanetZodiac = buttonSubmitterPlanetZodiac.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterPlanetZodiac(newButtonSubmitPlanetZodiac);
  }, [buttonLoading]);

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setPlanetZodiacRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setPlanetZodiacRecord(null);
    setStateEditor(null);
    if (formPlanetZodiacRef) {
      formPlanetZodiacRef?.current?.resetFields();
    }
  };
  const handleResetForm = () => {
    formPlanetZodiacRef?.current?.resetFields();
    setStateEditor(null);
    editorRef?.current?.getEditor().setContents([{ insert: '\n' }]);
  };
  //xuli mo form edit planet Zodiac
  const handleEditPlanetZodiacForm = async (record) => {
    if (modalViewDetail) {
      handleCancelModalViewDetail();
    }
    const idPlanetZodiac = record?.id;
    setButtonEditLoading(true);
    const planetZodiac = await getAnPlanetZodiac(planet?.name, planet?.id, idPlanetZodiac);
    setButtonEditLoading(false);
    if (planetZodiac?.id) {
      setPlanetZodiacRecord(planetZodiac);
      setStateEditor(planetZodiac?.content);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      console.log('planetZodiac', planetZodiac);
      formPlanetZodiacRef?.current?.setFieldsValue(planetZodiac);
    }
  };

  //handle submit form
  const handleSubmitFormPlanetZodiac = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.content);
    values.planetId = planet.id;
    if (values.edit) {
      const idPlanetZodiac = planetZodiacRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      console.log('dataEdit', dataEdit);
      await updatePlanetZodiac(planet.name, planet.id, idPlanetZodiac, dataEdit);
    } else {
      await addPlanetZodiac(planet.name, planet.id, values);
      handleResetForm();
      setStateEditor(null);
    }
    setTriggerDataTable(!triggerDataTable);
    setButtonLoading(false);
  };

  const handleChangeStateEditor = (content) => {
    formPlanetZodiacRef?.current?.setFieldsValue({
      ['content']: content,
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
  const handleClickCard = (item) => {};

  const handleButtonView = async (item) => {
    const params = {};
    params.zodiacId = item?.id;
    setViewLoading(true);
    const planetZodiac = await getPlanetZodiacs(planet?.name, planet?.id, params);
    console.log('params', params);

    console.log('planetZodiac', planetZodiac.payload[0]);

    if (planetZodiac?.payload) {
      setPlanetZodiacRecord(planetZodiac.payload[0]);
      setModalViewDetail(true);
    }
    setViewLoading(false);
  };

  const handleCancelModalViewDetail = () => {
    setModalViewDetail(false);
    setPlanetZodiacRecord(null);
  };
  return (
    <>
      <Content
        style={{
          padding: '16px',
          background: '#fff',
        }}
      >
        <Button
          size="middle"
          key="buttonAddPlanet"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleModal()}
          style={{
            marginBottom: '16px',
          }}
        >
          Thêm Dữ Liệu
        </Button>
        {loadingListZodiac ? (
          <ProSkeleton type="list" list="12" />
        ) : (
          <ListZodiac
            zodiacList={dataList}
            span={6}
            handleClickCard={handleClickCard}
            button={true}
            handleButtonView={handleButtonView}
          />
        )}
      </Content>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal="Editing"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formPlanetZodiacRef}
          buttonSubmitter={buttonSubmitterPlanetZodiac}
          handleSubmitForm={handleSubmitFormPlanetZodiac}
          formField={formFieldEditPlanetZodiac}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formPlanetZodiacRef}
          buttonSubmitter={buttonSubmitterPlanetZodiac}
          handleSubmitForm={handleSubmitFormPlanetZodiac}
          formField={formFieldAddPlanetZodiac}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      )}
      <Modal
        visible={modalViewDetail}
        onCancel={() => handleCancelModalViewDetail()}
        closable={false}
        title={
          planetZodiacRecord
            ? `Nội Dung Chi Tiết Của ${planetZodiacRecord?.planetName} và ${planetZodiacRecord?.zodiacName}`
            : 'Dữ liệu trống'
        }
        footer={[
          <Button
            key="cancelModelView"
            type="default"
            onClick={() => handleCancelModalViewDetail()}
          >
            Close
          </Button>,
        ]}
      >
        {planetZodiacRecord ? (
          <PlanetZodiacDetail
            planetZodiac={planetZodiacRecord}
            handleEditPlanetZodiacForm={handleEditPlanetZodiacForm}
            handleCancelModalViewDetail={handleCancelModalViewDetail}
          />
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </Modal>
    </>
  );
};

export default PlanetZodiac;
