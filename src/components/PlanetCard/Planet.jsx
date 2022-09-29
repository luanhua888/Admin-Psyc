import { EditOutlined, FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';

const Planet = (props) => {
  const { style, handleClickCard, planet, button, handleButtonView } = props;

  const handleClickCardChild = (planet) => {
    if (handleClickCard) {
      handleClickCard(planet);
    }
  };

  const handleButtonViewChild = (planet) => {
    if (handleButtonView) {
      handleButtonView(planet);
    }
  };

  return (
    <>
      {style ? (
        <Card
          onClick={() => handleClickCardChild(planet)}
          bordered={true}
          style={{
            border: '1px solid #1890FF',
            boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          }}
        >
          {button ? (
            <Row>
              <Col span={16}>
                <Meta
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  avatar={<Avatar src={planet?.avatar} />}
                  title={planet?.title}
                />
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  // type='primary'
                  shape="circle"
                  icon={<FileTextOutlined />}
                  onClick={() => handleButtonViewChild(planet)}
                />
              </Col>
            </Row>
          ) : (
            <Meta avatar={<Avatar src={planet?.avatar} />} title={planet?.title} />
          )}
        </Card>
      ) : (
        <Card
          onClick={() => handleClickCardChild(planet)}
          bordered={true}
          style={{
            boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          }}
        >
          {button ? (
            <Row>
              <Col span={16}>
                <Meta
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  avatar={<Avatar src={planet?.avatar} />}
                  title={planet?.title}
                />
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  // type='primary'
                  shape="circle"
                  icon={<FileTextOutlined />}
                  onClick={() => handleButtonViewChild(planet)}
                />
              </Col>
            </Row>
          ) : (
            <Meta avatar={<Avatar src={planet.avatar} />} title={planet?.title} />
          )}
        </Card>
      )}
    </>
  );
};

export default Planet;
