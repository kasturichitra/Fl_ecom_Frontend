import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi, deleteCategoryApi, getAllCategoryApi, updateCategoryApi } from "../ApiServices/categoryService.js";
import toast from "react-hot-toast";

export const useGetAllCategories = ({ search = "", page = 1, limit = 10 } = {}) => {
  const queryKey = ["categories", search, page, limit];
  return useQuery({
    queryKey,
    queryFn: () => getAllCategoryApi({ search, page, limit }),
    select: (res) => res.data.data,
    staleTime: 5 * 60 * 1000, // 5 min  before data is considered stale
    cacheTime: 20 * 60 * 1000, // 20 min after which unused data is garbage collected
    refetchOnMount: false, // do not refetch on component remount
  });
};

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
      toast.success("Category deleted successfully", {
        duration: 2000, // 2 second
      });
    },
    onError: () => {
      toast.error("Failed to delete category", {
        duration: 3000, // 3 second
      });
    },
  });
};
