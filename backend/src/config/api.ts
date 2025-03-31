import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sale-point-system.vercel.app',
});

export default api;
