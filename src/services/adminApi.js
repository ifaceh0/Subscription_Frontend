import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/admin';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getCountries = async () => {
  const res = await adminApi.get('/api/admin/getCountries');
  return res.data;
};

export const createCountry = async (data) => {
  const res = await adminApi.post('/api/admin/saveCountries', data);
  return res.data;
};

export const updateCountry = async (countryCode, data) => {
  const res = await adminApi.put('/api/admin/updateCountries', data, {
    params: { countryCode },
  });
  return res.data;
};

export const deleteCountry = async (countryCode) => {
  await adminApi.delete('/api/admin/deleteCountries', {
    params: { countryCode },
  });
};

export const getDiscounts = async () => {
  const res = await adminApi.get('/api/admin/getDiscounts');
  return res.data;
};

export const assignDiscount = async (data) => {
  const res = await adminApi.post('/api/admin/saveDiscounts', data);
  return res.data;
};

export const removeDiscount = async (email) => {
  await adminApi.delete('/api/admin/deleteDiscounts', {
    params: { email },
  });
};


export default adminApi;