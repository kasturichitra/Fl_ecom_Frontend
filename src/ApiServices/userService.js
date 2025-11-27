import axiosInstance from "../axios/axiosInstance";

export const storeFcmToken = (token, userId) => {
    return axiosInstance.put(`/fcm-token/${userId}`, { fcm_token: token });
};