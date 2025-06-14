import { createSlice } from '@reduxjs/toolkit';

interface AdminAuthState {
    login: {
        currentAdmin: any; // Sử dụng any cho đơn giản, trong thực tế nên định nghĩa interface Admin
        isFetching: boolean;
        error: boolean;
    };
    logout: {
        isFetching?: boolean;
        error?: boolean;
    };
}

const initialState: AdminAuthState = {
        login: {
            currentAdmin: null,
            isFetching: false,
            error: false,
        },
        logout: {},
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        // Login
        adminLoginStart: (state) => {
            state.login.isFetching = true;
            state.login.error = false;
        },
        adminLoginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentAdmin = action.payload;
            state.login.error = false;
        },
        adminLoginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        // Logout
        adminLogOutStart: (state) => {
            state.logout.isFetching = true;
            state.logout.error = false;
        },
        adminLogOutSuccess: (state) => {
            state.login.currentAdmin = null;
            state.logout.isFetching = false;
            state.logout.error = false;
        },
        adminLogOutFailed: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },

        // Update access token
        updateAdminAccessToken: (state, action) => {
            if (state.login.currentAdmin) {
                state.login.currentAdmin.AccessToken = action.payload;
            }
        },
    },
});

export const {
    adminLoginStart,
    adminLoginSuccess,
    adminLoginFailed,
    adminLogOutStart,
    adminLogOutSuccess,
    adminLogOutFailed,
    updateAdminAccessToken,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
