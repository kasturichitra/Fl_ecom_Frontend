import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrdersApi, getOrderProductsByIdApi } from "../ApiServices/orderService";

export const useGetAllOrders = ({searchTerm = "", page = 1, limit = 10 }) => {
    // console.log("useGetAllOrders",searchTerm, page, limit)    

    const queryKey = ["orders", searchTerm || "", page, limit]; 
  // const client = useQueryClient();
  return useQuery({
    queryKey,
    queryFn: () => getAllOrdersApi({searchTerm, page, limit}),
    select: (res) => res.data.data,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });
};




export const useGetOrderProductsById = (orderId) => {
    const queryKey = ["order-products", orderId];
    return useQuery({
      queryKey,
      queryFn: () => getOrderProductsByIdApi(orderId),
      select: (res) => res.data.data,
      enabled: !!orderId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 20 * 60 * 1000,
      refetchOnMount: false,
    });
  };