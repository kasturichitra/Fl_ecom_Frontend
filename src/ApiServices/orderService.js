import axiosInstance from "../axios/axiosInstance";
const BASE_URL = "/orders";


export const getAllOrdersApi = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`${BASE_URL}/search${queryString ? `?${queryString}` : ""} `);
};

export const getOrderProductsByIdApi = (orderId) => {
    return axiosInstance.get(`${BASE_URL}/${orderId}`);
}


export const createOrderApi = (data) => {
    // console.log("formData", formData);
    return axiosInstance.post(`${BASE_URL}`, data);
}


