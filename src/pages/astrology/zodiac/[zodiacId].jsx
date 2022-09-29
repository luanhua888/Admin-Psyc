import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { getAnZodiac } from '@/services/ant-design-pro/zodiac';
import ShortZodiacDetail from './component/ShortZodiacDetail';
import ZodiacDetail from './component/ZodiacDetail';
import ZodiacHouse from './component/ZodiacHouse';
import ProSkeleton from '@ant-design/pro-skeleton';
import Quote from './component/Quote';
const { TabPane } = Tabs;
const DetailZodiac = (props) => {
  const {
    history: {},
    match: {
      params: { zodiacId },
    },
  } = props;

  const [zodiac, setZodiac] = useState({});
  const [loading, setLoading] = useState(true);
  const [triggerLoadZodiac, setTriggerLoadZodiac] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const zodiac = await getAnZodiac(zodiacId);
        setZodiac(zodiac?.data[0]);
      } catch (error) {
        console.log('errorLoadDetailZodiac', error);
      }
      setLoading(false);
    })();
  }, [triggerLoadZodiac]);

  const handleTriggerLoadZodiac = () => {
    setTriggerLoadZodiac(!triggerLoadZodiac);
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
        <ShortZodiacDetail zodiac={zodiac} />
        <Tabs
          defaultActiveKey="2"
          tabPosition="top"
          size="large"
          type="line"
          centered={true}
          onChange={handleChange}
          onTabClick={handleTabClick}
        >
          <TabPane tab="Detail Zodiac" key="1">
            <ZodiacDetail zodiac={zodiac} handleTriggerLoadZodiac={handleTriggerLoadZodiac} />
          </TabPane>
          <TabPane tab="Zodiac & House" key="2">
            <ZodiacHouse zodiac={zodiac} />
          </TabPane>
          {/* <TabPane tab="Quote" key="3">
                <Quote zodiac={zodiac} />
              </TabPane> */}
        </Tabs>
      </Content>
    </>
  );
};

export default DetailZodiac;
