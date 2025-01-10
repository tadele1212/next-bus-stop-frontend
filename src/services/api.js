import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

export const busService = {
    async getStops(serviceNo) {
        const response = await axiosInstance.post('/show_stop', {
            service_no: serviceNo
        });
        return response.data.stops;
    },

    async getNearestStop(serviceNo, gx, gy, lastStop) {
        const response = await axiosInstance.post('/nearest_stop', {
            service_no: serviceNo,
            gx,
            gy,
            last_stop: lastStop
        });
        return response.data;
    }
}; 