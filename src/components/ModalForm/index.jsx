import React from 'react';

import { Button, Image, Modal, Upload, Space } from 'antd';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ProForm, {
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import ProSkeleton from '@ant-design/pro-skeleton';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';

import Radio from 'antd';

const ModalForm = (props) => {
  const {
    showModal,
    titleModal,
    widthModal,
    handleCancelModel,
    formRef,
    buttonSubmitter,
    handleSubmitForm,
    formField,
    listImgLinkFirebase,
    customUpload,
    imgLinkFirebase,
    stateEditor,
    handleChangeStateEditor,
    editorRef,
    handleUploadImgInEditor,
    handleResetForm,
    handleChangeListImgFirebase,
    editorShortDescriptionRef,
    stateShortDescriptionEditor,
    handleChangeStateShortDescriptionEditor,
    handleOpenModalPicker,
    zIndex,
  } = props;

  //quill editor get css style inline
  const Quill = ReactQuill.Quill;
  let AlignStyle = Quill.import('attributors/style/align');
  let BackgroundStyle = Quill.import('attributors/style/background');
  let ColorStyle = Quill.import('attributors/style/color');
  let DirectionStyle = Quill.import('attributors/style/direction');
  let FontStyle = Quill.import('attributors/style/font');
  let SizeStyle = Quill.import('attributors/style/size');

  let Font = Quill.import('formats/font');

  Font.whitelist = ['Asap', 'Roboto'];
  Quill.register(Font, true);

  Quill.register(AlignStyle, true);
  Quill.register(BackgroundStyle, true);
  Quill.register(ColorStyle, true);
  Quill.register(DirectionStyle, true);
  Quill.register(FontStyle, true);
  Quill.register(SizeStyle, true);
  //state of this component
  const [fileList, setFileList] = React.useState([
    {
      uid: '-1',
      name: '',
      status: 'done',
      thumbUrl: imgLinkFirebase,
    },
  ]);
  //setField vs item

  // xuli khi co link img de bo vao preview
  React.useEffect(() => {
    if (imgLinkFirebase) {
      const newFileList = [];
      fileList.map((item) => {
        item['thumbUrl'] = imgLinkFirebase;
        newFileList.push(item);
      });
      setFileList(newFileList);
    }
    return () => {
      const newFileList = [];
      fileList.map((item) => {
        item['thumbUrl'] = null;
        newFileList.push(item);
      });
      setFileList(newFileList);
    };
  }, [imgLinkFirebase]);

  React.useEffect(() => {
    // set lai list img

    if (listImgLinkFirebase) {
      if (listImgLinkFirebase.length > 0) {
        const newFileList = [];
        listImgLinkFirebase.map((item, index) => {
          const el = {};
          el.uid = Math.random();
          el.status = 'done';
          el.thumbUrl = item;
          newFileList.push(el);
        });
        setFileList(newFileList);
      }
    }

    return () => {
      setFileList([
        {
          uid: '-1',
          name: '',
          status: 'done',
          thumbUrl: imgLinkFirebase,
        },
      ]);
    };
  }, [listImgLinkFirebase]);

  const handleCancelModelChild = (valuses) => {
    if (handleCancelModel) {
      handleCancelModel();
    }
  };
  const handleSubmitFormChild = async (values) => {
    if (handleSubmitForm) {
      await handleSubmitForm(values);
    }
  };
  const handleButtonResetForm = () => {
    if (handleResetForm) {
      handleResetForm();
    }
  };
  const handleButtonSubmitForm = (value) => {
    if (value) {
      value.form?.submit();
    }
  };

  const handleChangeStateEditorChild = (content) => {
    if (handleChangeStateEditor) {
      handleChangeStateEditor(content);
    }
  };

  const customUploadChild = (e) => {
    if (customUpload) {
      customUpload(e);
    }
  };

  const handleImg = () => {
    handleUploadImgInEditor();
  };

  const onChangeListImg = (list) => {
    if (handleChangeListImgFirebase) {
      handleChangeListImgFirebase(list);
    }
  };
  const handleChangeStateShortDescriptionEditorChild = (state) => {
    if (handleChangeStateShortDescriptionEditor) {
      handleChangeStateShortDescriptionEditor(state);
    }
  };

  const handleOpenModalPickerChild = () => {
    if (handleOpenModalPicker) {
      handleOpenModalPicker();
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Modal
        visible={showModal}
        title={titleModal}
        centered={true}
        width={widthModal}
        zIndex={zIndex}
        onCancel={() => handleCancelModelChild()}
        footer={[
          <Button key="cancelModel" type="danger" onClick={() => handleCancelModelChild()}>
            Cancel
          </Button>,
        ]}
      >
        {
          <ProForm
            // form={form}
            onReset={true}
            formRef={formRef}
            submitter={{
              render: (props, doms) => {
                return [
                  <>
                    {buttonSubmitter?.map((button) => (
                      <Button
                        key={button?.key}
                        type={button?.type}
                        onClick={
                          button?.click === 'submit'
                            ? () => handleButtonSubmitForm(props)
                            : () => handleButtonResetForm(props)
                        }
                        loading={button?.loading}
                      >
                        {button?.name}
                      </Button>
                    ))}
                  </>,
                ];
              },
            }}
            onFinish={async (values) => await handleSubmitFormChild(values)}
          >
            {formField?.map((item) => (
              <>
                {item?.fieldType === 'formText' && (
                  <ProForm.Group>
                    <ProFormText
                      key={item?.key}
                      label={item?.label}
                      width={item?.width}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      rules={[
                        {
                          required: item?.requiredField,
                          message: item?.ruleMessage,
                        },
                      ]}
                    />
                  </ProForm.Group>
                )}
                {item?.fieldType === 'datePicker' && (
                  <ProForm.Group>
                    <ProFormDateTimePicker
                      key={item?.key}
                      label={item?.label}
                      width={item?.width}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      rules={[
                        {
                          required: item?.requiredField,
                          message: item?.ruleMessage,
                        },
                      ]}
                    />
                  </ProForm.Group>
                )}
                {item?.fieldType === 'position' && (
                  <ProForm.Group
                    style={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      alignItems: 'center',
                    }}
                  >
                    <ProFormText
                      key={item?.nameLatitude}
                      label={item?.labelLatitude}
                      width={item?.widthLatitude}
                      name={item?.nameLatitude}
                    />
                    <ProFormText
                      key={item?.nameLongtitude}
                      label={item?.labelLongtitude}
                      width={item?.widthLongtitude}
                      name={item?.nameLongtitude}
                    />
                    <Button type="primary" width="default" onClick={handleOpenModalPickerChild}>
                      Pick Location
                    </Button>
                  </ProForm.Group>
                )}
                {item?.fieldType === 'formDigit' && (
                  <ProForm.Group>
                    <ProFormText
                      key={item?.key}
                      label={item?.label}
                      width={item?.width}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      rules={[
                        {
                          required: item?.requiredField,
                          message: item?.ruleMessage,
                        },
                      ]}
                    />
                  </ProForm.Group>
                )}
                {item?.fieldType === 'formSelect' && (
                  <ProForm.Group>
                    <ProFormSelect
                      name={item?.name}
                      label={item?.label}
                      options={item?.valueEnum?.map((valueItem) => ({
                        label: valueItem.valueDisplay,
                        value: valueItem.valueName,
                      }))}
                      disabled={item?.disable}
                      placeholder={item?.placeholder}
                      rules={[
                        {
                          required: item?.requiredField,
                          message: item?.ruleMessage,
                        },
                      ]}
                    />
                  </ProForm.Group>
                )}
                {item?.fieldType === 'formCalendar' && (
                  <ProForm.Group>
                    <ProFormDigit
                      name={item?.nameTimeDay}
                      label={item?.labelTimeDay}
                      min={item?.minTimeDay}
                      max={item?.maxTimeDay}
                      placeholder={item?.placeholderTimeDay}
                    />
                    <ProFormDigit
                      name={item?.nameTimeMonth}
                      label={item?.labelTimeMonth}
                      min={item?.minTimeMonth}
                      max={item?.maxTimeMonth}
                      placeholder={item?.placeholderTimeMonth}
                    />
                  </ProForm.Group>
                )}
                {item?.fieldType === 'formInputFileImg' && (
                  <ProForm.Group>
                    <ProFormText
                      key={item?.key}
                      label={item?.label}
                      width={item?.width}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      rules={[
                        {
                          required: item?.requiredField,
                          message: item?.ruleMessage,
                        },
                      ]}
                      disabled={item?.readOnly}
                    />

                    <Upload
                      name={item?.nameUpload}
                      customRequest={customUploadChild}
                      listType="picture-card"
                      fileList={fileList}
                    >
                      {imgLinkFirebase ? null : uploadButton}
                    </Upload>
                  </ProForm.Group>
                )}
                {item?.fieldType === 'uploadListImg' && (
                  <ProForm.Group>
                    <Upload
                      name={item?.nameUpload}
                      customRequest={customUploadChild}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChangeListImg}
                    >
                      {fileList.length >= 3 ? null : uploadButton}
                    </Upload>
                  </ProForm.Group>
                )}
                {item?.fieldType === 'formTextArea' && (
                  <ProForm.Group>
                    <ProFormTextArea
                      key={item?.key}
                      label={item?.label}
                      width={item?.width}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      rules={[
                        {
                          required: item?.requiredField,
                          message: item?.ruleMessage,
                        },
                      ]}
                    />
                  </ProForm.Group>
                )}
                {item?.fieldType === 'ShortDescription' && (
                  <>
                    <ProForm.Group title={item?.title}>
                      <ReactQuill
                        ref={editorShortDescriptionRef}
                        value={stateShortDescriptionEditor}
                        style={{
                          marginBottom: '20px',
                          paddingBottom: '40px',
                          width: '690px',

                          overflow: 'scroll',
                          overflowX: 'hidden',
                          overflowY: 'hidden',
                        }}
                        className={'short'}
                        modules={{
                          toolbar: {
                            container: [
                              [{ header: [1, 2, 3, 4, 5, 6] }, { font: Font.whitelist }],
                              [{ size: [] }],
                              [
                                { align: '' },
                                { align: 'center' },
                                { align: 'right' },
                                { align: 'justify' },
                              ],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link'],
                              ['image'],
                            ],
                            handlers: {
                              image: handleImg,
                            },
                          },
                        }}
                        formats={[
                          'header',
                          'font',
                          'size',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'blockquote',
                          'list',
                          'bullet',
                          'indent',
                          'link',
                          'image',
                          'color',
                          'align',
                        ]}
                        onChange={(content) =>
                          handleChangeStateShortDescriptionEditorChild(content)
                        }
                      />

                      <ProForm.Group
                        style={{
                          display: 'none',
                        }}
                      >
                        <ProFormTextArea name={item?.nameTextArea} />
                      </ProForm.Group>
                    </ProForm.Group>
                  </>
                )}
                {item?.fieldType === 'EditorMainContent' && (
                  <>
                    <ProForm.Group title={item?.title}>
                      <ReactQuill
                        ref={editorRef}
                        value={stateEditor}
                        style={{
                          marginBottom: '20px',
                          width: '900px',
                          overflow: 'scroll',
                          overflowX: 'hidden',
                          overflowY: 'hidden',
                        }}
                        modules={{
                          toolbar: {
                            container: [
                              [{ header: [1, 2, 3, 4, 5, 6] }, { font: Font.whitelist }],
                              [{ size: [] }],
                              [
                                { align: '' },
                                { align: 'center' },
                                { align: 'right' },
                                { align: 'justify' },
                              ],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link'],
                              ['image'],
                            ],
                            handlers: {
                              image: handleImg,
                            },
                          },
                        }}
                        formats={[
                          'header',
                          'font',
                          'size',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'blockquote',
                          'list',
                          'bullet',
                          'indent',
                          'link',
                          'image',
                          'color',
                          'align',
                        ]}
                        onChange={(content) => handleChangeStateEditorChild(content)}
                      />

                      <ProForm.Group
                        style={{
                          display: 'none',
                        }}
                      >
                        <ProFormTextArea name={item?.nameTextArea} />
                      </ProForm.Group>
                    </ProForm.Group>
                  </>
                )}
                {item?.fieldType === 'checkEdit' && (
                  <ProForm.Group
                    style={{
                      display: 'none',
                    }}
                  >
                    <ProFormText name={item?.name} initialValue={item?.value} />
                  </ProForm.Group>
                )}
              </>
            ))}
          </ProForm>
        }
      </Modal>
    </>
  );
};

export default React.memo(ModalForm);
