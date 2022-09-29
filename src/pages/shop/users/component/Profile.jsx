import { uploadFile } from '@/utils/uploadFile';
import { Avatar, Button, message, Modal, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getProfiles,
  deleteProfile,
  getAnProfile,
  updateProfile,
  addProfile,
} from '@/services/profile';
import ModalForm from '@/components/ModalForm';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import MapPicker from 'react-google-map-picker';

const Profile = (props) => {
  const { user } = props;

  const DefaultLocation = { lat: 10.8, lng: 106.8 };
  const DefaultZoom = 10;

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter House Name to search',
          },
        ],
      },
    },
    {
      title: 'Photo',
      dataIndex: 'profilePhoto',
      render: (_, record) => {
        return (
          <Space>
            <Avatar size="default" src={record.profilePhoto} />
          </Space>
        );
      },
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      render: (_, record) => {
        return (
          <Space>
            <Tag color="geekblue">{record.birthDate.replace('T', ' ')}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Birth Place',
      dataIndex: 'birthPlace',
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Birth Place to search',
          },
        ],
      },
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
                key="editHouse"
                type="primary"
                size="middle"
                block={true}
                icon={<EditOutlined />}
                onClick={() => handleEditProfileForm(record)}
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
                key="deleteHouse"
                type="danger"
                size="middle"
                block="true"
                icon={<DeleteOutlined />}
                onClick={() => handleOkDeleteHouse(record)}
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
      key: 'clearFormProfile',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddProfile',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formText',
      key: 'fieldAddProfileName',
      label: 'Profile Name',
      width: 'lg',
      placeholder: 'Enter Profile Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input Profile Name before submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGender',
      name: 'gender',
      label: 'Gender',
      placeholder: 'Select Gender',
      requiredField: 'true',
      ruleMessage: 'Please select Gender',
      valueEnum: [
        {
          valueName: false,
          valueDisplay: 'Female',
        },
        {
          valueName: true,
          valueDisplay: 'Male',
        },
      ],
    },
    {
      fieldType: 'datePicker',
      key: 'fieldAddBirthDate',
      label: 'Birth Date',
      width: 'lg',
      placeholder: 'Select Birth Date',
      name: 'birthDate',
      requiredField: 'true',
      ruleMessage: 'Input Birth Date before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddBirthPlace',
      label: 'Birth Place',
      width: 'lg',
      placeholder: 'Enter Birth Place',
      name: 'birthPlace',
      requiredField: 'true',
      ruleMessage: 'Input Birth Place before submit',
    },
    {
      fieldType: 'position',
      labelLatitude: 'Latitude',
      widthLatitude: 'small',
      nameLatitude: 'latitude',
      labelLongtitude: 'Longitude',
      widthLongtitude: 'small',
      nameLongtitude: 'longitude',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Profile Photo',
      width: 'lg',
      placeholder: 'Profile Photo',
      name: 'profilePhoto',
      nameUpload: 'profilePhotoFirebase',
      nameInputFile: 'profileFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formText',
      key: 'fieldAddProfileName',
      label: 'Profile Name',
      width: 'lg',
      placeholder: 'Enter Profile Name',
      name: 'name',
      requiredField: 'true',
      ruleMessage: 'Input Profile Name before submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGender',
      name: 'gender',
      label: 'Gender',
      placeholder: 'Select Gender',
      requiredField: 'true',
      ruleMessage: 'Please select Gender',
      valueEnum: [
        {
          valueName: false,
          valueDisplay: 'Female',
        },
        {
          valueName: true,
          valueDisplay: 'Male',
        },
      ],
    },
    {
      fieldType: 'datePicker',
      key: 'fieldAddBirthDate',
      label: 'Birth Date',
      width: 'lg',
      placeholder: 'Select Birth Date',
      name: 'birthDate',
      requiredField: 'true',
      ruleMessage: 'Input Birth Date before submit',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddBirthPlace',
      label: 'Birth Place',
      width: 'lg',
      placeholder: 'Enter Birth Place',
      name: 'birthPlace',
      requiredField: 'true',
      ruleMessage: 'Input Birth Place before submit',
    },
    {
      fieldType: 'position',
      labelLatitude: 'Latitude',
      widthLatitude: 'small',
      nameLatitude: 'latitude',
      labelLongtitude: 'Longitude',
      widthLongtitude: 'small',
      nameLongtitude: 'longitude',
    },
    {
      fieldType: 'formInputFileImg',
      key: 'fieldGetImgLink',
      label: 'Profile Photo',
      width: 'lg',
      placeholder: 'Profile Photo',
      name: 'profilePhoto',
      nameUpload: 'profilePhotoFirebase',
      nameInputFile: 'profileFileToFirebase',
      readOnly: 'true',
      requiredField: 'true',
      ruleMessage: 'Upload image before submit',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  //ref cua table, editor, form
  const tableProfileRef = React.useRef();
  const formProfileRef = React.useRef();
  //state cua upload img len firebase
  const [imgLinkFirebase, setImgLinkFirebase] = React.useState(null);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //data table
  const [dataTable, setDataTable] = useState([]);
  //trigger render table
  const [triggerDataTable, setTriggerDataTable] = useState(false);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [profileRecord, setProfileRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterProfile, setButtonSubmitterProfile] = React.useState(buttonSubmitter);
  const [formFieldAddProfile, setFormFieldAddProfile] = React.useState(formFieldAdd);
  const [formFieldEditProfile, setFormFieldEditProfile] = React.useState(formFieldEdit);
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [total, setTotal] = React.useState(20);
  //buttonEditLoading
  const [buttonEditLoading, setButtonEditLoading] = React.useState(false);
  //state cua gg picker
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  const [modalPicker, setModalPicker] = useState(false);
  //get list profile of user
  React.useEffect(() => {
    (async () => {
      const listProfile = [];
      const params = {
        userId: user?.id,
        page: page,
        pageSize: pageSize,
      };
      console.log('params', params);
      const data = await getProfiles(params);
      if (data?.payload) {
        data?.payload?.map((item, index) => {
          listProfile[index] = item;
        });
        setTotal(data?.total);
        setDataTable(listProfile);
      }
    })();
  }, [triggerDataTable]);

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

  React.useEffect(() => {
    formProfileRef?.current?.setFieldsValue({
      ['latitude']: location.lat,
      ['longitude']: location.lng,
    });
  }, [location]);

  //xuli loading button submit form add or edit house
  React.useEffect(() => {
    const newButtonSubmitProfile = buttonSubmitterProfile.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterProfile(newButtonSubmitProfile);
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
      const imgLink = await uploadFile(file, 'profile');

      if (imgLink) {
        setImgLinkFirebase(imgLink);
        formProfileRef?.current?.setFieldsValue({
          ['profilePhoto']: imgLink,
        });
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
    setProfileRecord(null);
    setImgLinkFirebase(null);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setProfileRecord(null);
    setImgLinkFirebase(null);
    setLocation(DefaultLocation);
    if (formProfileRef) {
      formProfileRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formProfileRef?.current?.resetFields();
    setImgLinkFirebase(null);
  };

  //xuli submit form
  const handleSubmitFormProfile = async (values) => {
    setButtonLoading(true);
    values.birthDate = values.birthDate.replace(' ', 'T');
    values.longtitude = values.longitude;
    delete values.longitude;
    if (values.edit) {
      const profileId = profileRecord.id;
      const newValues = Object.assign({}, values);
      const attr = 'edit';
      const dataEdit = Object.keys(newValues).reduce((item, key) => {
        if (key !== attr) {
          item[key] = newValues[key];
        }
        return item;
      }, {});
      await updateProfile(profileId, dataEdit);
    } else {
      values.userId = user?.id;
      await addProfile(values);
      handleResetForm();
    }
    setTriggerDataTable(!triggerDataTable);
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditProfileForm = async (record) => {
    const profileId = record.id;
    setButtonEditLoading(true);
    const profile = await getAnProfile(profileId);
    if (profile?.id) {
      setProfileRecord(profile);
      setFlagEditForm('edit');
      setShowModal(!showModal);
      formProfileRef?.current?.setFieldsValue(profile);
      setButtonEditLoading(false);
    }
  };

  const handleDeleteProfile = async (record) => {
    await deleteProfile(record.id);
  };
  //xu li lien quan den map picker
  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
    message.success('Get Location Success!');
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  const handleOpenModalPicker = () => {
    setModalPicker(true);
  };

  const handleCancelModalPicker = () => {
    setModalPicker(false);
  };

  const onChangePaging = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    setTriggerDataTable(!triggerDataTable);
  };

  return (
    <>
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
            width: '90%',
          }}
        >
          <ProTable
            columns={column}
            actionRef={tableProfileRef}
            onReset={true}
            size="small"
            cardBordered={{
              table: true,
            }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: (page, pageSize) => onChangePaging(page, pageSize),
            }}
            search={false}
            toolBarRender={(action) => [
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button
                  size="middle"
                  key="buttonAddAspect"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleModal()}
                >
                  Add
                </Button>
              </div>,
            ]}
            dataSource={dataTable}
          />
        </div>
      </div>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          titleModal="Editing"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formProfileRef}
          buttonSubmitter={buttonSubmitterProfile}
          handleSubmitForm={handleSubmitFormProfile}
          formField={formFieldEditProfile}
          handleResetForm={handleResetForm}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleOpenModalPicker={handleOpenModalPicker}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add"
          widthModal="900"
          handleCancelModel={handleCancelModal}
          formRef={formProfileRef}
          buttonSubmitter={buttonSubmitterProfile}
          handleSubmitForm={handleSubmitFormProfile}
          formField={formFieldAddProfile}
          handleResetForm={handleResetForm}
          customUpload={customUpload}
          imgLinkFirebase={imgLinkFirebase}
          handleOpenModalPicker={handleOpenModalPicker}
        />
      )}
      <Modal
        visible={modalPicker}
        onCancel={() => handleCancelModalPicker()}
        closable={false}
        title={false}
        width="1300px"
        footer={[
          <Button key="cancelModelView" type="default" onClick={() => handleCancelModalPicker()}>
            Close
          </Button>,
        ]}
      >
        <MapPicker
          defaultLocation={defaultLocation}
          zoom={zoom}
          mapTypeId="roadmap"
          style={{ height: '700px' }}
          onChangeLocation={handleChangeLocation}
          onChangeZoom={handleChangeZoom}
          apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
        />
      </Modal>
    </>
  );
};

export default Profile;
