import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const api = {
    auth: {
        login: (data) => {
            return axiosInstance.post('/api/signin', data);
        },
        signup: (data) => {
            return axiosInstance.post('/api/signup', data);
        },
    }
}

export default api;