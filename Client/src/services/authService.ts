import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data);
        }
        throw new Error('Network error');
    }
};

export const register = async (username: string, email: string, password: string) => {
    try {
        // If username is not provided, generate it from email
        const actualUsername = username || email.split('@')[0];
        
        const response = await axios.post(`${API_URL}/auth/register`, { 
            username: actualUsername, 
            email, 
            password 
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data);
        }
        throw new Error('Network error');
    }
};

export const logout = async (token: string) => {
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

export const refreshUserToken = async (token: string) => {
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