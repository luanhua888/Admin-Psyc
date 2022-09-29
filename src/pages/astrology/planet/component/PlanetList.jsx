import { Row } from 'antd';
import React from 'react';
import Planet from './Planet';

const PlanetList = (props) => {
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
        <Planet planet={item} />
      ))}
    </Row>
  );
};

export default PlanetList;
