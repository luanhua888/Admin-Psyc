import ModalForm from '@/components/ModalForm';
import { getProductMaster, getProductMasters } from '@/services/productmaster';
import { getProductVariants } from '@/services/productvariant';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Space, Tag } from 'antd';
import React from 'react';

const ProductVariant = () => {
  const column = [
    {
      title: 'No.',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
      search: false,
      width: '10%',
    },
    {
      title: 'ProductMaster Name',
      dataIndex: 'masterName',
      copyable: true,
      valueType: 'masterName',
      sorter: (a, b) => a.masterName.localeCompare(b.masterName),
      search: false,
      width: '20%',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      copyable: true,
      valueType: 'size',
      sorter: (a, b) => a.size.localeCompare(b.size),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter size to search',
          },
        ],
      },
      width: '10%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      copyable: true,
      valueType: 'price',
      sorter: (a, b) => a.price.localeCompare(b.price),
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter price to search',
          },
        ],
      },
      width: '15%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      copyable: true,
      valueType: 'gender',
      search: false,
      render: (_, record) => (
        <Space>
          {record.gender == '0' && <Tag color={'pink'}>Male</Tag>}
          {record.gender == '1' && <Tag color={'blue'}>Female</Tag>}
        </Space>
      ),
      width: '10%',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      valueType: 'color',
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Color to search',
          },
        ],
      },
      width: '15%',
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      copyable: true,
      valueType: 'inventory',
      sorter: (a, b) => a.inventory - b.inventory,
      formItemProps: {
        rules: [
          {
            require: true,
            message: 'Enter Inventory to search',
          },
        ],
      },
      width: '10%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      search: false,
      render: (_, record) => {
        return (
          <Button
            key="editProduct"
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            block="true"
            onClick={() => handleEditProductVariantForm(record)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const buttonSubmitter = [
    {
      key: 'clearFieldFormProduct',
      type: 'default',
      click: 'reset',
      name: 'Reset',
      loading: false,
    },
    {
      key: 'submitAddProduct',
      type: 'primary',
      click: 'submit',
      name: 'Submit',
      loading: false,
    },
  ];

  const formFieldAdd = [
    {
      fieldType: 'formSelect',
      key: 'selectProductMasterId',
      name: 'masterProductId',
      label: 'Product Master',
      placeholder: 'Select ProductMaster',
      requiredField: 'true',
      ruleMessage: 'Please select ProductMaster',
      valueEnum: [],
    },
    {
      fieldType: 'formText',
      key: 'fieldAddSize',
      label: 'Size',
      width: 'lg',
      placeholder: 'Enter product size',
      name: 'size',
      requiredField: 'true',
      ruleMessage: 'Input size before submit',
    },
    {
      fieldType: 'formDigit',
      key: 'fieldAddPrice',
      label: 'Price',
      width: 'lg',
      placeholder: 'Enter product price',
      name: 'price',
      requiredField: 'true',
      ruleMessage: 'Input price before submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGender',
      name: 'gender',
      label: 'Gender',
      defaultValue: 1,
      valueEnum: [
        {
          valueName: 1,
          valueDisplay: 'Female',
        },
        {
          valueName: 0,
          valueDisplay: 'Male',
        },
      ],
      placeholder: 'Select Gender',
      requiredField: 'true',
      ruleMessage: 'Please select product gender',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddColor',
      label: 'Colr',
      width: 'lg',
      placeholder: 'Enter product color',
      name: 'color',
      requiredField: 'true',
      ruleMessage: 'Input color before submit',
    },
    {
      fieldType: 'formDigit',
      key: 'fieldAddInventory',
      label: 'Inventory',
      width: 'lg',
      placeholder: 'Enter product inventory',
      name: 'inventory',
      requiredField: 'true',
      ruleMessage: 'Input inventory before submit',
    },
    {
      fieldType: 'uploadListImg',
      nameUpload: 'uploadListImg',
    },
  ];

  const formFieldEdit = [
    {
      fieldType: 'formSelect',
      key: 'selectProductMasterId',
      name: 'masterProductId',
      label: 'Product Master',
      placeholder: 'Select ProductMaster',
      requiredField: 'true',
      ruleMessage: 'Please select ProductMaster',
      valueEnum: [],
    },
    {
      fieldType: 'formText',
      key: 'fieldAddSize',
      label: 'Size',
      width: 'lg',
      placeholder: 'Enter product size',
      name: 'size',
      requiredField: 'true',
      ruleMessage: 'Input size before submit',
    },
    {
      fieldType: 'formDigit',
      key: 'fieldAddPrice',
      label: 'Price',
      width: 'lg',
      placeholder: 'Enter product price',
      name: 'price',
      requiredField: 'true',
      ruleMessage: 'Input price before submit',
    },
    {
      fieldType: 'formSelect',
      key: 'selectGender',
      name: 'gender',
      label: 'Gender',
      defaultValue: 1,
      valueEnum: [
        {
          valueName: 1,
          valueDisplay: 'Female',
        },
        {
          valueName: 0,
          valueDisplay: 'Male',
        },
      ],
      placeholder: 'Select Gender',
      requiredField: 'true',
      ruleMessage: 'Please select product gender',
    },
    {
      fieldType: 'formText',
      key: 'fieldAddColor',
      label: 'Colr',
      width: 'lg',
      placeholder: 'Enter product color',
      name: 'color',
      requiredField: 'true',
      ruleMessage: 'Input color before submit',
    },
    {
      fieldType: 'formDigit',
      key: 'fieldAddInventory',
      label: 'Inventory',
      width: 'lg',
      placeholder: 'Enter product inventory',
      name: 'inventory',
      requiredField: 'true',
      ruleMessage: 'Input inventory before submit',
    },
    {
      fieldType: 'uploadListImg',
      nameUpload: 'uploadListImg',
    },
    {
      fieldType: 'checkEdit',
      name: 'edit',
      value: 'edit',
    },
  ];

  //ref
  const tableProductVariantRef = React.useRef();
  const formProductVariantRef = React.useRef();
  //sate cua list product master
  const [listProductMaster, setListProductMaster] = React.useState();
  //state cua upload img len firebase
  const [listImgLinkFirebase, setListImgLinkFirebase] = React.useState([]);
  const [loadingUploadImgFirebase, setLoadingUploadingImgFirebase] = React.useState(false);
  //state cua modal add or edit
  const [showModal, setShowModal] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [productVariantRecord, setProductVariantRecord] = React.useState(null);
  const [flagEditForm, setFlagEditForm] = React.useState('');
  const [buttonSubmitterProductVariant, setButtonSubmitterProductVariant] =
    React.useState(buttonSubmitter);
  const [formFieldAddProductVariant, setFormFieldAddProductVariant] = React.useState(formFieldAdd);
  const [formFieldEditProductVariant, setFormFieldEditProductVariant] =
    React.useState(formFieldEdit);
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [total, setTotal] = React.useState(10);

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
    (async () => {
      const result = await getProductMasters();
      if (result?.length > 0) {
        setListProductMaster(result);
        const valueEnum = [];
        result.map((item) => {
          const el = {
            valueName: item.id,
            valueDisplay: item.name,
          };
          valueEnum.push(el);
        });
        const newFieldAdd = [];
        formFieldAdd?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectProductMasterId') {
            item.valueEnum = [...valueEnum];
            newFieldAdd.push(item);
          } else {
            newFieldAdd.push(item);
          }
        });
        setFormFieldAddProductVariant(newFieldAdd);
        const newFieldEdit = [];
        formFieldEdit?.map((item) => {
          if (item?.fieldType === 'formSelect' && item?.key === 'selectProductMasterId') {
            item.valueEnum = [...valueEnum];
            newFieldEdit.push(item);
          } else {
            newFieldEdit.push(item);
          }
        });
        setFormFieldEditProductVariant(newFieldEdit);
      }
    })();
  }, []);

  //xuli pass productmaster record
  React.useEffect(() => {
    if (productVariantRecord) {
      formProductVariantRef?.current?.setFieldsValue(productVariantRecord);
    }
  }, [productVariantRecord]);

  React.useEffect(() => {
    const newButtonSubmitterPV = buttonSubmitterProductVariant.map((item) => {
      if (item.name === 'Submit') {
        item.loading = buttonLoading;
      }
      return item;
    });
    setButtonSubmitterProductVariant(newButtonSubmitterPV);
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
      console.log('fileUploading', file);
      const imgLink = await uploadFile(file, 'productmaster');

      if (imgLink) {
        const newListImg = [...listImgLinkFirebase];
        console.log('newListImg', newListImg);

        newListImg.push(imgLink);
        setListImgLinkFirebase(newListImg);

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
    //khi huy modal phai reset flag edit ve rong
    setFlagEditForm('');
    setProductVariantRecord(null);
    setListImgLinkFirebase([]);
  };

  //xuli dong modal
  const handleCancelModal = () => {
    setShowModal(false);
    setButtonLoading(false);
    setFlagEditForm('');
    setProductVariantRecord(null);
    setListImgLinkFirebase([]);
    if (formProductVariantRef) {
      formProductVariantRef?.current?.resetFields();
    }
  };

  //xuli reset form
  const handleResetForm = () => {
    formProductVariantRef?.current?.resetFields();
    setListImgLinkFirebase([]);
  };

  //xuli change list img
  const handleChangeListImgFirebase = (list) => {
    console.log('listImgFirebase', list);
    const newList = listImgLinkFirebase.filter((item) => {
      return item != list.file.thumbUrl;
    });
    setListImgLinkFirebase(newList);
  };

  //xuli submit form
  const handleSubmitFormProductVariant = async (values) => {
    setButtonLoading(true);
    if (values.edit) {
      console.log('values edit', values);
    } else {
      console.log('values add', values);
    }
    tableProductMasterRef?.current?.reload();
    setButtonLoading(false);
  };

  //xuli mo form edit zodiac
  const handleEditProductVariantForm = (record) => {
    setFlagEditForm('edit');
    setShowModal(!showModal);
    setProductVariantRecord(record);
    setListImgLinkFirebase(record.imgLinks);
    console.log('productmaster', record);
  };

  return (
    <>
      <PageContainer>
        <ProTable
          columns={column}
          actionRef={tableProductVariantRef}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onchange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          search={{
            labelWidth: 'auto',
            searchText: 'Search',
            submittext: 'Submit',
            resetText: 'Reset',
          }}
          toolBarRender={(action) => [
            <Button
              size="middle"
              key="buttonAddUser"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModal()}
            >
              Add
            </Button>,
          ]}
          request={async (params, sort, filter) => {
            const currentAttr = 'current';
            const pageSizeAttr = 'pageSize';
            const newParams = Object.keys(params).reduce((item, key) => {
              if (key != currentAttr && key != pageSizeAttr) {
                if (key === 'size') {
                  item.size = params[key];
                } else {
                  item[key] = params[key];
                }
              }
              return item;
            }, {});
            console.log('params', newParams);
            const data = [];
            await getProductVariants(newParams).then((res) => {
              console.log('res at table query', res);
              res?.payload?.map((item, index) => {
                console.log('item product variant', item);
                // console.log('productmasterid', item.id);
                // const product = getProductMaster(item.id);
                // console.log('productmaster', product);
                item.number = index + 1;
                data[index] = item;
              });
              setTotal(res?.total);
            });
            return {
              data: data,
              success: true,
            };
          }}
        />
      </PageContainer>
      {flagEditForm === 'edit' ? (
        <ModalForm
          showModal={showModal}
          handleCancelModel={handleCancelModal}
          formRef={formProductVariantRef}
          buttonSubmitter={buttonSubmitterProductVariant}
          handleSubmitForm={handleSubmitFormProductVariant}
          formField={formFieldEditProductVariant}
          customUpload={customUpload}
          listImgLinkFirebase={listImgLinkFirebase}
          handleResetForm={handleResetForm}
          handleChangeListImgFirebase={handleChangeListImgFirebase}
        />
      ) : (
        <ModalForm
          showModal={showModal}
          titleModal="Add New Product Variant"
          handleCancelModel={handleCancelModal}
          formRef={formProductVariantRef}
          buttonSubmitter={buttonSubmitterProductVariant}
          handleSubmitForm={handleSubmitFormProductVariant}
          formField={formFieldEditProductVariant}
          customUpload={customUpload}
          listImgLinkFirebase={listImgLinkFirebase}
          handleResetForm={handleResetForm}
        />
      )}
    </>
  );
};

export default ProductVariant;
