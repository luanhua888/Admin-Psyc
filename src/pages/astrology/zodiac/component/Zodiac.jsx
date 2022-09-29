import { Avatar, Card, Col } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { history } from 'umi';
import React from 'react';
import style from './zodiac.less';

const Zodiac = (props) => {
  const { zodiac } = props;
  const handleClick = () => {
    history.push(`/astrology/zodiac/${zodiac.id}`);
  };
  return (
    <Col span={6} key={zodiac.id}>
      <Card bordered={true} onClick={handleClick} className={style.card}>
        <Meta avatar={<Avatar src={zodiac.avatar} />} title={zodiac.title} />
      </Card>
    </Col>
  );
};

export default Zodiac;
