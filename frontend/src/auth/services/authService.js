import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const register = (username, email, password, role) => {
    return axios.post(API_URL + 'register', {
        username,
        email,
        password,
        role
    });
};

const login = (usernameOrEmail, password) => {
    return axios.post(API_URL + 'login', {
        usernameOrEmail,
        password
    }).then(response => {
        return response.data;
    });
};

const sendOtp = (email) => {
    return axios.post(API_URL + 'send-otp', { email });
};

const verifyOtp = (email, otp) => {
    return axios.post(API_URL + 'verify-otp', { email, otp });
};

const forgotPassword = (email) => {
    return axios.post(API_URL + 'forgot-password', { email });
};

const resetPassword = (email, otp, newPassword) => {
    return axios.post(API_URL + 'reset-password', { email, otp, newPassword });
};

const authService = {
    register,
    login,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword
};

export default authService;
