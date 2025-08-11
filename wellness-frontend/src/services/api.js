import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(config => {
  const access = localStorage.getItem('access');
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

  
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
   
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(error);
      }

      if (isRefreshing) {

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE}/token/refresh/`, { refresh });

        const newAccess = response.data.access;
        localStorage.setItem('access', newAccess);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = 'Bearer ' + newAccess;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
