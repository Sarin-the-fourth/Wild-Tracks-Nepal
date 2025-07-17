import { toast } from "react-toastify";
import { create } from "zustand";
import { axiosInstance } from "../assets/axios";

export const useAdminStore = create((set) => ({
  loadingAddTour: false,
  loadingAddBike: false,
  loadingUpdateCondition: false,
  bookings: [],
  tour: [],
  homepage: null,
  admin: null,

  addTour: async (tourdata) => {
    try {
      set({ loadingAddTour: true });
      const res = await axiosInstance.post("/admin/add-tour", tourdata);

      toast.success(res.data.message);
    } catch (error) {
      console.log("Something went wrong", error);
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loadingAddTour: false });
    }
  },

  fetchAllTours: async () => {
    try {
      const res = await axiosInstance.get("/admin/tours");
      set({ tour: res.data.tours });
      console.log("Fetched tours:", res.data.tours);
      return res.data.tours || [];
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      toast.error("Failed to fetch tours");
      return [];
    }
  },

  addBike: async (bikedata) => {
    try {
      set({ loadingAddBike: true });
      const res = await axiosInstance.post("/admin/add-bike", bikedata);

      toast.success(res.data.message);
    } catch (error) {
      console.error("Error adding bike:", error);
      toast.error(error.response?.data?.message || "Failed to add bike");
    } finally {
      set({ loadingAddBike: false });
    }
  },

  deletebike: async (bike_number) => {
    try {
      await axiosInstance.delete(
        `/admin/delete-bike/${encodeURIComponent(bike_number)}`
      );
      toast.success("Bike deleted successfully");
    } catch (error) {
      console.error("Error deleting bike:", error);
      toast.error(error.response?.data?.message || "Failed to delete bike");
    }
  },

  updateBikeCondition: async (bike_number, condition) => {
    try {
      set({ loadingUpdateCondition: true });
      const res = await axiosInstance.put(
        `/admin/update-bike-condition/${encodeURIComponent(bike_number)}`,
        { condition }
      );
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error updating condition:", error);
      toast.error(
        error.response?.data?.message || "Failed to update condition"
      );
    } finally {
      set({ loadingUpdateCondition: false });
    }
  },

  fetchAllBikes: async () => {
    try {
      const res = await axiosInstance.get("/admin/get_bikes");
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch bikes:", error);
      return [];
    }
  },

  fetchAllBookings: async () => {
    try {
      const res = await axiosInstance.get("/admin/bookings");
      set({ bookings: res.data.bookings });
      console.log(res.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings: ", error);
      toast.error("Failed to fetch bookings");
      set({ bookings: [] });
    }
  },

  fetchPendingBookings: async () => {
    try {
      const res = await axiosInstance.get("/admin/bookings/pending");
      set({ bookings: res.data.bookings });
    } catch (error) {
      console.log("Failed to fetch bookings", error);
      toast.error("No Bookings Found");
      set({ bookings: [] }); // Optional fallback
    }
  },

  deletependingbooking: async (id) => {
    try {
      const res = await axiosInstance.delete(
        `/admin/delete-pending-booking/${id}`
      );
      toast.success(res.data.message || "Booking deleted successfully");

      // Refresh pending bookings after deletion
      await useAdminStore.getState().fetchPendingBookings();
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  },

  assignBikes: async (bookingId, bikeNumbers) => {
    try {
      const res = await axiosInstance.post("/admin/assign-bikes", {
        bookingId,
        bikeNumbers,
      });
      toast.success(res.data.message || "Bikes assigned successfully");
      // Refresh pending bookings after assignment
      await useAdminStore.getState().fetchPendingBookings();
    } catch (error) {
      console.error("Failed to assign bikes:", error);
      toast.error(error.response?.data?.error || "Failed to assign bikes");
    }
  },

  fetchApprovedBookings: async () => {
    try {
      const res = await axiosInstance.get("/admin/bookings/approved");
      set({ bookings: res.data.bookings });
      console.log(res.data.bookings);
    } catch (error) {
      console.log("Failed to fetch bookings", error);
      toast.error("No Bookings Found");
      set({ bookings: [] }); // Optional fallback
    }
  },

  respondBookings: async (id, status) => {
    try {
      const res = await axiosInstance.patch(`admin/respond-booking/${id}`, {
        status,
      });
      toast.success(res.data.message || "Booking updated");

      // Optional: refresh bookings after status update
      await useAdminStore.getState().fetchApprovedBookings();
    } catch (error) {
      console.log("Failed to respond bookings", error);
      toast.error("Failed to respond bookings");
      set({ bookings: [] }); // Optional fallback
    }
  },

  freeAssignedBike: async (id, status) => {
    try {
      const res = await axiosInstance.patch(
        `/admin/cancel_bookings_bike/${id}`,
        { status }
      );
      toast.success(res.data.message);
    } catch (error) {
      console.log("Failed freeing assigned bikes: ", error);
    }
  },

  editBooking: async (id, updatedData) => {
    try {
      const res = await axiosInstance.post(
        `/admin/edit-booking/${id}`,
        updatedData
      );
      toast.success(res.data.message || "Booking edited successfully");

      // Refresh bookings after edit
      await useAdminStore.getState().fetchPendingBookings();
      await useAdminStore.getState().fetchApprovedBookings();
    } catch (error) {
      console.error("Failed to edit booking:", error);
      toast.error(error.response?.data?.message || "Failed to edit booking");
    }
  },

  fetchHomepage: async () => {
    try {
      const res = await axiosInstance.get("/admin/get_homepage");
      set({ homepage: res.data });
      console.log("Fetched homepage: ", res.data);
    } catch (error) {
      console.error("Failed to fetch homepage:", error);
      toast.error("Failed to fetch homepage");
      set({ homepage: null });
    }
  },

  updateCard: async (homepageId, cardData) => {
    try {
      const res = await axiosInstance.put(`/admin/update-card/${homepageId}`, {
        card: cardData,
      });
      toast.success(res.data.message || "Card updated successfully");
    } catch (error) {
      console.error("Failed to update card:", error);
      toast.error(error.response?.data?.message || "Failed to update card");
    }
  },

  updateTestimonials: async (homepageId, testimonialData) => {
    try {
      const res = await axiosInstance.put(
        `/admin/update_testimonials/${homepageId}`,
        { testimonial: testimonialData }
      );
      toast.success(res.data.message || "Testimonials updated successfully");
    } catch (error) {
      console.error("Failed to update testimonials:", error);
      toast.error(
        error.response?.data?.message || "Failed to update testimonials"
      );
    }
  },

  addGalleryImage: async (galleryData) => {
    try {
      const res = await axiosInstance.post("/admin/add_gallery_image", {
        gallery: galleryData,
      });
      toast.success(res.data.message || "Image successfully added");
    } catch (error) {
      console.error("Failed to add image");
      toast.error(error.response?.data?.message || "Failed to add image");
    }
  },

  updateProfile: async (profileData, id) => {
    try {
      const res = await axiosInstance.put(
        `/admin/update-profile/${id}`,
        profileData
      );

      if (res.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in update profile: ", error);
      toast.error(error.response.data.message || "Failed to update profile");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/admin/checkauth");
      if (res.data.success) {
        console.log(res.data);
        set({ admin: res.data.admin });
      } else {
        set({ admin: null });
        toast.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      toast.error("Failed to check authentication");
      set({ admin: null });
    }
  },

  updateTour: async (tourId, updateData) => {
    try {
      const res = await axiosInstance.put(
        `/admin/update-tour-info/${tourId}`,
        updateData
      );
      if (res.data.success) {
        console.log(res.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Failed Updating Tour: ", error);
      toast.error("Failed Updating Tour");
    }
  },

  deleteTour: async (tourId) => {
    try {
      const res = await axiosInstance.delete(`/admin/delete-tour/${tourId}`);
      if (res.data.success) {
        console.log(res.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Failed Deleting Tour: ", error);
      toast.error("Failed Deleting Tour");
    }
  },

  updateItinerary: async (tourId, daynumber, updateData) => {
    try {
      const res = await axiosInstance.patch(
        `/admin/update-itinerary/${tourId}/${daynumber}`,
        updateData
      );
      if (res.data.success) {
        console.log(res.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error Updating Itinerary: ", error);
      toast.error("Failed to Update Itinerary");
    }
  },
}));
