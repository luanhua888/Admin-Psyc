import request from '@/utils/requestServer';

export const addProductMaster = async (body) => {
  return await request.post('/api/v1/products/master', { data: body });
};

export const getProductMasters = async (params) => {
  return await request
    .get('/api/v1/products/master', {
      params: params,
    })
    .then((response) => {
      console.log('response getProductMasters', response);

      return response;
    })
    .catch((error) => {
      console.log('errorGetProductMasters', error);
    });
};

export const deleteProductMaster = (productId) => {
  request.delete('/api/v1/products', {
    params: {
      id: productId,
    },
  });
};
export const updateProductMaster = (productId, body) => {
  return request.put('/api/v1/products/master', {
    params: {
      id: productId,
    },
    data: body,
  });
};

export const getProductMaster = async (productId) => {
  return await request
    .get('/api/v1/products/master', {
      params: {
        id: productId,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
};
