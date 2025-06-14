import { 
    adminLoginStart, 
    adminLoginSuccess, 
    adminLoginFailed,
    adminLogOutStart,
    adminLogOutSuccess,
    adminLogOutFailed,
    updateAdminAccessToken
} from './adminAuthSlice';
import { adminLogin, adminLogout, refreshToken } from '../services/adminAuthService';
import { Dispatch } from '@reduxjs/toolkit';

export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(adminLoginStart());
    try {
        const response = await adminLogin(email, password);
        // Lưu token vào localStorage
        localStorage.setItem('adminAccessToken', response.AccessToken);
        localStorage.setItem('adminRefreshToken', response.RefreshToken);
        dispatch(adminLoginSuccess(response));
        return response;
    } catch (error) {
        dispatch(adminLoginFailed());
        throw error;
    }
};

export const logout = () => async (dispatch: Dispatch) => {
    dispatch(adminLogOutStart());
    try {
        // Xóa tất cả cookies liên quan đến admin
        document.cookie.split(";").forEach(cookie => {
            const [name] = cookie.trim().split("=");
            if (name.startsWith("admin")) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        });

        // Xóa tất cả localStorage liên quan đến admin
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        
        // Các localStorage khác liên quan đến admin nếu có
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('admin')) {
                localStorage.removeItem(key);
            }
        });

        dispatch(adminLogOutSuccess());
    } catch (error) {
        dispatch(adminLogOutFailed());
        throw error;
    }
};

export const refresh = (token: string) => async (dispatch: Dispatch) => {
    try {
        const response = await refreshToken(token);
        // Cập nhật token mới
        localStorage.setItem('adminAccessToken', response.accessToken);
        localStorage.setItem('adminRefreshToken', response.refreshToken);
        dispatch(updateAdminAccessToken(response.accessToken));
        return response;
    } catch (error) {
        // Nếu refresh token không hợp lệ, đăng xuất
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        dispatch(adminLogOutSuccess());
        throw error;
    }
}; 