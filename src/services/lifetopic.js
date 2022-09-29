import request from '@/utils/requestServer';

export const addTopic = (body) => {
  return request.post('/api/v1/topics', {
    data: body,
  });
};

export const getTopics = async (params) => {
  return await request
    .get('/api/v1/topics', {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetTopics', error);
    });
};

export const deleteTopic = (topicId) => {
  return request.delete(`/api/v1/topics/${topicId}`);
};

export const getAnTopic = async (topicId) => {
  return await request
    .get(`/api/v1/topics/${topicId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnTopic', error);
    });
};

export const updateTopic = async (topicId, body) => {
  return await request.put('/api/v1/topics', {
    params: {
      id: topicId,
    },
    data: body,
  });
};
