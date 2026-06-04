import axios from 'axios';

const api = axios.create({
    baseURL: 'http://25.0.149.144:3005',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
