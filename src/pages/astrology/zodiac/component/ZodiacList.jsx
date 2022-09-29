import { Row } from 'antd';
import React from 'react';
import Zodiac from './Zodiac';

const ZodiacList = (props) => {
  const { dataList } = props;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        marginBottom: '12px',
        marginTop: '12px',
      }}
    >
      {dataList.map((item) => (
        <Zodiac zodiac={item} />
      ))}
    </Row>
  );
};

export default ZodiacList;
