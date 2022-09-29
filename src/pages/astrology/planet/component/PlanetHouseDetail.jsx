import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import DOMPurify from 'dompurify';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PlanetHouseDetail = (props) => {
  const { planetHouse, handleEditPlanetHouseForm } = props;

  const safeContent = DOMPurify.sanitize(planetHouse?.content);

  const handleEditPlanetHouseFormChild = (planetHouse) => {
    if (handleEditPlanetHouseForm) {
      handleEditPlanetHouseForm(planetHouse);
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
            <p>{planetHouse?.planetName}</p>
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
              Nhà:
            </Text>
            <p>{planetHouse?.houseName}</p>
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
            onClick={() => handleEditPlanetHouseFormChild(planetHouse)}
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

export default PlanetHouseDetail;
