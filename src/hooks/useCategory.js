import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi, deleteCategoryApi, getAllCategoryApi, getCategoryByUniqueIdApi, updateCategoryApi } from "../ApiServices/categoryService.js";
import toast from "react-hot-toast";

export const useGetAllCategories = ({ search = "", page = 1, limit = 10 } = {}) => {
  const queryKey = ["categories", search, page, limit];
  return useQuery({
    queryKey,
    queryFn: () => getAllCategoryApi({ search, page, limit }),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
    cacheTime: 20 * 60 * 1000, 
    refetchOnMount: false, 
  });
};

export const useGetCategoryByUniqueId = (uniqueId) => {
  const queryKey = ["category", uniqueId];
  return useQuery({
    queryKey,
    queryFn: () => getCategoryByUniqueIdApi(uniqueId),
    select: (res) => res.data.data,
    enabled: !!uniqueId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 20 * 60 * 1000, 
    refetchOnMount: false, 
  });
}

export const useCreateCategory = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCategoryApi(data),
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(); 
    },
    onError: () => {
      toast.error("Failed to create category");
    },
    onSettled: () => options.onSettled?.(),
  });
};

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId, payload }) => updateCategoryApi(uniqueId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });    
      toast.success("Category updated successfully"); 
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
};

export const useCategoryDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId }) => deleteCategoryApi(uniqueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // toast.success("Category deleted successfully", {
      //   duration: 2000, // 2 second
      // });
      alert("Category deleted successfully");
    },
    onError: () => {
      // toast.error("Failed to delete category", {
      //   duration: 3000, // 3 second
      // });
      alert("Failed to delete category");
    },
  });
};
