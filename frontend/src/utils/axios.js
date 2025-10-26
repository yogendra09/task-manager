import axios from 'axios'
import { API_URL } from '../constant/apiUrl';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    
  },
})

axiosInstance.defaults.timeout = 10000 * 6;

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
    , (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance