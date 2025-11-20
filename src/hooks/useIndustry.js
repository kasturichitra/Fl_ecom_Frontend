import { useQuery } from "@tanstack/react-query";
import { getAllIndustryApi } from "../ApiServices/industryService";

export const useGetAllIndustries = ({ search }) => {
  return useQuery({
    queryKey: ["industries", search],
    queryFn: () =>
      getAllIndustryApi({
        search,
      }),
    select: (res) => res.data.data,
    // staleTime: 60 * 1000, // 1 minute
    onSuccess: (industries) => {
      // Direct Zustand update without component, without useEffect
      console.log("useGetAllIndustries", industries);
      useIndustryStore.getState().setAllIndustries(industries);
    },
  });
};
