import { addQuote, getQuotes } from '@/services/quote';
import ProForm, { ProFormTextArea } from '@ant-design/pro-form';
import { Button, Col, List, message, Row, Space, Tag } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useRef, useState } from 'react';

const Quote = (props) => {
  const { zodiac } = props;
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
  }, [triggerRenderListQuote]);

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

  return (
    <Content
      style={{
        background: '#fff',
        padding: 16,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProForm
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
                      Submit
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
        <Col span={12}>
          <List
            dataSource={listQuote}
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
          ></List>
        </Col>
      </Row>
    </Content>
  );
};

export default Quote;
