import { Avatar, Card, Col } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { history } from 'umi';
import React from 'react';
import style from './planet.less';

const Planet = (props) => {
  const { planet } = props;
  const handleClick = () => {
    history.push(`/astrology/planet/${planet.id}`);
  };
  return (
    <Col span={6} key={planet.id}>
      <Card bordered={true} onClick={handleClick} className={style.card}>
        <Meta avatar={<Avatar src={planet.avatar} />} title={planet.title} />
      </Card>
    </Col>
  );
};

export default Planet;
