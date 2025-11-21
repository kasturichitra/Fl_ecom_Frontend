import { useQuery } from "@tanstack/react-query";
import { getAllIndustryApi } from "../ApiServices/industryService";

export const useGetAllIndustries = ({ search = "", page = 1, limit = 10 }) => {
  const queryKey = ["industries", search || "", page, limit];

  return useQuery({
    queryKey,
    queryFn: () => getAllIndustryApi({ search, page, limit }),
    select: (res) => res.data.data,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};
