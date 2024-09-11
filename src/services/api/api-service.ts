// api-service.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Create an instance of axios with default settings
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Base URL of your API, stored in environment variables
    timeout: 30000, // Request timeout in milliseconds
});

// Intercept requests to add auth token if needed
apiClient.interceptors.request.use(
    (config: any) => {
        toast.loading('Loading...');

        const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        toast.error('Request error!');
        return Promise.reject(error);
    }
);

// Intercept responses to handle errors globally
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        toast.dismiss();

        if (response.data.isSuccess) {
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
        return response;
    },
    (error: any) => {
        toast.dismiss();


        if (error.response)
            toast.error(`Error: ${error.response.data.message || 'An error occurred!'}`);
        else
            toast.error('Network error or server not reachable!');

        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, redirecting to login...');
            localStorage.clear();
        }
        return Promise.reject(error);
    }
);

// API Service Methods

export const get = async <T>(url: string, params?: any): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await apiClient.get(url, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const post = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await apiClient.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const put = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await apiClient.put(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await apiClient.delete(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient;
