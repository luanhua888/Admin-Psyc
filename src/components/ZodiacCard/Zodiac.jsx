import { EditOutlined, FileTextOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';
import styles from './zodiac.less';

const Zodiac = (props) => {
  const { style, handleClickCard, zodiac, button, handleButtonView } = props;

  const handleClickCardChild = (zodiac) => {
    if (handleClickCard) {
      handleClickCard(zodiac);
    }
  };

  const handleButtonViewChild = (zodiac) => {
    if (handleButtonView) {
      handleButtonView(zodiac);
    }
  };
  return (
    <>
      {style ? (
        <Card
          onClick={() => handleClickCardChild(zodiac)}
          bordered={true}
          style={{
            border: '1px solid #1890FF',
            boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          }}
          className={styles.card}
        >
          {button ? (
            <Row>
              <Col span={16}>
                <Meta
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  avatar={<Avatar src={zodiac.avatar} />}
                  title={zodiac.title}
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
                  onClick={() => handleButtonViewChild(zodiac)}
                />
              </Col>
            </Row>
          ) : (
            <Meta avatar={<Avatar src={zodiac.avatar} />} title={zodiac.title} />
          )}
        </Card>
      ) : (
        <Card
          onClick={() => handleClickCardChild(zodiac)}
          bordered={true}
          style={{
            boxShadow: '-1px 0px 12px -2px rgba(0,0,0,0.25)',
          }}
          className={styles.card}
        >
          {button ? (
            <Row>
              <Col span={16}>
                <Meta
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  avatar={<Avatar src={zodiac.avatar} />}
                  title={zodiac.title}
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
                  onClick={() => handleButtonViewChild(zodiac)}
                />
              </Col>
            </Row>
          ) : (
            <Meta avatar={<Avatar src={zodiac.avatar} />} title={zodiac.title} />
          )}
        </Card>
      )}
    </>
  );
};

export default Zodiac;
