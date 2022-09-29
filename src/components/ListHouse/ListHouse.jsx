import React from 'react';
import { Col, Row } from 'antd';
import House from '../HouseCard/House';

const ListHouse = (props) => {
  const { houseList, span, handleClickCard, button, handleButtonView } = props;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        marginBottom: '12px',
      }}
    >
      {houseList.map((item) => (
        <Col span={span} key={item.id}>
          {item?.selected ? (
            <House
              handleClickCard={handleClickCard}
              style={true}
              house={item}
              button={button}
              handleButtonView={handleButtonView}
            />
          ) : (
            <House
              handleClickCard={handleClickCard}
              house={item}
              button={button}
              handleButtonView={handleButtonView}
            />
          )}
        </Col>
      ))}
    </Row>
  );
};

export default ListHouse;
