import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register, verifyOtp, login } from "../ApiServices/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => register(data),
    onSuccess: (response) => {
      toast.success("User created successfully");
      // queryClient.invalidateQueries({ queryKey: ["users"] });
      // console.log("response",response);
      const data = response?.data;

      if (data) {
        sessionStorage.setItem("otp_id", data?.otp_id);
        sessionStorage.setItem("reason", data?.reason);
        sessionStorage.setItem("requireOtp", data?.requireOtp);
      }

      if (data?.requireOtp) {
        navigate("/verify-otp");
      }
      
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });
};

export const useLogin = () => {
  //   const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (response) => {
      toast.success("User created successfully");
      //   queryClient.invalidateQueries({ queryKey: ["users"] });
      // navigate("/");

      const data = response?.data;

      console.log("data from useLogin",data);

      if (data) {
        sessionStorage.setItem("otp_id", data?.otp_id);
        sessionStorage.setItem("reason", data?.reason);
        sessionStorage.setItem("requireOtp", data?.requireOtp);
      }

      if (data?.requireOtp) {
        navigate("/verify-otp");
      }

      if(data?.status === "success"){
        navigate("/");
      }
    //   navigate("/");

    //   navigate("/verify-otp");
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });
};

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => verifyOtp(data),
    onSuccess: (response) => {
      toast.success("User verified successfully");

      // Navigate based on reason
      if (response?.data?.reason === "signup") {
        navigate("/login");
      } else {
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Failed to verify user");
    },
  });
};
