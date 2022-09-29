import request from '@/utils/requestServer';

export const getPlanetHouses = async (planetName, planetId, params) => {
  return await request
    .get(`/api/v1/planets/${planetName}-${planetId}/houses`, {
      params: params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('errorGetPlanetHouse', error);
    });
};

export const addPlanetHouse = (planetName, planetId, body) => {
  return request.post(`/api/v1/planets/${planetName}-${planetId}/houses`, {
    data: body,
  });
};

export const updatePlanetHouse = async (planetName, planetId, planetHouseId, body) => {
  return await request.put(`/api/v1/planets/${planetName}-${planetId}/houses`, {
    params: {
      id: planetHouseId,
    },
    data: body,
  });
};

export const getAnPlanetHouse = async (planetName, planetId, planetHouseId) => {
  return await request
    .get(`/api/v1/planets/${planetName}-${planetId}/houses/${planetHouseId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log('errorGetAnPlanetHouse', error);
    });
};
