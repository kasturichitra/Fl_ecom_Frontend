import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../ApiServices/authService";
import toast from "react-hot-toast";



export const useRegister = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => register(data),
        onSuccess: () => {
            toast.success("User created successfully");
            // queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Failed to create user");
        },
    });
}