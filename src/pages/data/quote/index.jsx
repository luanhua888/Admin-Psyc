import ListZodiac from '@/components/ListZodiac/ListZodiac';
import Zodiac from '@/components/ZodiacCard/Zodiac';
import { getZodiacs } from '@/services/ant-design-pro/zodiac';
import { addQuote, getQuotes } from '@/services/quote';
import ProForm, { ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Col, List, Row, Skeleton } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useRef, useState } from 'react';
import styles from './reponsive.less';

const Quote = () => {
  //loading zodiac
  const [loadingZodiac, setLoadingZodiac] = useState(false);
  //list data zodiac
  const [dataList, setDataList] = useState([]);
  //zodiac selected
  //state giu zodiac nao dang dc chon
  const [zodiac, setZodiac] = useState({});
  const formQuoteRef = useRef();
  const [loadingButtonSubmit, setLoadingButtonSubmit] = useState(false);
  const [triggerRenderListQuote, setTriggerRenderListQuote] = useState(false);
  const [listQuote, setListQuote] = useState([]);
  const [loadingListQuote, setLoadingListQuote] = useState(false);
  //paging
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(4);
  const [total, setTotal] = React.useState(20);
  useEffect(() => {
    (async () => {
      setLoadingZodiac(true);
      const listZodiac = await getZodiacs();
      if (listZodiac?.payload) {
        const listDataSrc = [];
        listZodiac?.payload?.map((item) => {
          const zodiac = {};
          zodiac.id = item?.id;
          zodiac.avatar = item?.icon;
          zodiac.name = item?.name;
          zodiac.title = item?.name;
          zodiac.selected = false;
          listDataSrc.push(zodiac);
        });
        listDataSrc[0].selected = true;
        setZodiac(listDataSrc[0]);
        setDataList(listDataSrc);
      }
      setLoadingZodiac(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const params = {
        zodiacId: zodiac?.id,
        page: page,
        pageSize: pageSize,
      };
      setLoadingListQuote(false);
      const data = await getQuotes(params);
      if (data?.payload) {
        setListQuote(data?.payload);
        setTotal(data?.total);
      }
      setLoadingListQuote(false);
    })();
  }, [triggerRenderListQuote, zodiac]);

  const handleButtonReset = () => {
    formQuoteRef?.current?.resetFields();
  };

  const handleButtonSubmit = (value) => {
    if (value) {
      value.form?.submit();
    }
  };

  const handleSubmitForm = async (values) => {
    values.zodiacId = zodiac?.id;
    setLoadingButtonSubmit(true);
    const result = await addQuote(values);
    if (result?.id) {
      setTriggerRenderListQuote(!triggerRenderListQuote);
      formQuoteRef?.current?.resetFields();
    }
    setLoadingButtonSubmit(false);
  };

  const onChangePaging = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    setTriggerRenderListQuote(!triggerRenderListQuote);
  };

  const handleClickCard = (item) => {
    const updateList = dataList.map((el) => {
      if (el.id === item.id) {
        el.selected = true;
      } else {
        el.selected = false;
      }
      return el;
    });
    setDataList(updateList);
    setZodiac(item);
  };
  return (
    <PageContainer>
      <Content className={styles.content}>
        <Row gutter={[16, 16]}>
          <Col
            xxl={4}
            xl={6}
            lg={8}
            md={10}
            sm={6}
            style={{
              height: '80vh',
              overflow: 'scroll',
              overflowX: 'hidden',
            }}
          >
            {loadingZodiac ? (
              <Skeleton avatar={true} title={true} paragraph={false} />
            ) : (
              <ListZodiac zodiacList={dataList} span={24} handleClickCard={handleClickCard} />
            )}
          </Col>
          <Col
            xxl={20}
            xl={18}
            lg={16}
            md={14}
            sm={18}
            style={{
              background: '#fff',
            }}
          >
            <Row gutter={[16, 16]} className={styles.boxContent}>
              <Col xxl={12} xl={12} lg={24}>
                <ProForm
                  className={styles.form}
                  onReset={true}
                  formRef={formQuoteRef}
                  submitter={{
                    render: (props, doms) => {
                      return [
                        <div>
                          <Button
                            key="buttonResetQuote"
                            type="default"
                            onClick={() => handleButtonReset(props)}
                          >
                            Reset
                          </Button>
                          <Button
                            key="buttonSubmitQuote"
                            type="primary"
                            onClick={() => handleButtonSubmit(props)}
                            loading={loadingButtonSubmit}
                          >
                            Thêm Quote
                          </Button>
                        </div>,
                      ];
                    },
                  }}
                  onFinish={async (values) => await handleSubmitForm(values)}
                >
                  <ProForm.Group>
                    <ProFormTextArea
                      key="addnewquote"
                      label="Quote"
                      width="lg"
                      placeholder="Enter quote"
                      name="content"
                      rules={[
                        {
                          required: true,
                          message: 'Enter Quote before submit!',
                        },
                      ]}
                    />
                  </ProForm.Group>
                </ProForm>
              </Col>
              <Col xxl={12} xl={12} lg={24}>
                <List
                  dataSource={listQuote}
                  bordered={true}
                  className={styles.boxList}
                  pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    onChange: (page, pageSize) => onChangePaging(page, pageSize),
                  }}
                  renderItem={(item) => (
                    <List.Item key={item?.id}>
                      <List.Item.Meta title={item?.content} />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </PageContainer>
  );
};

export default Quote;
