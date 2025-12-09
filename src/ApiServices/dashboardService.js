import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/dashboard";

export const getOrdersTrend = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/orders/trend${queryString ? `?${queryString}` : ""}`);
};

export const getUsersTrend = () => {
  return axiosInstance.get(`${BASE_URL}/users/trend`);
};


export const getTopBrands = (params = {}) => {
  console.log(params,"params.... top brands")
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/topbrands${queryString ? `?${queryString}` : ""}`);
};
