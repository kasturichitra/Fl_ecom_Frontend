import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/dashboard";

export const getOrdersTrend = () => {
  return axiosInstance.get(`${BASE_URL}/orders/trend`);
};

export const getUsersTrend = () => {
  return axiosInstance.get(`${BASE_URL}/users/trend`);
};


export const getTopBrands = (params = {}) => {
  console.log(params,"params.... top brands")
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/topbrands${queryString ? `?${queryString}` : ""}`);
};
