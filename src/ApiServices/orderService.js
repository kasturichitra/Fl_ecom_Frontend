import axiosInstance from "../axios/axiosInstance";
const BASE_URL = "/orders"; 


export const getAllOrdersApi = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`${BASE_URL}/search${queryString ? `?${queryString}` : ""} `);
};  




