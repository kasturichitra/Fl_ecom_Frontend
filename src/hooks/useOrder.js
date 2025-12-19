import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAllOrdersApi, getOrderProductsByIdApi, createOrderApi } from "../ApiServices/orderService";
import toast from "react-hot-toast";

export const useGetAllOrders = ({
  searchTerm = "",
  page = 1,
  limit = 10,
  order_status = "",
  order_type = "",
  payment_method = "",
}) => {
  const queryKey = ["orders", searchTerm || "", page, limit, order_status, order_type, payment_method];
  return useQuery({
    queryKey,
    queryFn: () => getAllOrdersApi({ searchTerm, page, limit, order_status, order_type, payment_method }),
    select: (res) => res?.data?.data,
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
    select: (res) => res?.data?.data,
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateOrder = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createOrderApi(data),
    onSuccess: () => {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create order");
    },
  });
};
