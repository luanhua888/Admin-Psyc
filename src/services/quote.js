import request from '@/utils/requestServer';

export const addQuote = (body) => {
  return request
    .post('/api/v1/quotes', {
      data: body,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorAddQuote', error);
    });
};

export const getQuotes = async (params) => {
  return await request
    .get('/api/v1/quotes', {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetQuotes', error);
    });
};

export const deleteQuote = (quoteId) => {
  return request.delete(`/api/v1/quotes/${quoteId}`);
};

export const getAnQuote = async (quoteId) => {
  return await request
    .get(`/api/v1/quotes/${quoteId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnQuotes', error);
    });
};

export const updateQuote = async (quoteId, body) => {
  return await request.put('/api/v1/quotes', {
    params: {
      id: quoteId,
    },
    data: body,
  });
};
