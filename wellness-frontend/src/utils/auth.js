export const saveTokens = ({ access, refresh }) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
};

export const removeTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export const saveUsername = (username) => {
  localStorage.setItem('username', username);
};

export const removeUsername = () => {
  localStorage.removeItem('username');
};

export const getUsername = () => {
  return localStorage.getItem('username');
};

export const isAuthenticated = () => {

  return !!localStorage.getItem('access');
};
