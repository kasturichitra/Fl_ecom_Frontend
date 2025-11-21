import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBrandApi, getAllBrandApi, updateBrandApi } from "../ApiServices/brandService";
import toast from "react-hot-toast";

export const useGetAllBrands = ({ searchTerm = "", page = 1, limit = 10 }) => {
  const queryKey = ["brands", searchTerm || "", page, limit];

  return useQuery({
    queryKey,
    queryFn: () => getAllBrandApi({ searchTerm, page, limit }),
    select: (res) => res.data.data,
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


export const useUpdateBrand = () =>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn : (id,data) => updateBrandApi(id, data),
    onSuccess : () =>{
      toast.success("Brand updated successfully");


      queryClient.invalidateQueries({queryKey : ["brands"]})
    },
    onError : () =>{
      toast.error("Failed to update brand")
    }
  })
}