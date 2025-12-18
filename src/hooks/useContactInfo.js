import { useMutation, useQuery } from "@tanstack/react-query";
import { createContactInfo, getContactInfo } from "../ApiServices/contactInfoService";
import toast from "react-hot-toast";


export const useGetContactInfo = () => {
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: () => getContactInfo(),
    select: (res) => res.data.data,
    staleTime: 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useCreateContactInfo = () => {
  return useMutation({
    mutationFn: (formData) => createContactInfo(formData),
    onSuccess: () => {
      toast.success("Contact Info Created Successfully");
    },
    onError: () => {
      toast.error("Failed to Create Contact Info");
    },
  });
};
