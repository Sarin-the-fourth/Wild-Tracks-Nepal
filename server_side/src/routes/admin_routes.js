import { Router } from "express";
import {
  add_bikes,
  get_approved_bookings,
  get_pending_bookings,
  createTourWithItinerary,
  getTourWithItinerary,
  get_all_bikes,
  delete_bike,
  update_bike_condition,
  get_all_bookings,
  free_bikes_after_tour,
  assign_bikes,
  delete_pending_bookings,
  edit_booking,
  get_confirmed_bookings,
  get_all_tours,
  updateCard,
  get_homepage,
  update_testimonials,
  cancel_bookings_bike,
  update_tour_info,
  delete_tour,
  update_itinerary,
  add_image_gallery,
} from "../controller/admincontroller.js";
import { respond_booking, get_bikes } from "../controller/admincontroller.js";
import { updateProfile } from "../controller/authcontroller.js";

const router = Router();

// router.use(is_admin);
router.post("/add-tour", createTourWithItinerary);
router.get("/tour/:tourId", getTourWithItinerary);
router.get("/tours", get_all_tours);
router.put("/update-tour-info/:tourId", update_tour_info);
router.delete("/delete-tour/:tourId", delete_tour);
router.patch("/update-itinerary/:tourId/:day", update_itinerary);

router.post("/add-bike", add_bikes);
router.delete("/delete-bike/:bike_number", delete_bike);
router.put("/update-bike-condition/:bike_number", update_bike_condition);

router.get("/bookings", get_all_bookings);
router.get("/bookings/approved", get_approved_bookings);
router.get("/bookings/pending", get_pending_bookings);
router.get("/bookings/confirmed", get_confirmed_bookings);
router.patch("/respond-booking/:bookingId", respond_booking);
router.patch("/cancel_bookings_bike/:bookingId", cancel_bookings_bike);

router.post("/edit-booking/:bookingId", edit_booking);
router.delete("/delete-pending-booking/:bookingId", delete_pending_bookings);

router.post("/assign-bikes", assign_bikes);

router.get("/get_bikes/:bikeId", get_bikes);
router.get("/get_bikes", get_all_bikes);

router.post("/release-expired-bikes", free_bikes_after_tour);

router.get("/get_homepage", get_homepage);
router.put("/update-card/:homepageId", updateCard);
router.put("/update_testimonials/:homepageId", update_testimonials);
router.post("/add_gallery_image", add_image_gallery);

router.put("/update-profile/:adminId", updateProfile);
export default router;
