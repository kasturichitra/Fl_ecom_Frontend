import axiosInstance from "../axios/axiosInstance";
const BASE_URL = "/user";

export const storeFcmToken = (token, userId) => {
  return axiosInstance.put(`/fcm-token/${userId}`, { fcm_token: token });
};

export const getAllUsers = () => {
  return axiosInstance.get(`${BASE_URL}`);
};

export const createUser = (data) => {
  console.log("createUser", data);
  return axiosInstance.post(`/employe`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
