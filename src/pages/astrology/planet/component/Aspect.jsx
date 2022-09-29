import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Row, Select, Space, Tag } from 'antd';
import { getAnPlanet, getPlanets } from '@/services/planet';
import { getAnAspect, getAspects, updateAspect, addAspect, deleteAspect } from '@/services/aspect';
import { uploadFile } from '@/utils/uploadFile';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';
import { Content } from 'antd/lib/layout/layout';
import ProSkeleton from '@ant-design/pro-skeleton';
import ListPlanet from '@/components/ListPlanet/ListPlanet';
import AspectDetail from './AspectDetail';
import HoroScopeItem from './HoroscopeItem';

const { Option } = Select;

const Aspect = (props) => {
  const { planet } = props;

  const angleList = [
    {
      valueName: 0,
      valueDisplay: 'Conjunction',
    },
    {
      valueName: 1,
      valueDisplay: 'Semi-sextile',
    },
    {
      valueName: 2,
      valueDisplay: 'Semi-square',
    },
    {
      valueName: 3,
      valueDisplay: 'Sextile',
    },
    {
      valueName: 4,
      valueDisplay: 'Quintile',
    },
    {
      valueName: 5,
      valueDisplay: 'Square',
    },
    {
      valueName: 6,
      valueDisplay: 'Trine',
    },
    {
      valueName: 7,
      valueDisplay: 'Sesquiquadrate',
    },
    {
      valueName: 8,
      valueDisplay: 'Bi-quintile',
    },
    {
      valueName: 9,
      valueDisplay: 'Quincunx',
    },
    {
      valueName: 10,
      valueDisplay: 'Opposition',
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFieldFormPlanetCompare',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddPlanetCompare',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formSelect',
      key: 'selectPlanetCompareId',
      name: 'planetCompareId',
      label: 'Planet Compare',
      placeholder: 'Select Planet Compare',
      requiredField: 'true',
      ruleMessage: 'Please select Planet Compare',
      valueEnum: [],
    },
    {
      fieldType: 'formSelect',
      key: 'selectAngleType',
      name: 'angleType',
      label: 'Angle Type',
      placeholder: 'Select Angle Type',
      requiredField: 'true',
      ruleMessage: 'Please select Angle Type',
      valueEnum: [
        {
          valueName: 0,
          valueDisplay: 'Conjunction',
        },
        {
          valueName: 1,
          valueDisplay: 'Semi-sextile',
        },
        {
          valueName: 2,
          valueDisplay: 'Semi-square',
        },
        {
          valueName: 3,
          valueDisplay: 'Sextile',
        },
        {
          valueName: 4,
          valueDisplay: 'Quintile',
        },
        {
          valueName: 5,
          valueDisplay: 'Square',
        },
        {
          valueName: 6,
          valueDisplay: 'Trine',
        },
        {
          valueName: 7,
          valueDisplay: 'Sesquiquadrate',
        },
        {
          valueName: 8,
          valueDisplay: 'Bi-quintile',
        },
        {
          valueName: 9,
          valueDisplay: 'Quincunx',
        },
        {
          valueName: 10,
          valueDisplay: 'Opposition',
        },
      ],
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddAspectDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter Aspect Description',
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
      fieldType: 'formSelect',
      key: 'selectPlanetCompareId',
      name: 'planetCompareId',
      label: 'Planet Compare',
      placeholder: 'Select Planet Compare',
      requiredField: 'true',
      ruleMessage: 'Please select Planet Compare',
      valueEnum: [],
    },
    {
      fieldType: 'formSelect',
      key: 'selectAngleType',
      name: 'angle',
      label: 'Angle Name',
      placeholder: 'Select Angle Type',
      requiredField: 'true',
      ruleMessage: 'Please select Angle Type',
      valueEnum: [
        {
          valueName: 0,
          valueDisplay: 'Conjunction',
        },
        {
          valueName: 1,
          valueDisplay: 'Semi-sextile',
        },
        {
          valueName: 2,
          valueDisplay: 'Semi-square',
        },
        {
          valueName: 3,
          valueDisplay: 'Sextile',
        },
        {
          valueName: 4,
          valueDisplay: 'Quintile',
        },
        {
          valueName: 5,
          valueDisplay: 'Square',
        },
        {
          valueName: 6,
          valueDisplay: 'Trine',
        },
        {
          valueName: 7,
          valueDisplay: 'Sesquiquadrate',
        },
        {
          valueName: 8,
          valueDisplay: 'Bi-quintile',
        },
        {
          valueName: 9,
          valueDisplay: 'Quincunx',
        },
        {
          valueName: 10,
          valueDisplay: 'Opposition',
        },
      ],
    },
    {
      fieldType: 'formTextArea',
      key: 'fieldAddAspectDescription',
      label: 'Description',
      width: 'lg',
      placeholder: 'Enter Aspect Description',
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

  const tableRef = useRef();
  const formAspectRef = useRef();
  const editorRef = useRef();

  //state cua editor
  const [stateEditor, setStateEditor] = useState(null);
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [aspectRecord, setAspectRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = useState('');
  //data table
  const [dataTable, setDataTable] = useState([]);
  //state trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //button submit
  const [buttonSubmitterAspect, setButtonSubmitterAspect] = useState(buttonSubmitter);
  //form field
  const [formFieldAddAspect, setFormFieldAddAspect] = useState(formFieldAdd);
  const [formFieldEditAspect, setFormFieldEditAspect] = useState(formFieldEdit);
  //paging table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(20);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);
  //list data planet aspect
  const [dataList, setDataList] = useState([]);
  //const current aspect
  const [currentAspect, setCurrentAspect] = useState(angleList[0].valueName);
  //button view loading
  const [viewLoading, setViewLoading] = useState(false);
  //modalViewDetail
  const [modalViewDetail, setModalViewDetail] = useState(false);
  //load list planet by aspect
  const [loadingListPlanet, setLoadingListPlanet] = useState(false);

  useEffect(() => {
    (async () => {
      const listPlanetCompare = await getPlanets();
      if (listPlanetCompare?.payload?.length > 0) {
        const valueEnum = [];
        listPlanetCompare?.payload?.map((item) => {
          if (item.id !== planet.id) {
            const el = {
              valueName: item.id,
              valueDisplay: item.name,
            };
            valueEnum.push(el);
          }
        });
        const newFieldAdd = [];
        formFieldAddAspect?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectPlanetCompareId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        setFormFieldAddAspect(newFieldAdd);
        const newFieldEdit = [];
        formFieldEditAspect?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectPlanetCompareId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        setFormFieldEditAspect(newFieldEdit);
      }
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

  React.useEffect(() => {
    if (viewLoading) {
      message.loading('Loading...', 9999);
    } else {
      message.destroy();
    }
    return () => {
      message.destroy();
    };
  }, [viewLoading]);

  //xuli loading button submit form add or edit
  useEffect(() => {
    const newButtonSubmitAspect = buttonSubmitterAspect.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterAspect(newButtonSubmitAspect);
  }, [buttonLoading]);

  useEffect(() => {
    (async () => {
      const listAspect = [];

      const params = {
        planetBaseId: planet.id,
        page: page,
        pageSize: pageSize,
      };
      const data = await getAspects(params);
      console.log('data', data);
      if (data?.payload) {
        data?.payload?.map((item, index) => {
          item.number = index + 1;
          listAspect[index] = item;
        });
        setTotal(data?.total);
        setDataTable(listAspect);
      }
    })();
  }, [triggerDataTable]);

  //load list planet theo aspect
  useEffect(() => {
    (async () => {
      if (currentAspect !== null) {
        setLoadingListPlanet(true);
        // tao params
        const params = {};
        params.planetBaseId = planet?.id;
        params.angleType = currentAspect;

        //list aspect
        const listAspectCompared = await getAspects(params);
        if (listAspectCompared?.payload) {
          // get detail planetCompare and aspectid
          const listPlanetCompareAspectId = [];
          // for loop get await planet
          for (let index = 0; index < listAspectCompared?.payload?.length; index++) {
            const planetId = listAspectCompared?.payload[index]?.planetCompareId;
            const planet = await getAnPlanet(planetId);
            const planetAspectId = { ...planet };
            planetAspectId.aspectId = listAspectCompared?.payload[index]?.id;
            listPlanetCompareAspectId.push(planetAspectId);
          }
          if (listPlanetCompareAspectId.length > 0) {
            const listDataSrc = [];
            listPlanetCompareAspectId.map((item) => {
              const planetRender = {};
              planetRender.id = item?.id;
              planetRender.avatar = item?.icon;
              planetRender.name = item?.name;
              planetRender.title = item?.name;
              planetRender.aspectId = item?.aspectId;
              planetRender.selected = false;
              listDataSrc.push(planetRender);
            });
            setDataList(listDataSrc);
          }
        }
        setLoadingListPlanet(false);
      }
    })();
  }, [currentAspect]);

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setAspectRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setAspectRecord(null);
    setStateEditor(null);
    if (formAspectRef) {
      formAspectRef?.current?.resetFields();
    }
  };

  const handleResetForm = () => {
    formAspectRef?.current?.resetFields();
    setStateEditor(null);
    editorRef?.current?.getEditor().setContents([{ insert: '\n' }]);
  };

  //xuli mo form edit planet House
  const handleEditAspectForm = async (record) => {
    if (modalViewDetail) {
      handleCancelModalViewDetail();
    }
    const idAspect = record.id;
    setButtonEditLoading(true);
    const aspect = await getAnAspect(idAspect);
    setButtonEditLoading(false);
    if (aspect?.id) {
      setAspectRecord(aspect);
      setStateEditor(aspect.mainContent);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formAspectRef?.current?.setFieldsValue(aspect);
    }
  };

  //handle submit form
  const handleSubmitFormAspect = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.mainContent);
    values.planetBaseId = planet.id;
    if (values.edit) {
      const idAspect = aspectRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      dataEdit.angleType = dataEdit?.angle;
      delete dataEdit?.angle;
      await updateAspect(idAspect, dataEdit);
    } else {
      await addAspect(values);
      console.log('values ADD', values);
      handleResetForm();
      setStateEditor(null);
    }
    setTriggerDataTable(!triggerDataTable);
    setButtonLoading(false);
  };

  const handleDeleteAspect = (record) => {
    deleteAspect(record.id);
    setTriggerDataTable(!triggerDataTable);
  };

  const handleChangeStateEditor = (content) => {
    formAspectRef?.current?.setFieldsValue({
      ['mainContent']: content,
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

  const handleChangeSelect = (value) => {
    setCurrentAspect(value);
  };

  const handleClickCard = (item) => {};

  const handleButtonView = async (item) => {
    const id = item?.aspectId;
    setViewLoading(true);
    const aspectObj = await getAnAspect(id);
    if (aspectObj.id) {
      setAspectRecord(aspectObj);
      setModalViewDetail(true);
    }
    setViewLoading(false);
  };

  const handleCancelModalViewDetail = () => {
    setModalViewDetail(false);
  };
  return (
    <>
      <Content
        style={{
          background: '#fff',
          padding: 16,
        }}
      >
        <p
          style={{
            marginBottom: 8,
            marginLeft: 4,
            color: '#1890FF',
          }}
        >
          Aspect Name
        </p>
        <Row>
          <Col span={12}>
            <Select
              defaultValue={angleList[0].valueDisplay}
              style={{
                width: '200px',
                marginBottom: 16,
              }}
              onChange={handleChangeSelect}
            >
              {angleList.map((item) => (
                <Option key={item.valueName}>{item.valueDisplay}</Option>
              ))}
            </Select>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              size="middle"
              key="buttonAddAspect"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModal()}
              style={{
                marginBottom: '16px',
              }}
            >
              Thêm Dữ Liệu
            </Button>
          </Col>
        </Row>

        {loadingListPlanet ? (
          <ProSkeleton type="list" list="11" />
        ) : (
          <ListPlanet
            planetList={dataList}
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
          formRef={formAspectRef}
          buttonSubmitter={buttonSubmitterAspect}
          handleSubmitForm={handleSubmitFormAspect}
          formField={formFieldEditAspect}
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
          formRef={formAspectRef}
          buttonSubmitter={buttonSubmitterAspect}
          handleSubmitForm={handleSubmitFormAspect}
          formField={formFieldAddAspect}
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
        width="800px"
        title={
          aspectRecord ? `Nội Dung Chi Tiết Của ${aspectRecord?.angleName}` : 'Chưa có nội dung'
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
        {aspectRecord ? (
          <>
            <AspectDetail
              aspect={aspectRecord}
              handleEditAspectForm={handleEditAspectForm}
              handleCancelModalViewDetail={handleCancelModalViewDetail}
            />
            <HoroScopeItem aspect={aspectRecord} />
          </>
        ) : (
          <p>Chưa có dữ liệu</p>
        )}
      </Modal>
    </>
  );
};

export default Aspect;
