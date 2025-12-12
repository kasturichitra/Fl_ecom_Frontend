import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createSaleTrend,
  deleteSaleTrend,
  getSaleTrendByUniqueId,
  getSaleTrends,
  updateSaleTrend,
} from "../ApiServices/saleTrendService";

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

export const useGetSaleTrendByUniqueId = (uniqueId) => {
  const queryKey = ["saleTrend", uniqueId];
  return useQuery({
    queryKey,
    queryFn: () => getSaleTrendByUniqueId(uniqueId),
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
    onSuccess: (id) => {
      toast.success("Sale Trend created successfully");
      queryClient.invalidateQueries({ queryKey: ["saleTrends", id] });
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
};

// export const useAddProductsToSaleTrend = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }) => addProductsToSaleTrend(id, data),
//     onSuccess: () => {
//       toast.success("Products added to Sale Trend successfully");
//       queryClient.invalidateQueries({ queryKey: ["saleTrends"] });
//     },
//     onError: () => {
//       toast.error("Failed to add products to Sale Trend");
//     },
//   });
// };

// export const useRemoveProductsFromSaleTrend = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }) => removeProductsFromSaleTrend(id, data),
//     onSuccess: () => {
//       toast.success("Products removed from Sale Trend successfully");
//       queryClient.invalidateQueries({ queryKey: ["saleTrends"] });
//     },
//     onError: () => {
//       toast.error("Failed to remove products from Sale Trend");
//     },
//   });
// };
