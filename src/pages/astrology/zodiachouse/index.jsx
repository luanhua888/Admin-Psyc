import React, { useEffect, useRef, useState } from 'react';
import { getZodiacs } from '@/services/ant-design-pro/zodiac';
import { PageContainer } from '@ant-design/pro-layout';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProList from '@ant-design/pro-list';
import ProTable from '@ant-design/pro-table';
import { Avatar, Button, Card, Col, message, Row, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getZodiacHouses,
  addZodiacHouse,
  getAnZodiacHouse,
  updateZodiacHouse,
} from '@/services/zodiachouse';
import { getHouses } from '@/services/house';
import Meta from 'antd/lib/card/Meta';
import ModalForm from '@/components/ModalForm';
import { uploadFile } from '@/utils/uploadFile';
import ListZodiac from '@/components/ListZodiac/ListZodiac';
const ZodiacHouse = () => {
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
    },
    {
      title: 'Zodiac Name',
      dataIndex: 'zodiacName',
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
                key="editZodiacHouse"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditZodiacHouseForm(record)}
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
      key: 'clearFieldFormZodiacHouse',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddZodiacHouse',
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
      key: 'selectZodiacId',
      name: 'zodiacId',
      label: 'Zodiac',
      placeholder: 'Select Zodiac',
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
  //ref
  const tableRef = useRef();
  const formZodiacHouseRef = useRef();
  const editorRef = useRef();
  //state de render skeleton khi chua load dc list zodiac
  const [loadingZodiac, setLoadingZodiac] = useState(false);
  //data zodiac list
  const [dataList, setDataList] = useState([]);
  //state cua editor
  const [stateEditor, setStateEditor] = useState(null);
  //state cua modal
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [zodiacHouseRecord, setZodiacHouseRecord] = useState(null);
  const [flagEditForm, setFlagEditForm] = useState('');
  //data table
  const [dataTable, setDataTable] = useState([]);
  //state trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //state giu zodiac nao dang dc chon
  const [zodiacSelected, setZodiacSelected] = useState({});
  //button submit
  const [buttonSubmitterZodiacHouse, setButtonSubmitterZodiacHouse] = useState(buttonSubmitter);
  //form field
  const [formFieldAddZodiacHouse, setFormFieldAddZodiacHouse] = useState(formFieldAdd);
  const [formFieldEditZodiacHouse, setFormFieldEditZodiacHouse] = useState(formFieldEdit);
  //paging zodiac list
  const [pageCurrZodiac, setPageCurrZodiac] = React.useState(1);
  const [pageSizeZodiac, setPageSizeZodiac] = React.useState(8);
  const [totalZodiac, setTotalZodiac] = React.useState(20);
  //paging table
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(20);
  //button edit loading
  const [buttonEditLoading, setButtonEditLoading] = useState(false);
  //load list zodiac
  useEffect(() => {
    (async () => {
      setLoadingZodiac(true);
      const listZodiac = await getZodiacs();
      if (listZodiac?.payload) {
        const listDataSrc = [];
        listZodiac?.payload?.map((item) => {
          const zodiac = {};
          zodiac.id = item.id;
          zodiac.avatar = item.icon;
          zodiac.name = item.name;
          zodiac.title = item.name;
          zodiac.selected = false;
          listDataSrc.push(zodiac);
        });
        listDataSrc[0].selected = true;
        setZodiacSelected(listDataSrc[0]);
        setDataList(listDataSrc);
      }
      setLoadingZodiac(false);
    })();
  }, []);

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
        formFieldAddZodiacHouse?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectHouseId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        console.log('newFieldAdd', newFieldAdd);
        setFormFieldAddZodiacHouse(newFieldAdd);
        const newFieldEdit = [];
        formFieldEditZodiacHouse?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectHouseId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        console.log('newFieldEdit', newFieldEdit);
        setFormFieldEditZodiacHouse(newFieldEdit);
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
    const newButtonSubmitZodiacHouse = buttonSubmitterZodiacHouse.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterZodiacHouse(newButtonSubmitZodiacHouse);
  }, [buttonLoading]);

  useEffect(() => {
    (async () => {
      const listZodiacHouse = [];
      const zodiacName = zodiacSelected.name;
      const zodiacId = zodiacSelected.id;
      const data = await getZodiacHouses(zodiacName, zodiacId);
      if (data?.payload) {
        data?.payload?.map((item, index) => {
          item.number = index + 1;
          listZodiacHouse[index] = item;
        });
        setTotal(data?.total);
        setDataTable(listZodiacHouse);
      }
      const valueEnumZodiac = [];
      valueEnumZodiac.push({
        valueName: zodiacId,
        valueDisplay: zodiacName,
      });
      const newFieldAdd = [];
      formFieldAddZodiacHouse?.map((item) => {
        if (item?.fieldType === 'formSelect' && item?.key === 'selectZodiacId') {
          item.valueEnum = [...valueEnumZodiac];
          newFieldAdd.push(item);
        } else {
          newFieldAdd.push(item);
        }
      });
      setFormFieldAddZodiacHouse(newFieldAdd);
      const newFieldEdit = [];
      formFieldEditZodiacHouse?.map((item) => {
        if (item?.fieldType === 'formSelect' && item?.key === 'selectZodiacId') {
          item.valueEnum = [...valueEnumZodiac];
          newFieldEdit.push(item);
        } else {
          newFieldEdit.push(item);
        }
      });
      setFormFieldEditZodiacHouse(newFieldEdit);
    })();
  }, [zodiacSelected, triggerDataTable]);

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
    setZodiacSelected(item);
  };

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setZodiacHouseRecord(null);
  };

  //xu li dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setZodiacHouseRecord(null);
    setStateEditor(null);
    if (formZodiacHouseRef) {
      formZodiacHouseRef?.current?.resetFields();
    }
  };

  const handleResetForm = () => {
    formZodiacHouseRef?.current?.resetFields();
    setStateEditor(null);
  };

  //xuli mo form edit zodiac house
  const handleEditZodiacHouseForm = async (record) => {
    const idZodiacHouse = record.id;
    setButtonEditLoading(true);
    const zodiacHouse = await getAnZodiacHouse(
      zodiacSelected.name,
      zodiacSelected.id,
      idZodiacHouse,
    );
    setButtonEditLoading(false);
    if (zodiacHouse?.id) {
      setZodiacHouseRecord(zodiacHouse);
      setStateEditor(zodiacHouse.content);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      console.log('zodiacHouse', zodiacHouse);
      formZodiacHouseRef?.current?.setFieldsValue(zodiacHouse);
    }
  };

  //handle submit form
  const handleSubmitFormZodiacHouse = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.content);
    if (values.edit) {
      const idZodiacHouse = zodiacHouseRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      console.log('dataEdit', dataEdit);
      await updateZodiacHouse(zodiacSelected.name, zodiacSelected.id, idZodiacHouse, dataEdit);
    } else {
      await addZodiacHouse(zodiacSelected.name, zodiacSelected.id, values);
      handleResetForm();
      setStateEditor(null);
    }
    setTriggerDataTable(!triggerDataTable);
    setButtonLoading(false);
  };

  const handleChangeStateEditor = (content) => {
    formZodiacHouseRef?.current?.setFieldsValue({
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
        {loadingZodiac ? (
          <ProSkeleton type="list" list="12" />
        ) : (
          <ListZodiac zodiacList={dataList} span={4} handleClickCard={handleClickCard} />
        )}
        {loadingZodiac ? (
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
                key="buttonAddZodiacHouse"
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
          formRef={formZodiacHouseRef}
          buttonSubmitter={buttonSubmitterZodiacHouse}
          handleSubmitForm={handleSubmitFormZodiacHouse}
          formField={formFieldEditZodiacHouse}
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
          formRef={formZodiacHouseRef}
          buttonSubmitter={buttonSubmitterZodiacHouse}
          handleSubmitForm={handleSubmitFormZodiacHouse}
          formField={formFieldAddZodiacHouse}
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

export default ZodiacHouse;
