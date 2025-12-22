import { useQuery } from "@tanstack/react-query";
import {
  getOrdersTrend,
  getUsersTrend,
  getOrdersStatus,
  getOrdersByPaymentMethod,
  getOrdersType,
  getTopBrands,
  getTopProducts,
} from "../ApiServices/dashboardService";

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

export const useGetOrdersByStatus = ({ from = "", to = "" }) => {
  return useQuery({
    queryKey: ["orders-status", from, to],
    queryFn: () => getOrdersStatus({ from, to }),
    select: (res) => res?.data?.data,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
  });
};

export const useGetOrdersByPaymentMethod = ({ from = "", to = "" }) => {
  return useQuery({
    queryKey: ["orders-by-payment-method", from, to],
    queryFn: () => getOrdersByPaymentMethod({ from, to }),
    select: (res) => res?.data?.data,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
  });
};

export const useGetOrdersByType = ({ from = "", to = "" }) => {
  return useQuery({
    queryKey: ["orders-by-type", from, to],
    queryFn: () => getOrdersType({ from, to }),
    select: (res) => res?.data?.data,
    staleTime: 60 * 1000,
    cacheTime: 60 * 1000,
  });
};

export const useGetTopBrands = ({ category_unique_id = "", from = "", to = ""  }) => {
  return useQuery({
    queryKey: ["top-brands", category_unique_id, from, to],
    queryFn: () => getTopBrands({ category_unique_id, from, to }),
    select: (res) => res?.data?.data,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useGetTopProducts = ({ category_unique_id = "",from = "", to = ""  }) => {
  return useQuery({
    queryKey: ["top-products", category_unique_id, from, to],
    queryFn: () => getTopProducts({ category_unique_id, from, to }),
    select: (res) => res?.data?.data,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
