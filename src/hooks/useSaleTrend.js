import { useQuery } from "@tanstack/react-query";
import { getSaleTrends } from "../ApiServices/saleTrendService";

export const useGetAllSaleTrends = ({ searchTerm = "", page = 1, limit = 10, sort = "" }) => {
  const queryKey = ["brands", searchTerm || "", page, limit, sort];

  return useQuery({
    queryKey,
    queryFn: () => getSaleTrends({ searchTerm, page, limit, sort }),
    select: (res) => res?.data, 
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};