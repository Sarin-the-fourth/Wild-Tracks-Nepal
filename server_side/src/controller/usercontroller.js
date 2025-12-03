import Booking from "../models/bookingmodel.js";
import Tours from "../models/tourmodel.js";
import Itinerary from "../models/itinerarymodel.js";
import { getBikesWithAvailability } from "../middleware/bike_availability_count.js";
import Homepage from "../models/homepagemodel.js";

//Get all bikes
export const get_bikes = async (req, res) => {
  try {
    const bikes = await getBikesWithAvailability();
    return res.status(200).json(bikes);
  } catch (error) {
    console.log("Error in get_bikes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Book a tour
export const book_tour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tours.findById(tourId);
    const {
      client_name,
      client_phone,
      email,
      start_date,
      guide,
      pax_no,
      bike,
      enquiry,
    } = req.body;

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + (tour.numberofdays - 1));

    if (
      !client_name ||
      !email ||
      !pax_no ||
      !start_date ||
      guide === undefined ||
      !bike
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const addbooking = new Booking({
      tour,
      client_name,
      client_phone,
      email,
      pax_no,
      start_date,
      end_date,
      guide,
      enquiry,
      bike,
    });

    await addbooking.save();
    return res.status(201).json({
      message: "Tour booked successfully",
      booking: addbooking,
    });
  } catch (error) {
    console.log("Error in book_tour:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all available bikes by model (used when booking a tour)
export const get_bikes_by_model = async (req, res) => {
  try {
    const { model } = req.params;
    const bikes = await getBikesWithAvailability({ bike_model: model });
    const availableBikes = bikes.filter((b) => b.availability);
    if (availableBikes.length === 0) {
      return res.status(404).json({ message: "No bikes found for this model" });
    }
    return res.status(200).json(availableBikes);
  } catch (error) {
    console.log("Error in get_bikes_by_model:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get tour details
export const get_tour_details = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tours.findById(id).select(
      "name location price numberofdays availability itinerary"
    );

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    const itinerary = await Itinerary.find({ tour: id }).select(
      "day title description"
    );

    return res.status(200).json({
      ...tour.toObject(),
      itinerary,
    });
  } catch (error) {
    console.log("Error in get_tour_details:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all tours
export const get_all_tours = async (req, res) => {
  try {
    const tours = await Tours.find().select(
      "name description location price numberofdays availability country itinerary"
    );
    return res.status(200).json(tours);
  } catch (error) {
    console.log("Error in get_all_tours:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const get_homepage = async (req, res) => {
  try {
    const homepage = await Homepage.findOne()
      .populate("card", "name description numberofdays cover_image")
      .select("card testimonial gallery");
    if (!homepage) {
      return res.status(404).json({
        message: "Homepage not found",
      });
    }
    return res.status(200).json(homepage);
  } catch (error) {
    console.log("Error in get_homepage:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get tours by country
export const get_tours_country = async (req, res) => {
  try {
    const { country } = req.params;
    const tours = await Tours.find({ country, availability: true }).select(
      "name description location price numberofdays availability country itinerary"
    );
    return res.status(200).json({ tours });
  } catch (error) {
    console.log("Error in get_all_tours:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTourWithItinerary = async (req, res) => {
  try {
    const { tourId } = req.params;
    console.log(tourId);

    // Get tour details
    const tour = await Tours.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // Get itinerary for this tour
    const itinerary = await Itinerary.find({ tour: tourId }).sort({ day: 1 });

    return res.status(200).json({
      success: true,
      tour,
      itinerary,
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
