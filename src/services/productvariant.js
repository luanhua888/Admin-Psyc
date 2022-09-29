import request from '@/utils/requestServer';

export const addProductVariant = async (body) => {
  return await request.post('/api/v1/products/variant', {
    data: body,
  });
};

export const getProductVariants = async (params) => {
  return await request
    .get('/api/v1/products/variant', {
      params: params,
    })
    .then((response) => {
      console.log('response getProductVariants', response);
      return response;
    })
    .catch((error) => {
      console.log('errorGetProductVariants', error);
    });
};

export const updateProductVariant = (productId, body) => {
  return request.put('/api/v1/products/variant', {
    params: {
      id: productId,
    },
    data: body,
  });
};
