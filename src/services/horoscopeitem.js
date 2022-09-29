import request from '@/utils/requestServer';

export const addHoroscopeItem = (body) => {
  return request.post('/api/v1/horoscopeitems', { data: body });
};

export const getHoroscopeItems = async (params) => {
  return await request
    .get('/api/v1/horoscopeitems', {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetHoroscopeItems', error);
    });
};

export const deleteHoroscopeItems = (horoscopeItemId) => {
  return request.delete(`/api/v1/horoscopeitems/${horoscopeItemId}`);
};

export const getAnHoroscopeItem = async (horoscopeItemId) => {
  return await request
    .get(`/api/v1/horoscopeitems/${horoscopeItemId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnHoroItem', error);
    });
};

export const updateHoroscopeItem = async (horoscopeItemId, body) => {
  return await request.put('/api/v1/horoscopeitems', {
    params: {
      id: horoscopeItemId,
    },
    data: body,
  });
};
