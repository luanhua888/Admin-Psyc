import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import DOMPurify from 'dompurify';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AspectDetail = (props) => {
  const { aspect, handleEditAspectForm } = props;

  const safeContent = DOMPurify.sanitize(aspect?.mainContent);

  const handleEditAspectFormChild = (aspect) => {
    if (handleEditAspectForm) {
      handleEditAspectForm(aspect);
    }
  };

  return (
    <>
      <Row>
        <Col span={20}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}
          >
            <Text
              code
              style={{
                marginRight: '4px',
              }}
            >
              Hành Tinh Gốc:
            </Text>
            <p>{aspect?.planetBaseName}</p>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}
          >
            <Text
              code
              style={{
                marginRight: '4px',
              }}
            >
              Hành Tinh Tạo Góc:
            </Text>
            <p>{aspect?.planetCompareName}</p>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              marginBottom: '8px',
            }}
          >
            <Text
              code
              style={{
                marginRight: '6px',
                width: '10%',
              }}
            >
              Mô Tả:
            </Text>
            <p
              style={{
                width: '90%',
              }}
            >
              {aspect?.description}
            </p>
          </div>
        </Col>
        <Col
          span={4}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEditAspectFormChild(aspect)}
          />
        </Col>
      </Row>
      <div
        dangerouslySetInnerHTML={{ __html: safeContent }}
        style={{
          boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          border: '1px solid #1890FF',
          padding: '8px',
        }}
      />
    </>
  );
};

export default AspectDetail;
