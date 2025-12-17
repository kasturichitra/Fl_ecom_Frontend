import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/auth";

export const register = (formData) => {
  return axiosInstance.post(`${BASE_URL}/register`, formData);
};

export const login = (formData) => {
    return axiosInstance.post(`${BASE_URL}/login`, formData);
}

export const verifyOtp = (formData) => {
  return axiosInstance.post(`${BASE_URL}/verify-otp`, formData);
};

// 'http://localhost:3000/auth/forgot-password' 

export const forgotPassword = (formData) => {
  return axiosInstance.post(`${BASE_URL}/forgot-password`, formData);
};


export const verifyForgotOtp = (formData) => {
  return axiosInstance.post(`${BASE_URL}/verify-forgot-otp`, formData);
};


export const resetPassword = (formData) => {
  return axiosInstance.post(`${BASE_URL}/reset-password`, formData);
};
export const resendOtp = (data) => {
  return axiosInstance.post(`${BASE_URL}/resend-otp`, data);
};

export const authGetMe = () => {
  return axiosInstance.get(`${BASE_URL}/me`);
};