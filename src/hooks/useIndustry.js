import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createIndustryApi, getAllIndustryApi } from "../ApiServices/industryService";

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

export const useCreateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createIndustryApi(data),
    onSuccess: () => {
      toast.success("Industry created successfully");
      queryClient.invalidateQueries(["industries"]);
    },
    onError: () => {
      toast.error("Failed to create industry");
    },
  });
};
