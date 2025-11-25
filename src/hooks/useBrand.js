import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrandApi, deleteBrandApi, getAllBrandApi, updateBrandApi } from "../ApiServices/brandService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useGetAllBrands = ({ searchTerm = "", page = 1, limit = 10, sort = "" }) => {
  const queryKey = ["brands", searchTerm || "", page, limit, sort];

  return useQuery({
    queryKey,
    queryFn: () => getAllBrandApi({ searchTerm, page, limit, sort }),
    select: (res) => res?.data?.data,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBrandApi(data),
    onSuccess: () => {
      toast.success("Brand created successfully");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: () => {
      toast.error("Failed to create brand");
    },
  });
};

export const useUpdateBrand = (options = {}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => {
      console.log("Updating brand with:", id, data);
      return updateBrandApi(id, data);
    },
    onSuccess: () => {
      toast.success("Brand updated successfully");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: () => {
      toast.error("Failed to update brand");
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBrandApi(id),
    onSuccess: () => {
      toast.success("Brand deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });
};
