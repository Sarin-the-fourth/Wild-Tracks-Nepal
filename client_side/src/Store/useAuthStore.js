import { toast } from "react-toastify";
import { create } from "zustand";
import { axiosInstance } from "../assets/axios";

export const useAuthStore = create((set) => ({
  admin: null,
  loadingLogin: false,
  loadingCheckAuth: true,

  login: async (formData) => {
    try {
      set({ loadingLogin: true });
      const res = await axiosInstance.post("/auth/admin/sign_in", formData);
      set({ admin: res.data.admin });
      toast.success("Login Successfully");
      return true;
    } catch (error) {
      console.log("Err in login: ", error);
      toast.error(
        error.response?.data?.message || "An error occurred during login"
      );
      return false;
    } finally {
      set({ loadingLogin: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ loadingCheckAuth: true });
      const res = await axiosInstance.get("/auth/admin/checkauth");
      if (res.data.success) {
        set({ admin: res.data.admin });
      } else {
        set({ admin: null });
      }
    } catch (error) {
      console.log("Err in check auth: ", error);
    } finally {
      set({ loadingCheckAuth: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/admin/sign_out");
      if (res.data.success) {
        set({ admin: null });
        toast.success("Logout Successfully");
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.log("error while logging out: ", error);
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },
}));
