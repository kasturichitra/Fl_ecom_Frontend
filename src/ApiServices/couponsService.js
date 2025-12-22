import axiosInstance from "../axios/axiosInstance"

const BASE_URL = "/coupons"

export const getCoupons = (params) => {
    return axiosInstance.get(BASE_URL, { params })
}


export const getCouponCode = () => {
    return axiosInstance.get(`${BASE_URL}/generate-code`)
}


export const createCoupon = (couponData) => {
    return axiosInstance.post(`${BASE_URL}/create`, couponData)
}


export const updateCoupon = (id, couponData) => {
    return axiosInstance.put(`${BASE_URL}/update/${id}`, couponData)
}

export const getCouponById = (id) => {
    return axiosInstance.get(`${BASE_URL}/${id}`)
}

export const deleteCoupon = (id) => {
    return axiosInstance.delete(`${BASE_URL}/delete/${id}`)
}
