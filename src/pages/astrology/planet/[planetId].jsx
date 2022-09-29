import React, { useEffect, useState } from 'react';
import { getAnPlanet } from '@/services/planet';
import { Tabs } from 'antd';
import PlanetDetail from './component/PlanetDetail';
import PlanetZodiac from './component/PlanetZodiac';
import PlanetHouse from './component/PlanetHouse';
import Aspect from './component/Aspect';
import { Content } from 'antd/lib/layout/layout';
import ShortPlanetDetail from './component/ShortPlanetDetail';
const { TabPane } = Tabs;
const DetailPlanet = (props) => {
  const {
    history: {},
    match: {
      params: { planetId },
    },
  } = props;

  const [planet, setPlanet] = useState({});
  const [loading, setLoading] = useState(true);
  const [triggerLoadPlanet, setTriggerLoadPlanet] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const planet = await getAnPlanet(planetId);
        setPlanet(planet);
      } catch (error) {
        console.log('errorLoadDetailPlanet', error);
      }
      setLoading(false);
    })();
  }, [triggerLoadPlanet]);

  const handleTriggerLoadPlanet = () => {
    setTriggerLoadPlanet(!triggerLoadPlanet);
  };

  const handleChange = (key) => {
    console.log(key);
  };

  const handleTabClick = (key) => {
    console.log(key);
  };

  return (
    <>
      <Content
        style={{
          padding: '0px 200px',
        }}
      >
        <ShortPlanetDetail planet={planet} />
        <Tabs
          defaultActiveKey="2"
          tabPosition="top"
          size="large"
          type="line"
          centered={true}
          onChange={handleChange}
          onTabClick={handleTabClick}
        >
          <TabPane tab="Detail Planet" key="1">
            <PlanetDetail planet={planet} handleTriggerLoadPlanet={handleTriggerLoadPlanet} />
          </TabPane>
          <TabPane tab="Planet & Zodiac" key="2">
            <PlanetZodiac planet={planet} />
          </TabPane>
          <TabPane tab="Planet & House" key={3}>
            <PlanetHouse planet={planet} />
          </TabPane>
          <TabPane tab="Aspect" key={4}>
            <Aspect planet={planet} />
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};

export default DetailPlanet;
