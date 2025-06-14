import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const adminLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/admin/login`, { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data);
        }
        throw new Error('Network error');
    }
};

export const adminLogout = async (token: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`, { token });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data);
        }
        throw new Error('Network error');
    }
};

export const refreshToken = async (token: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/refreshToken`, { token });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data);
        }
        throw new Error('Network error');
    }
}; 