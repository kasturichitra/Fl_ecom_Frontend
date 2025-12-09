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
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/topbrands${queryString ? `?${queryString}` : ""}`);
};

export const getTopProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/topproducts${queryString ? `?${queryString}` : ""}`);
}


export const getOrdersStatus = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/orders/status${queryString ? `?${queryString}` : ""}`);
};


export const getOrdersByPaymentMethod = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/orders/payment-method${queryString ? `?${queryString}` : ""}`);
}

export const getOrdersType = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/orders/order-type${queryString ? `?${queryString}` : ""}`);
}