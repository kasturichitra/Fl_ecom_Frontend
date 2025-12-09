import { useQuery } from "@tanstack/react-query";
import { getOrdersTrend, getUsersTrend, getOrdersStatus, getOrdersByPaymentMethod, getOrdersType } from "../ApiServices/dashboardService";

export const useGetOrdersTrend = ({ year = "2025" } = {}) => {
  return useQuery({
    queryKey: ["orders-trend", year],
    queryFn: () => getOrdersTrend({ year }),
    select: (res) => res?.data?.data,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
  });
};

export const useGetUsersTrend = ({ year = "2025" } = {}) => {
  return useQuery({
    queryKey: ["users-trend", year],
    queryFn: () => getUsersTrend({ year }),
    select: (res) => res?.data?.data,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
  });
};

export const useGetOrdersStatus = ({ year = "2025" } = {}) => {
  return useQuery({
    queryKey: ["orders-status", year],
    queryFn: () => getOrdersStatus({ year }), 
    select: (res) => res?.data?.data,
    staleTime: 60 * 1000, 
    cacheTime: 60 * 1000, 
  }); 
};

export const useGetOrdersByPaymentMethod = ({ year = "2025" } = {}) => {
  return useQuery({
    queryKey: ["orders-by-payment-method", year],
    queryFn: () => getOrdersByPaymentMethod({ year }), 
    select: (res) => res?.data?.data, 
    staleTime: 60 * 1000, 
    cacheTime: 60 * 1000, 
  }); 
};

export const useGetOrdersByType = ({ year = "2025" } = {}) => {
  return useQuery({
    queryKey: ["orders-by-type", year],
    queryFn: () => getOrdersType({ year }), 
    select: (res) => res?.data?.data, 
    staleTime: 60 * 1000, 
    cacheTime: 60 * 1000, 
  }); 
};