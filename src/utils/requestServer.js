import { message, notification } from 'antd';
import { extend } from 'umi-request';
import { getAppToken } from './utils';
import { removeAppToken, removeUserInfo } from '@/utils/utils';

const codeMessage = {
  200: 'Thực hiện thành công.',
  201: 'Tạo thành công',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: 'There was an error in the requested request, and the server did not create or modify data.',
  401: 'The user does not have permission (token, user name, wrong password).',
  403: 'The user is authorized, but access is prohibited.',
  404: 'Resource Empty',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: 'Có lỗi xảy ra. Vui lòng thử lại',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorHandler = (error) => {
  // console.log('errorAtRequestServer', error.data);

  const { response } = error;

  return response;
};

const request = extend({
  prefix: 'https://www.psychologicalcounselingv1.somee.com',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',

    // Referer: 'strict-origin-when-cross-origin',
  },
  errorHandler,
});

request.interceptors.request.use((url, options) => {
  const jwtToken = getAppToken();
  Object.assign(options.headers, {
    Authorization: `Bearer ${jwtToken}`,
  });
  return {
    url,
    options,
  };
});

request.interceptors.response.use((response, option) => {
  const { status, url } = response;
  const { method } = option;
  switch (status) {
    case 200:
      if (method !== 'GET' && url !== 'https://stg-api.tranastro.com/api/v1/login/firebase')
        message.success(codeMessage[200]);
      break;
    case 201:
      if (method !== 'GET') message.success(codeMessage[201]);
      break;
    case 400:
      message.error(codeMessage[400]);
      break;
    case 401:
      notification.error({
        message: 'Unauthorization',
        description: 'Not Logged in. Please Loggin',
      });
      removeAppToken();
      removeUserInfo();
      location.href = '/user/login';
      break;
    case 403:
      notification.error({
        message: response.statusText,
        description: `Your request to ${response.url} was forbiden`,
      });
      break;
    case 404:
      notification.info({
        message: 'Tài nguyên trống',
      });
      break;
    case 405:
      notification.error({
        message: response.statusText,
        description: `${response.body.message}`,
      });
      break;
    default:
      break;
  }
  return response;
});
export default request;
