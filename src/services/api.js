import axios from 'axios';

// Update this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://render-test-dc5j.onrender.com/api';

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

// Improved offline cache functions
const cacheResponse = async (key, data) => {
    try {
        const timestamp = new Date().getTime();
        const cacheData = {
            data,
            timestamp,
            version: '1.0'
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`Data cached for ${key}`);
    } catch (error) {
        console.error('Error caching data:', error);
    }
};

const getCachedResponse = (key) => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp, version } = JSON.parse(cached);
        
        // Cache expires after 24 hours
        const now = new Date().getTime();
        const cacheAge = now - timestamp;
        if (cacheAge > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
            return null;
        }

        console.log(`Using cached data for ${key}`);
        return data;
    } catch {
        return null;
    }
};

export const busService = {
    async getStops(serviceNo) {
        try {
            const response = await axiosInstance.post('/show_stop', {
                service_no: serviceNo
            });
            await cacheResponse(`stops-${serviceNo}`, response.data.stops);
            return response.data.stops;
        } catch (error) {
            console.log('Network error, trying cache...');
            const cachedData = getCachedResponse(`stops-${serviceNo}`);
            if (cachedData) {
                console.log('Using cached data');
                return cachedData;
            }
            throw error;
        }
    },

    async getNearestStop(serviceNo, gx, gy, lastStop) {
        const data = {
            service_no: String(serviceNo),
            gx: Number(gx),
            gy: Number(gy),
            last_stop: lastStop !== undefined ? String(lastStop) : null
        };

        try {
            const response = await axiosInstance.post('/nearest_stop', data);
            // Cache the last known position
            await cacheResponse(`last-position-${serviceNo}`, {
                gx,
                gy,
                lastStop,
                timestamp: new Date().getTime()
            });
            return response.data;
        } catch (error) {
            console.log('Network error in getNearestStop');
            throw error;
        }
    }
}; 