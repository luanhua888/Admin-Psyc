import React from 'react';
import { Col, Row } from 'antd';
import Zodiac from '../ZodiacCard/Zodiac';
const ListZodiac = (props) => {
  const { zodiacList, span, handleClickCard, button, handleButtonView } = props;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        marginBottom: '12px',
      }}
    >
      {zodiacList.map((item) => (
        <Col span={span} key={item.id}>
          {item?.selected ? (
            <Zodiac
              handleClickCard={handleClickCard}
              style={true}
              zodiac={item}
              button={button}
              handleButtonView={handleButtonView}
            />
          ) : (
            <Zodiac
              handleClickCard={handleClickCard}
              zodiac={item}
              button={button}
              handleButtonView={handleButtonView}
            />
          )}
        </Col>
      ))}
    </Row>
  );
};

export default ListZodiac;
