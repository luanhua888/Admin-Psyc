import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, Row, Skeleton } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import ProSkeleton from '@ant-design/pro-skeleton';

const Dashboard = () => {
  return (
    <PageContainer>
      <Content>
        <Row gutter={16}>
          <Col span={8}>
            <Skeleton />
          </Col>
          <Col span={8}>
            <Skeleton />
          </Col>
          <Col span={8}>
            <Skeleton />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <ProSkeleton statistic={false} />
          </Col>
          <Col span={8}>
            <ProSkeleton statistic={false} />
          </Col>
        </Row>
      </Content>
    </PageContainer>
  );
};

export default Dashboard;
