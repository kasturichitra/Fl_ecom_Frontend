import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentConfig, updateCurrentConfig } from "../ApiServices/configService";
import toast from "react-hot-toast";

export const useGetCurrentConfig = () => {
  const queryKey = ["currentConfig"];
  return useQuery({
    queryKey,
    queryFn: () => getCurrentConfig(),
    select: (res) => res.data.data,
    staleTime: 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useUpdateConfig = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCurrentConfig(id, data),
    onSuccess: () => {
      toast.success("Config updated successfully");
      queryClient.invalidateQueries({ queryKey: ["currentConfig"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update config");
    },
  });
};
