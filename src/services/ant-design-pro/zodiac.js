import request from '@/utils/requestServer';

export const addZodiac = (body) => {
  return request.post('/api/v1/zodiacs', { data: body });
};

export const getZodiacs = async (params) => {
  return await request
    .get('/api/Zodiacs/Getallzodiacs', {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetZodiacs', error);
    });
};

export const deleteZodiac = (zodiacId) => {
  return request.delete(`/api/v1/zodiacs/${zodiacId}`);
};

export const getAnZodiac = async (zodiacId) => {
  return await request
    .get(`/api/Zodiacs/getbyid/?id=${zodiacId}`)
    .then((res) => {
      console.log('A');
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnZodiac', error);
    });
};

export const updateZodiac = async (zodiacId, body) => {
  return await request.put('/api/v1/zodiacs', {
    params: {
      id: zodiacId,
    },
    data: body,
  });
};
