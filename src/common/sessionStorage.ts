export const getEnvFromStorage = () => {
  return window.sessionStorage.getItem('env');
};

export const setEnvFromStorage = (env: string) => {
  return window.sessionStorage.setItem('env', env);
};
