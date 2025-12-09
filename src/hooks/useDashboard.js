import { useQuery } from "@tanstack/react-query";
import { getOrdersTrend, getTopBrands } from "../ApiServices/dashboardService";

export const useGetOrdersTrend = () => {
  return useQuery({
    queryKey: ["orders-trend"],
    queryFn: () => getOrdersTrend(),
    select: (res) => res?.data?.data,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useGetUsersTrend = () => {
  return useQuery({
    queryKey: ["users-trend"],
    queryFn: () => getOrdersTrend(),
    select: (res) => res?.data?.data,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
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
