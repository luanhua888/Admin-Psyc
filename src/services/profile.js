import request from '@/utils/requestServer';

export const addProfile = (body) => {
  return request.post('/api/v1/profiles', { data: body });
};

export const getProfiles = async (params) => {
  return await request
    .get('/api/v1/profiles', {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetProfiles', error);
    });
};

export const deleteProfile = (profileId) => {
  return request.delete(`/api/v1/profiles/${profileId}`);
};

export const getAnProfile = async (profileId) => {
  return await request
    .get(`/api/v1/profiles/${profileId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnProfile', error);
    });
};

export const updateProfile = async (profileId, body) => {
  return await request.put('/api/v1/profiles', {
    params: {
      id: profileId,
    },
    data: body,
  });
};
