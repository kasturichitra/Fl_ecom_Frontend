import axiosInstance from "../axios/axiosInstance";



const BASE_URL = "/notifications";

export const getNotificationApi = () => {
    // http://{{IP}}:3000/notifications?role=Admin
    const data = { role: "Admin" };
    const queryString = new URLSearchParams(data).toString();
    return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""}`);
};