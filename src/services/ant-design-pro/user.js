import request from '@/utils/requestServer';

export const getUsers = async (params) => {
  return await request
    .get('/api/v1/users', {
      params: params,
    })
    .then((response) => {
      console.log('response getUsers', response);

      return response;
    })
    .catch((error) => {
      console.log('errorGetUsers', error);
    });
};

export const addUser = (body) => {
  return request.post('/api/v1/users', { data: body });
};

export const editUser = (userId, body) => {
  return request.put('/api/v1/users', {
    params: {
      id: userId,
    },
    data: body,
  });
};
export const login = async (body) => {
  return await request.post('/api/FirebaseServices/loginadmin', {
    data: body,
  });
};
export const getCurrentUser = async () => {
  return await request.get('/api/v1/users/current');
};

export const getAnUser = async (userId) => {
  return await request
    .get(`/api/v1/users/${userId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnUser', error);
    });
};

// export const searchUser = (params) => {
//   return request
//     .get('/api/User', {
//       params: params,
//     })
// }
