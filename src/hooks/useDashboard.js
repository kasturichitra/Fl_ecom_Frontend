import { useQuery } from "@tanstack/react-query";
import { getOrdersTrend, getTopBrands, getUsersTrend } from "../ApiServices/dashboardService";

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



export const useGetTopBrands = ({ category_unique_id = "" }) => {
  return useQuery({
    queryKey: ["top-brands", category_unique_id],
    queryFn: () => getTopBrands({ category_unique_id }),
    select: (res) => res?.data?.data,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
