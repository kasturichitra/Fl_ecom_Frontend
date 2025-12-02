import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getAllUsers, storeFcmToken } from "../ApiServices/userService";
import toast from "react-hot-toast";

export const useStoreFcmToken = () => {
  return useMutation({
    mutationFn: ({ token, userId = "69259c7026c2856821c44ced" }) => storeFcmToken(token, userId),
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    select: (res) => res.data.data,
    staleTime: 5 *60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });
};
