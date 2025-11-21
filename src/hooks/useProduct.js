import { useQuery } from "@tanstack/react-query";
import { getAllProductsApi } from "../ApiServices/productService";

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
