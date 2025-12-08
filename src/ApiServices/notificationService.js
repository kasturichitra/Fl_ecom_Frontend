import axiosInstance from "../axios/axiosInstance";



const BASE_URL = "/notifications";

export const getNotificationApi = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""}`);
};