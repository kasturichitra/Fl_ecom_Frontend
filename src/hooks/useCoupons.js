import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoupons, getCouponCode, createCoupon, updateCoupon } from "../ApiServices/couponsService.js";



export const useGetAllCoupons = (params) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["coupons", params],
        queryFn: () => getCoupons(params),
        select: (res) => res.data,
    });
}


export const useGenarateCouponCode = () => {
    return useQuery({
        queryKey: ["coupon-code"],
        queryFn: getCouponCode,
        select: (res) => res.data,
        enabled: false,
    });
}


export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (couponData) => createCoupon(couponData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}


export const useUpdateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, couponData }) => updateCoupon(id, couponData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}