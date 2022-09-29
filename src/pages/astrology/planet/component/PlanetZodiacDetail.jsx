import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import DOMPurify from 'dompurify';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PlanetZodiacDetail = (props) => {
  const { planetZodiac, handleEditPlanetZodiacForm } = props;

  const safeContent = DOMPurify.sanitize(planetZodiac?.content);

  const handleEditPlanetZodiacFormChild = (planetZodiac) => {
    if (handleEditPlanetZodiacForm) {
      handleEditPlanetZodiacForm(planetZodiac);
    }
  };

  return (
    <>
      <Row>
        <Col span={16}>
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
              Hành Tinh:
            </Text>
            <p>{planetZodiac?.planetName}</p>
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
              }}
            >
              Cung Hoàng Đạo:
            </Text>
            <p>{planetZodiac?.zodiacName}</p>
          </div>
        </Col>
        <Col
          span={8}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEditPlanetZodiacFormChild(planetZodiac)}
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

export default PlanetZodiacDetail;
