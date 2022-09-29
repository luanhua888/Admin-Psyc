import { getHouses } from '@/services/house';
import { getPlanets } from '@/services/planet';
import {
  addPlanetHouse,
  getAnPlanetHouse,
  getPlanetHouses,
  updatePlanetHouse,
} from '@/services/planethouse';
import { uploadFile } from '@/utils/uploadFile';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Col, message, Row } from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import React, { useEffect, useRef, useState } from 'react';
import Meta from 'antd/lib/card/Meta';
import ProTable from '@ant-design/pro-table';
import ModalForm from '@/components/ModalForm';

const Planet = () => {
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
    },
    {
      title: 'Planet Name',
      dataIndex: 'planetName',
      search: false,
    },
    {
      title: 'House Name',
      dataIndex: 'houseName',
      search: false,
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
                key="editPlanetHouse"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditPlanetHouseForm(record)}
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
                key="deleteZodiacHouse"
                type="danger"
                size="middle"
                block="true"
                icon={<DeleteOutlined />}
                // onClick={() => handleOkDeleteZodiac(record)}
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
      key: 'selectPlanetId',
      name: 'planetId',
      label: 'Planet',
      placeholder: 'Select Planet',
      readOnly: true,
      valueEnum: [],
    },
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
      key: 'selectPlanetId',
      name: 'planetId',
      label: 'Planet',
      placeholder: 'Select Planet',
      readOnly: true,
      valueEnum: [],
    },
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

  const tableRef = useRef();
  const formPlanetHouseRef = useRef();
  const editorRef = useRef();
  //state de render skeleton khi chua load dc list planet
  const [loadingPlanet, setLoadingPlanet] = useState(false);
  //data planet list
  const [dataList, setDataList] = useState([]);
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
  //state giu planet nao dang dc chon
  const [planetSelected, setPlanetSelected] = useState({});
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

  //load list zodiac
  useEffect(() => {
    (async () => {
      setLoadingPlanet(true);
      const listPlanet = await getPlanets();
      if (listPlanet?.payload) {
        const listDataSrc = [];
        listPlanet?.payload?.map((item) => {
          const planet = {};
          planet.id = item.id;
          planet.avatar = item.icon;
          planet.name = item.name;
          planet.title = item.name;
          planet.selected = false;
          listDataSrc.push(planet);
        });
        listDataSrc[0].selected = true;
        setPlanetSelected(listDataSrc[0]);
        setDataList(listDataSrc);
      }
      setLoadingPlanet(false);
    })();
  }, []);

  //load list house
  useEffect(() => {
    (async () => {
      const result = await getHouses();
      if (result?.payload?.length > 0) {
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
      const planetName = planetSelected.name;
      const planetId = planetSelected.id;
      const data = await getPlanetHouses(planetName, planetId);
      if (data?.payload) {
        data?.payload?.map((item, index) => {
          item.number = index + 1;
          listPlanetHouse[index] = item;
        });
        setTotal(data?.total);
        setDataTable(listPlanetHouse);
      }
      const valueEnumPlanet = [];
      valueEnumPlanet.push({
        valueName: planetId,
        valueDisplay: planetName,
      });
      const newFieldAdd = [];
      formFieldAddPlanetHouse?.map((item) => {
        if (item?.fieldType === 'formSelect' && item?.key === 'selectPlanetId') {
          item.valueEnum = [...valueEnumPlanet];
          newFieldAdd.push(item);
        } else {
          newFieldAdd.push(item);
        }
      });
      setFormFieldAddPlanetHouse(newFieldAdd);
      const newFieldEdit = [];
      formFieldEditPlanetHouse?.map((item) => {
        if (item?.fieldType === 'formSelect' && item?.key === 'selectPlanetId') {
          item.valueEnum = [...valueEnumPlanet];
          newFieldEdit.push(item);
        } else {
          newFieldEdit.push(item);
        }
      });
      setFormFieldEditPlanetHouse(newFieldEdit);
    })();
  }, [planetSelected, triggerDataTable]);

  //handle click card
  const handleClickCard = (item) => {
    const updateList = dataList.map((el) => {
      if (el.id === item.id) {
        el.selected = true;
      } else {
        el.selected = false;
      }
      return el;
    });
    setDataList(updateList);
    setPlanetSelected(item);
  };

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
  };

  //xuli mo form edit planet House
  const handleEditPlanetHouseForm = async (record) => {
    const idPlanetHouse = record.id;
    setButtonEditLoading(true);
    const planetHouse = await getAnPlanetHouse(
      planetSelected.name,
      planetSelected.id,
      idPlanetHouse,
    );
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
    setButtonLoading(true);
    setStateEditor(values.content);
    if (values.edit) {
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
      await updatePlanetHouse(planetSelected.name, planetSelected.id, idPlanetHouse, dataEdit);
    } else {
      await addPlanetHouse(planetSelected.name, planetSelected.id, values);
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
        {loadingPlanet ? (
          <ProSkeleton type="list" list="12" />
        ) : (
          <Row
            gutter={[16, 16]}
            style={{
              marginBottom: '12px',
            }}
          >
            {dataList.map((item) => (
              <Col span={6} key={item.id}>
                {item?.selected ? (
                  <Card
                    onClick={() => handleClickCard(item)}
                    bordered={true}
                    style={{
                      border: '1px solid #1890FF',
                    }}
                  >
                    <Meta avatar={<Avatar src={item.avatar} />} title={item.title} />
                  </Card>
                ) : (
                  <Card onClick={() => handleClickCard(item)} bordered={true}>
                    <Meta avatar={<Avatar src={item.avatar} />} title={item.title} />
                  </Card>
                )}
              </Col>
            ))}
          </Row>
        )}
        {loadingPlanet ? (
          <ProSkeleton type="result" />
        ) : (
          <ProTable
            columns={column}
            actionRef={tableRef}
            onReset={true}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onchange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            search={false}
            toolBarRender={(action) => [
              <Button
                size="middle"
                key="buttonAddPlanetZodiac"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleModal()}
              >
                Add
              </Button>,
            ]}
            dataSource={dataTable}
          />
        )}
      </PageContainer>
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
    </>
  );
};

export default Planet;
