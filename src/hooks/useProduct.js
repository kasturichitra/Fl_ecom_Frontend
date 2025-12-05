import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBulkProductsApi,
  createProductApi,
  deleteProductApi,
  downloadProductsExcelApi,
  getAllProductsApi,
  updateProductApi,
} from "../ApiServices/productService";
import toast from "react-hot-toast";

export const useGetAllProducts = ({
  searchTerm = "",
  page = 1,
  limit = 10,
  sort = "",
  industry_unique_id = "",
  category_unique_id = "",
  gender = "",
} = {}) => {
  const queryKey = ["products", searchTerm, page, limit, sort, industry_unique_id, category_unique_id, gender];
  return useQuery({
    queryKey,
    queryFn: () => getAllProductsApi({ searchTerm, page, limit, sort, industry_unique_id, category_unique_id, gender }),
    select: (res) => res.data,
    staleTime: 60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateProduct = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createProductApi(data),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create product");
    },
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

export const useUpdateProduct = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId, payload }) => updateProductApi(uniqueId, payload),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to update product");
    },
    onSettled: () => options.onSettled?.(),
  });
};

export const useDownloadProductExcel = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uniqueId }) => downloadProductsExcelApi(uniqueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product Excel downloaded successfully", {
        duration: 2000, // 2 second
      });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to download product Excel", {
        duration: 3000, // 3 second
      });
    },
  });
};

export const useCreateBulkProducts = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBulkProductsApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Bulk products created successfully");
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create bulk products");
    },
  });
};
