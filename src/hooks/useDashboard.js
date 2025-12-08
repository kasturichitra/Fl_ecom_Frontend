import { useQuery } from "@tanstack/react-query";
import { getOrdersTrend, getUsersTrend } from "../ApiServices/dashboardService";

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
