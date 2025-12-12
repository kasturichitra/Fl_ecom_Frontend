import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSaleTrend, deleteSaleTrend, getSaleTrends, updateSaleTrend } from "../ApiServices/saleTrendService";
import toast from "react-hot-toast";

export const useGetAllSaleTrends = ({ searchTerm = "", page = 1, limit = 10, sort = "" }) => {
  const queryKey = ["saleTrends", searchTerm || "", page, limit, sort];

  return useQuery({
    queryKey,
    queryFn: () => getSaleTrends({ searchTerm, page, limit, sort }),
    select: (res) => res?.data,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateSaleTrend = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createSaleTrend(data),
    onSuccess: () => {
      toast.success("Sale Trend created successfully");
      queryClient.invalidateQueries({ queryKey: ["saleTrends"] });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create brand");
    },
  });
};

export const useUpdateSaleTrend = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSaleTrend(id, data),
    onSuccess: () => {
      toast.success("Sale Trend updated successfully");
      queryClient.invalidateQueries({ queryKey: ["saleTrends"] });
      options?.onSuccess?.();
    },
    onSettled: () => {
      options?.onSettled?.();
    },
    onError: () => {
      toast.error("Failed to update Sale Trend");
    },
  });
};

export const useDeleteSaleTrend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSaleTrend(id),
    onSuccess: () => {
      toast.success("Sale Trend deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["saleTrends"] });
    },
    onError: () => {
      toast.error("Failed to delete Sale Trend");
    },
  });
}