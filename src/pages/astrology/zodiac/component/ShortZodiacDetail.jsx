import { PageContainer } from '@ant-design/pro-layout';
import { Button, Image, message, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import style from './zodiacdetail.less';
import { Content } from 'antd/lib/layout/layout';
import dayjs from 'dayjs';

const ShortZodiacDetail = (props) => {
  const { zodiac } = props;

  const safeDescription = DOMPurify.sanitize(zodiac.descriptionShort);

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
          <Title className={style.title}>{zodiac?.name}</Title>
        </div>
        <Title
          level={4}
          style={{
            paddingBottom: '8px',
          }}
        >
          {zodiac.id
            ? `(${dayjs(zodiac?.dateStart).format('DD/MM')})-(${dayjs(zodiac?.endDate).format(
                'DD/MM',
              )})`
            : ''}
        </Title>

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
              width={150}
              src={zodiac?.imageUrl}
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

export default ShortZodiacDetail;
