import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { LoginFormType, RegisterFormType } from "@/schemas/auth-schema";
import axiosInstance, { getCsrfToken } from "@/lib/axios";

const getAuthenticatedUser = async () => {
  try {
    // The token is added automatically by the axios interceptor
    const response = await axiosInstance.get("/user");
    // Your API resource likely wraps the data, so we return response.data.data
    return response.data.data;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    throw error;
  }
};

export const useLogin = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore.getState(); // Use getState for non-reactive updates in callbacks

  return useMutation({
    mutationFn: async (credentials: LoginFormType) => {
      try {
        // const res = await axiosInstance.post(`${API_URL}/login`, credentials);
        await getCsrfToken();
        // Then make the login request
        const res = await axiosInstance.post("/login", credentials);
        if (!res.data.success) {
          throw new Error(res.data.message || "Invalid credentials");
        }
        return res.data;
      } catch (error: any) {
        // Handle axios error responses
        if (error.response) {
          throw new Error(error.response.data.message || "Login failed");
        }
        throw error;
      }
    },
    onSuccess: async (data) => {
      setToken(data.access_token);
      toast.success("Login successful! Redirecting...");
      const user = await getAuthenticatedUser();

      if (user) {
        setUser(user);
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "provider":
            router.push("/provider/dashboard");
            break;
          default:
            router.push("/find-services");
            break;
        }
      } else {
        toast.error("Failed to retrieve user details. Please try again.");
        router.push("/auth/login");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (userData: RegisterFormType) => {
      try {
        await getCsrfToken();
        const res = await axiosInstance.post("/register", userData);
        if (!res.data.success) {
          throw new Error(res.data.message || "Registration failed");
        }
        return res.data;
      } catch (error: any) {
        // Handle validation errors from Laravel
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors;
          const firstError = Object.values(validationErrors)[0];
          throw new Error(
            Array.isArray(firstError) ? firstError[0] : "Validation failed"
          );
        }
        // Handle other errors
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Registration failed"
        );
      }
    },
    onSuccess: () => {
      toast.success("Registration successful. Please login.");
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore.getState(); // Use getState for non-reactive updates in callbacks
  return useMutation({
    mutationFn: async () => {
      const loadingToast = toast.loading("Logging out...");
      try {
        await getCsrfToken();
        await axiosInstance.post("/logout");
        clearAuth();
        router.push("/");
        toast.dismiss(loadingToast);
        toast.success("Logged out successfully");
      } catch (error) {
        toast.dismiss(loadingToast);
        throw error;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });
};
