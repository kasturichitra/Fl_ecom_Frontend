import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/dashboard";

export const getOrdersTrend = () => {
  return axiosInstance.get(`${BASE_URL}/orders/trend`);
};

export const getUsersTrend = () => {
  return axiosInstance.get(`${BASE_URL}/users/trend`);
};