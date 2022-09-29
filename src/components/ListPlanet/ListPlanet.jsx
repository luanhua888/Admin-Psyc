import React from 'react';
import { Col, Row } from 'antd';
import Planet from '../PlanetCard/Planet';

const ListPlanet = (props) => {
  const { planetList, span, handleClickCard, button, handleButtonView } = props;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        marginBottom: '12px',
      }}
    >
      {planetList.map((item) => (
        <Col span={span} key={item.id}>
          {item?.selected ? (
            <Planet
              handleClickCard={handleClickCard}
              style={true}
              planet={item}
              button={button}
              handleButtonView={handleButtonView}
            />
          ) : (
            <Planet
              handleClickCard={handleClickCard}
              planet={item}
              button={button}
              handleButtonView={handleButtonView}
            />
          )}
        </Col>
      ))}
    </Row>
  );
};

export default ListPlanet;
