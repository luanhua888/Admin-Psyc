import request from '@/utils/requestServer';

export const getZodiacHouses = async (zodiacName, zodiacId, params) => {
  return await request
    .get(`/api/v1/zodiacs/${zodiacName}-${zodiacId}/houses`, {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetZodiacHouses', error);
    });
};

export const addZodiacHouse = (zodiacName, zodiacId, body) => {
  return request.post(`/api/v1/zodiacs/${zodiacName}-${zodiacId}/houses`, {
    data: body,
  });
};

export const updateZodiacHouse = async (zodiacName, zodiacId, zodiacHouseId, body) => {
  return await request.put(`/api/v1/zodiacs/${zodiacName}-${zodiacId}/houses`, {
    params: {
      id: zodiacHouseId,
    },
    data: body,
  });
};

export const getAnZodiacHouse = async (zodiacName, zodiacId, zodiacHouseId) => {
  return await request
    .get(`/api/v1/zodiacs/${zodiacName}-${zodiacId}/houses/${zodiacHouseId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnZodiacHouse', error);
    });
};
