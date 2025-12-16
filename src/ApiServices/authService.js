import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/auth";

export const register = (formData) => {
  return axiosInstance.post(`${BASE_URL}/register`, formData);
};

export const verifyOtp = (formData) => {
  return axiosInstance.post(`${BASE_URL}/verify-otp`, formData);
};

export const resendOtp = (data) => {
  return axiosInstance.post(`${BASE_URL}/resend-otp`, data);
};
