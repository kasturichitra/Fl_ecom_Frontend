import { useQuery } from "@tanstack/react-query";
import { getOrdersTrend } from "../ApiServices/dashboardService";

export const useGetOrdersTrend = () => {
  return useQuery({
    queryKey: ["orders-trend"],
    queryFn: () => getOrdersTrend(),
    select: (res) => res?.data?.data,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
