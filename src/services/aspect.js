import request from '@/utils/requestServer';

export const addAspect = async (body) => {
  return await request
    .post('/api/v1/aspects', { data: body })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorAddAspect', error);
    });
};

export const getAspects = async (params) => {
  return await request
    .get('/api/v1/aspects', {
      params: params,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAspects', error);
    });
};

export const deleteAspect = (aspectId) => {
  return request.delete(`/api/v1/aspects/${aspectId}`);
};

export const getAnAspect = async (aspectId) => {
  return await request
    .get(`/api/v1/aspects/${aspectId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnAspect', error);
    });
};

export const updateAspect = (aspectId, body) => {
  return request.put('/api/v1/aspects', {
    params: {
      id: aspectId,
    },
    data: body,
  });
};
