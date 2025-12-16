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

