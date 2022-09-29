import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getHouses } from '@/services/house';
import {
  getPlanetHouses,
  getAnPlanetHouse,
  updatePlanetHouse,
  addPlanetHouse,
} from '@/services/planethouse';
import { uploadFile } from '@/utils/uploadFile';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import { Content } from 'antd/lib/layout/layout';
import ListHouse from '@/components/ListHouse/ListHouse';
import PlanetHouseDetail from './PlanetHouseDetail';
import ProSkeleton from '@ant-design/pro-skeleton';

const PlanetHouse = (props) => {
  const { planet } = props;

  const buttonSubmitter = [
    {
      key: 'clearFieldFormPlanetHouse',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddPlanetHouse',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formSelect',
      key: 'selectHouseId',
      name: 'houseId',
      label: 'House',
      placeholder: 'Select House',
      requiredField: 'true',
      ruleMessage: 'Please select House',
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
      key: 'selectHouseId',
      name: 'houseId',
      label: 'House',
      placeholder: 'Select House',
      requiredField: 'true',
      ruleMessage: 'Please select House',
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

  const formPlanetHouseRef = useRef();
  const editorRef = useRef();

  //state cua editor
  const [stateEditor, setStateEditor] = useState(null);
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [planetHouseRecord, setPlanetHouseRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = useState('');
  //data table
  const [dataTable, setDataTable] = useState([]);
  //state trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //button submit
  const [buttonSubmitterPlanetHouse, setButtonSubmitterPlanetHouse] = useState(buttonSubmitter);
  //form field
  const [formFieldAddPlanetHouse, setFormFieldAddPlanetHouse] = useState(formFieldAdd);
  const [formFieldEditPlanetHouse, setFormFieldEditPlanetHouse] = useState(formFieldEdit);
  //paging table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(20);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);
  //dataListHouse
  const [dataList, setDataList] = useState([]);
  //loading list house
  const [loadingListHouse, setLoadingListHouse] = useState(false);
  //button view loading
  const [viewLoading, setViewLoading] = useState(false);
  //modalViewDetail
  const [modalViewDetail, setModalViewDetail] = useState(false);
  //load list house
  useEffect(() => {
    (async () => {
      setLoadingListHouse(true);
      const result = await getHouses();

      if (result?.payload?.length > 0) {
        const listDataSrc = [];
        result?.payload?.map((item) => {
          const house = {};
          house.id = item.id;
          house.avatar = item.icon;
          house.name = item.name;
          house.title = item.name;
          house.selected = false;
          listDataSrc.push(house);
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
        formFieldAddPlanetHouse?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectHouseId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        setFormFieldAddPlanetHouse(newFieldAdd);
        const newFieldEdit = [];
        formFieldEditPlanetHouse?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectHouseId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        setFormFieldEditPlanetHouse(newFieldEdit);
      }
      setLoadingListHouse(false);
    })();
  }, []);

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
    const newButtonSubmitPlanetHouse = buttonSubmitterPlanetHouse.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterPlanetHouse(newButtonSubmitPlanetHouse);
  }, [buttonLoading]);

  useEffect(() => {
    (async () => {
      const listPlanetHouse = [];
      const planetName = planet.name;
      const planetId = planet.id;
      const data = await getPlanetHouses(planetName, planetId);
      if (data?.payload) {
        data?.payload?.map((item, index) => {
          item.number = index + 1;
          listPlanetHouse[index] = item;
        });
        setTotal(data?.total);
        setDataTable(listPlanetHouse);
      }
    })();
  }, [triggerDataTable]);

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setPlanetHouseRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setPlanetHouseRecord(null);
    setStateEditor(null);
    if (formPlanetHouseRef) {
      formPlanetHouseRef?.current?.resetFields();
    }
  };

  const handleResetForm = () => {
    formPlanetHouseRef?.current?.resetFields();
    setStateEditor(null);
    editorRef?.current?.getEditor().setContents([{ insert: '\n' }]);
  };
  //xuli mo form edit planet House
  const handleEditPlanetHouseForm = async (record) => {
    if (modalViewDetail) {
      handleCancelModalViewDetail();
    }
    const idPlanetHouse = record.id;
    setButtonEditLoading(true);
    const planetHouse = await getAnPlanetHouse(planet.name, planet.id, idPlanetHouse);
    setButtonEditLoading(false);
    if (planetHouse?.id) {
      setPlanetHouseRecord(planetHouse);
      setStateEditor(planetHouse.content);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      console.log('planetHouse', planetHouse);
      formPlanetHouseRef?.current?.setFieldsValue(planetHouse);
    }
  };

  //handle submit form
  const handleSubmitFormPlanetHouse = async (values) => {
    console.log('A');
    setButtonLoading(true);
    setStateEditor(values.content);
    values.planetId = planet.id;
    console.log('B');
    if (values.edit) {
      values.id = planetHouseRecord.id;
      const idPlanetHouse = planetHouseRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      console.log('dataEdit', dataEdit);
      await updatePlanetHouse(planet.name, planet.id, idPlanetHouse, dataEdit);
    } else {
      console.log('C');
      console.log('values add', values);
      console.log('planet name', planet.name);
      console.log('planet id', planet.id);
      await addPlanetHouse(planet.name, planet.id, values);
      handleResetForm();
      setStateEditor(null);
    }
    setTriggerDataTable(!triggerDataTable);
    setButtonLoading(false);
  };

  const handleChangeStateEditor = (content) => {
    formPlanetHouseRef?.current?.setFieldsValue({
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
    params.HouseId = item?.id;
    setViewLoading(true);
    const planetHouse = await getPlanetHouses(planet?.name, planet?.id, params);
    console.log('planetHouse', planetHouse.payload[0]);
    if (planetHouse?.payload) {
      setPlanetHouseRecord(planetHouse.payload[0]);
      setModalViewDetail(true);
    }
    setViewLoading(false);
  };

  const handleButtonEdit = (item) => {};

  const handleCancelModalViewDetail = () => {
    setModalViewDetail(false);
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
          key="buttonAddPlanetHouse"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleModal()}
          style={{
            marginBottom: '16px',
          }}
        >
          Thêm Dữ Liệu
        </Button>
        {loadingListHouse ? (
          <ProSkeleton type="list" list="12" />
        ) : (
          <ListHouse
            houseList={dataList}
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
          formRef={formPlanetHouseRef}
          buttonSubmitter={buttonSubmitterPlanetHouse}
          handleSubmitForm={handleSubmitFormPlanetHouse}
          formField={formFieldEditPlanetHouse}
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
          formRef={formPlanetHouseRef}
          buttonSubmitter={buttonSubmitterPlanetHouse}
          handleSubmitForm={handleSubmitFormPlanetHouse}
          formField={formFieldAddPlanetHouse}
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
          planetHouseRecord
            ? `Nội Dung Chi Tiết Của ${planetHouseRecord?.planetName} và ${planetHouseRecord?.houseName}`
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
        {planetHouseRecord ? (
          <PlanetHouseDetail
            planetHouse={planetHouseRecord}
            handleEditPlanetHouseForm={handleEditPlanetHouseForm}
            handleCancelModalViewDetail={handleCancelModalViewDetail}
          />
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </Modal>
    </>
  );
};

export default PlanetHouse;
