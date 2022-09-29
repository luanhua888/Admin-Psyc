import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image, message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import style from './planetdetail.less';
import { Content } from 'antd/lib/layout/layout';

const ShortPlanetDetail = (props) => {
  const { planet } = props;

  const safeDescription = DOMPurify.sanitize(planet.decription);

  return (
    <>
      <Content
        className={style.site_layout_background}
        style={{
          padding: '40px 50px',
          boxShadow: '-1px 0px 12px -2px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Title className={style.title}>{planet?.name}</Title>
        </div>
        <Title
          level={4}
          style={{
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          {planet?.title}
        </Title>
        {planet?.tag?.split('-').map((item, index) => {
          if (index % 2 === 0 && index <= 5) {
            return <Tag color="blue">{item}</Tag>;
          }
          if (index % 2 !== 0 && index <= 5) {
            return <Tag color="green">{item}</Tag>;
          }
          return <Tag color="pink">{item}</Tag>;
        })}
        <div
          style={{
            margin: '12px 0px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: '30%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              width={200}
              src={planet?.icon}
              preview={false}
              style={{
                marginRight: '16px',
              }}
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: safeDescription }}
            style={{
              width: '70%',
            }}
          />
        </div>
      </Content>
    </>
  );
};

export default ShortPlanetDetail;
