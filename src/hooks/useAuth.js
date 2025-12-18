import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  register,
  verifyOtp,
  login,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
  resendOtp,
  authGetMe,
  logout,
} from "../ApiServices/authService";
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

      console.log("data from useLogin", data);

      if (data) {
        sessionStorage.setItem("otp_id", data?.otp_id);
        sessionStorage.setItem("reason", data?.reason);
        sessionStorage.setItem("requireOtp", data?.requireOtp);
      }

      if (data?.requireOtp) {
        navigate("/verify-otp");
      }

      if (data?.status === "success") {
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

export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      toast.success("User logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to logout user");
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

export const useForgotPassword = (options = {}) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => forgotPassword(data),
    onSuccess: (response) => {
      const data = response?.data;
      if (data) {
        console.log("setnigs");
        sessionStorage.setItem("otp_id", data?.otp_id);
        sessionStorage.setItem("reason", data?.reason);
        sessionStorage.setItem("requireOtp", data?.requireOtp);
      }

      options?.onSuccess?.(response);

      if (data?.requireOtp) {
        navigate("/verify-forgot-otp");
      }
    },
    onError: (error) => {
      toast.error("Failed to verify user");
      options?.onError?.(error);
    },
  });
};

export const useVerifyForgotOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => verifyForgotOtp(data),
    onSuccess: (response) => {
      toast.success("User verified successfully");
      // navigate("/login");

      navigate("/reset-password");
    },
    onError: () => {
      toast.error("Failed to verify user");
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: (response) => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to reset password");
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data) => resendOtp(data),
    onSuccess: (response) => {
      toast.success("Otp sent successfully");
      //   queryClient.invalidateQueries({ queryKey: ["users"] });
      if (response) {
        sessionStorage.setItem("otp_id", response?.data?.otp_id);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send otp");
    },
  });
};

export const useAuthGetMe = () => {
  const query = useQuery({
    queryKey: ["auth-get-me"],
    queryFn: () => authGetMe(),
    select: (res) => res?.data,
    // onSuccess: (response) => {
    //   toast.success("User verified successfully");
    // },
    // onError: () => {
    //   toast.error("Failed to verify user");
    // },
  });

  if (query?.data?.user?.id) {
    sessionStorage.setItem("user_id", query?.data?.user?.id);
    sessionStorage.setItem("permissions", btoa(JSON.stringify(query?.data?.user?.permissions)));
  }

  return {
    isAuthenticated: query?.data?.isAuthenticated,
    isLoading: query?.isLoading,
    isError: query?.isError,
    data: query?.data?.user,
  };
};
