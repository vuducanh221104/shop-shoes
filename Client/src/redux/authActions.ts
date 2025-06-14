import { 
    loginStart, 
    loginSuccess, 
    loginFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    updateAccessToken
} from './authSlice';
import { login as userLogin, logout as userLogout, register as userRegister, refreshUserToken } from '../services/authService';
import { Dispatch } from '@reduxjs/toolkit';

export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(loginStart());
    try {
        const response = await userLogin(email, password);
        // Lưu token vào localStorage
        localStorage.setItem('accessToken', response.AccessToken);
        localStorage.setItem('refreshToken', response.RefreshToken);
        dispatch(loginSuccess(response));
        return response;
    } catch (error) {
        dispatch(loginFailed());
        throw error;
    }
};

export const register = (username: string | null, email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(loginStart());
    try {
        // If no username is provided, it will be generated from email in the service
        const response = await userRegister(username || '', email, password);
        // Lưu token vào localStorage
        localStorage.setItem('accessToken', response.AccessToken);
        localStorage.setItem('refreshToken', response.RefreshToken);
        dispatch(loginSuccess(response));
        return response;
    } catch (error) {
        dispatch(loginFailed());
        throw error;
    }
};

// Register without auto-login
export const registerOnly = (username: string | null, email: string, password: string) => async (dispatch: Dispatch) => {
    try {
        // Just register without logging in
        const response = await userRegister(username || '', email, password);
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout = () => async (dispatch: Dispatch) => {
    dispatch(logOutStart());
    try {
        // Xóa tất cả localStorage liên quan đến user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Các localStorage khác liên quan đến user nếu có
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('user') || key === 'cart') {
                localStorage.removeItem(key);
            }
        });

        dispatch(logOutSuccess());
    } catch (error) {
        dispatch(logOutFailed());
        throw error;
    }
};

export const refresh = (token: string) => async (dispatch: Dispatch) => {
    try {
        const response = await refreshUserToken(token);
        // Cập nhật token mới
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        dispatch(updateAccessToken(response.accessToken));
        return response;
    } catch (error) {
        // Nếu refresh token không hợp lệ, đăng xuất
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(logOutSuccess());
        throw error;
    }
}; 