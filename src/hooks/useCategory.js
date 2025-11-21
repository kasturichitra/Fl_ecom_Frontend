import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryApi, getAllCategoryApi, updateCategoryApi } from "../ApiServices/categoryService.js";

export const useGetAllCategories = ({ search = "", page = 1, limit = 10 }) => {
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

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId, paload }) => updateCategoryApi(uniqueId, paload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};






export const useCategoryDelete=() => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId }) => deleteCategoryApi(uniqueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};


