export const getLocalStorage = (name) => localStorage.getItem(name);
export const removeLocalStorage = (key) => localStorage.removeItem(key);
export const setLocalStorage = (name, value) => {
  localStorage.setItem(name, value);
};
// localStorage user
export const setUserInfo = (userInfo) => setLocalStorage('USER_INFO', JSON.stringify(userInfo));
export const getUserInfo = () => getLocalStorage('USER_INFO');
export const removeUserInfo = () => localStorage.removeItem('USER_INFO');
// localStorage token
export const removeAppToken = (token) => localStorage.removeItem('APP_TOKEN');
export const setAppToken = (token) => setLocalStorage('APP_TOKEN', token);
export const getAppToken = () => getLocalStorage('APP_TOKEN');
