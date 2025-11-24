import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProductApi, downloadProductsExcelApi, getAllProductsApi } from "../ApiServices/productService";
import toast from "react-hot-toast";

export const useGetAllProducts = ({ searchTerm = "", page = 1, limit = 10 } = {}) => {
  const queryKey = ["products", searchTerm, page, limit];
  return useQuery({
    queryKey,
    queryFn: () => getAllProductsApi({ searchTerm, page, limit }),
    select: (res) => res.data.data,
    staleTime: 60 * 1000,
    refetchOnMount: false,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId }) => deleteProductApi(uniqueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully", {
        duration: 2000, // 2 second
      });
    },
    onError: () => {
      toast.error("Failed to delete product", {
        duration: 3000, // 3 second
      });
    },
  });
};

export const useDownloadProductExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId }) => downloadProductsExcelApi(uniqueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product Excel downloaded successfully", {
        duration: 2000, // 2 second
      });
    },
    onError: () => {
      toast.error("Failed to download product Excel", {
        duration: 3000, // 3 second
      });
    },
  });
};
