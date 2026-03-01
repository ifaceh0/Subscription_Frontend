import axios from 'axios';
import { useLocation } from '../contexts/LocationContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use(config => {
  try {
    const { countryCode } = useLocation();
    config.headers['X-User-Location'] = countryCode;
  } catch (e) {
    config.headers['X-User-Location'] = localStorage.getItem('countryCode') || 'US';
  }
  return config;
});

export default api;