import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createIndustryApi,
  deleteIndustryApi,
  getAllIndustryApi,
  updateIndustryApi,
} from "../ApiServices/industryService";

export const useGetAllIndustries = ({ search = "", page = 1, limit = 10, sort = "", is_active = "" } = {}) => {
  const queryKey = ["industries", search || "", page, limit, sort, is_active];

  return useQuery({
    queryKey,
    queryFn: () => getAllIndustryApi({ search, page, limit, sort, is_active }),
    select: (res) => res?.data,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateIndustry = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createIndustryApi(data),
    onSuccess: () => {
      toast.success("Industry created successfully");
      queryClient.invalidateQueries(["industries"]);
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to create industry", error.message);
    },
  });
};

export const useUpdateIndustry = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateIndustryApi(id, data),
    onSuccess: () => {
      toast.success("Industry updated successfully");
      queryClient.invalidateQueries(["industries"]);
    },
    onError: (error) => {
      toast.error("Failed to update industry", error.message);
    },
    onSettled: () => options.onSettled?.(),
  });
};

export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteIndustryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["industries"]);
      toast.success("Industry deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete industry", error.message);
    },
  });
};
