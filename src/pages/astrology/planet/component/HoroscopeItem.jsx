import {
  addHoroscopeItem,
  getAnHoroscopeItem,
  getHoroscopeItems,
  updateHoroscopeItem,
} from '@/services/horoscopeitem';
import { uploadFile } from '@/utils/uploadFile';
import { Button, Card, Col, message, Row, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Content } from 'antd/lib/layout/layout';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import ModalForm from '@/components/ModalForm';
import ProSkeleton from '@ant-design/pro-skeleton';

const HoroScopeItem = (props) => {
  const { aspect } = props;

  const buttonSubmitter = [
    {
      key: 'clearFieldFormHoroscopeItem',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddHoroscopeItem',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const listLifeAttribute = [
    {
      id: 1,
      name: 'Routine',
      color: 'blue',
    },
    {
      id: 2,
      name: 'Thinking',
      color: 'cyan',
    },
    {
      id: 3,
      name: 'Creativity',
      color: 'geekblue',
    },
    {
      id: 4,
      name: 'Spirituality',
      color: 'pink',
    },
    {
      id: 5,
      name: 'Social Life',
      color: 'gold',
    },
    {
      id: 6,
      name: 'Sex & Love',
      color: 'orange',
    },
    {
      id: 7,
      name: 'Self',
      color: 'purple',
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formSelect',
      key: 'selectLifeAttribute',
      name: 'lifeAttributeId',
      label: 'Life Attribute',
      placeholder: 'Select Life Attribute',
      requiredField: 'true',
      ruleMessage: 'Please select Life Attribute',
      valueEnum: [
        {
          valueName: 1,
          valueDisplay: 'Routine',
        },
        {
          valueName: 2,
          valueDisplay: 'Thinking',
        },
        {
          valueName: 3,
          valueDisplay: 'Creativity',
        },
        {
          valueName: 4,
          valueDisplay: 'Spirituality',
        },
        {
          valueName: 5,
          valueDisplay: 'Social Life',
        },
        {
          valueName: 6,
          valueDisplay: 'Sex & Love',
        },
        {
          valueName: 7,
          valueDisplay: 'Self',
        },
      ],
    },
    {
      fieldType: 'formSelect',
      key: 'selectValue',
      name: 'value',
      label: 'Value',
      placeholder: 'Select Value',
      requiredField: 'true',
      ruleMessage: 'Please select Value',
      valueEnum: [
        {
          valueName: 0,
          valueDisplay: 'Challenge',
        },
        {
          valueName: 1,
          valueDisplay: 'Trouble',
        },
        {
          valueName: 2,
          valueDisplay: 'Power',
        },
      ],
    },
    {
      fieldType: 'EditorMainContent',
      nameTextArea: 'content',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formSelect',
      key: 'selectLifeAttribute',
      name: 'lifeAttributeId',
      label: 'Life Attribute',
      placeholder: 'Select Life Attribute',
      requiredField: 'true',
      ruleMessage: 'Please select Life Attribute',
      valueEnum: [
        {
          valueName: 1,
          valueDisplay: 'Routine',
        },
        {
          valueName: 2,
          valueDisplay: 'Thinking',
        },
        {
          valueName: 3,
          valueDisplay: 'Creativity',
        },
        {
          valueName: 4,
          valueDisplay: 'Spirituality',
        },
        {
          valueName: 5,
          valueDisplay: 'Social Life',
        },
        {
          valueName: 6,
          valueDisplay: 'Sex & Love',
        },
        {
          valueName: 7,
          valueDisplay: 'Self',
        },
      ],
    },
    {
      fieldType: 'formSelect',
      key: 'selectValue',
      name: 'value',
      label: 'Value',
      placeholder: 'Select Value',
      requiredField: 'true',
      ruleMessage: 'Please select Value',
      valueEnum: [
        {
          valueName: 0,
          valueDisplay: 'Challenge',
        },
        {
          valueName: 1,
          valueDisplay: 'Trouble',
        },
        {
          valueName: 2,
          valueDisplay: 'Power',
        },
      ],
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
  //ref cua form va editor
  const formHoroscopeItemRef = useRef();
  const editorRef = useRef();
  //state cua editor
  const [stateEditor, setStateEditor] = React.useState(null);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [horoscopeItemRecord, setHoroscopeItemRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterHoroscopeItem, setButtonSubmitterHoroscopeItem] =
    React.useState(buttonSubmitter);
  const [formFieldAddHoroscopeItem, setFormFieldAddHoroscopeItem] = React.useState(formFieldAdd);
  const [formFieldEditHoroscopeItem, setFormFieldEditHoroscopeItem] = React.useState(formFieldEdit);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  //state trigger reload list data horoscopeitem
  const [triggerReload, setTriggerReload] = useState(false);
  const [loadingListHoroscopeItem, setLoadingListHoroscopeItem] = useState(false);
  const [listHoroscopeItem, setListHoroscopeItem] = useState([]);

  useEffect(() => {
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
  useEffect(() => {
    const newButtonSubmitHoroscopeItem = buttonSubmitterHoroscopeItem.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterHoroscopeItem(newButtonSubmitHoroscopeItem);
  }, [buttonLoading]);

  useEffect(() => {
    (async () => {
      const aspectId = aspect?.id;
      setLoadingListHoroscopeItem(true);
      const params = {
        aspectId: aspectId,
      };
      const listHoroscope = await getHoroscopeItems(params);
      if (listHoroscope?.payload) {
        setListHoroscopeItem(listHoroscope?.payload);
      }
      setLoadingListHoroscopeItem(false);
    })();
    return () => {
      setListHoroscopeItem([]);
    };
  }, [triggerReload, aspect]);

  //xu li dong mo modal
  const handleModal = () => {
    setShowModal(!showModal);
    setFlagEditForm('');
    setHoroscopeItemRecord(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setHoroscopeItemRecord(null);
    setStateEditor(null);
    if (formHoroscopeItemRef) {
      formHoroscopeItemRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formHoroscopeItemRef?.current?.resetFields();
    setStateEditor(null);
    editorRef?.current?.getEditor().setContents([{ insert: '\n' }]);
  };

  //xuli submit form
  const handleSubmitFormHoroscopeItem = async (values) => {
    setButtonLoading(true);
    setStateEditor(values.content);
    values.aspectId = aspect?.id;
    if (values.edit) {
      const horoscopeItemId = horoscopeItemRecord?.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      await updateHoroscopeItem(horoscopeItemId, dataEdit);
    } else {
      await addHoroscopeItem(values);
      handleResetForm();
      setStateEditor(null);
    }
    setTriggerReload(!triggerReload);
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditHoroscopeItemForm = async (record) => {
    const horoscopeItemId = record?.id;
    setButtonEditLoading(true);
    const horoscopeItem = await getAnHoroscopeItem(horoscopeItemId);
    setButtonEditLoading(false);
    if (horoscopeItem?.id) {
      setHoroscopeItemRecord(horoscopeItem);
      setStateEditor(horoscopeItem?.content);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formHoroscopeItemRef?.current?.setFieldsValue(horoscopeItem);
    }
  };

  //xuli change text in editor
  const handleChangeStateEditor = (state) => {
    if (state) {
      formHoroscopeItemRef?.current?.setFieldsValue({
        ['content']: state,
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
      <Content
        style={{
          marginTop: 16,
        }}
      >
        <div>
          <Button
            size="middle"
            key="buttonAddHoroscopeItem"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleModal()}
            style={{
              marginBottom: 12,
              marginTop: 12,
            }}
          >
            Horoscope Item
          </Button>
        </div>
        {/* <div>
                    <p>Life Attribute</p>
                </div> */}
        <div
          style={{
            marginBottom: 12,
          }}
        >
          {listLifeAttribute?.map((item) => (
            <Tag color={item?.color} key={item?.id}>
              {item?.name}
            </Tag>
          ))}
        </div>
        {loadingListHoroscopeItem ? (
          <ProSkeleton type="list" list={false} statistic={false} />
        ) : (
          <Row gutter={[8, 8]}>
            {listHoroscopeItem?.map((item) => (
              <Col span={6}>
                {item?.lifeAttributeId == 1 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="blue">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
                {item?.lifeAttributeId == 2 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="cyan">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
                {item?.lifeAttributeId == 3 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="geekblue">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
                {item?.lifeAttributeId == 4 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="pink">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
                {item?.lifeAttributeId == 5 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="gold">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
                {item?.lifeAttributeId == 6 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="orange">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
                {item?.lifeAttributeId == 7 && (
                  <Card
                    style={{
                      width: 180,
                      border: '1px solid rgba(0,0,0,0.13)',
                      boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
                      padding: 'initial',
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Tag color="purple">{item?.lifeAttributeName}</Tag>
                        {item?.value == 0 && <Tag color="lime">Challenge</Tag>}
                        {item?.value == 1 && <Tag color="default">Trouble</Tag>}
                        {item?.value == 2 && <Tag color="success"> Power</Tag>}
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => handleEditHoroscopeItemForm(item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
              </Col>
            ))}
          </Row>
        )}
      </Content>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal={`Edit`}
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formHoroscopeItemRef}
          buttonSubmitter={buttonSubmitterHoroscopeItem}
          handleSubmitForm={handleSubmitFormHoroscopeItem}
          formField={formFieldEditHoroscopeItem}
          stateEditor={stateEditor}
          handleChangeStateEditor={handleChangeStateEditor}
          editorRef={editorRef}
          handleUploadImgInEditor={handleUploadImgInEditor}
          handleResetForm={handleResetForm}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New Horoscope Item"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formHoroscopeItemRef}
          buttonSubmitter={buttonSubmitterHoroscopeItem}
          handleSubmitForm={handleSubmitFormHoroscopeItem}
          formField={formFieldAddHoroscopeItem}
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

export default HoroScopeItem;
