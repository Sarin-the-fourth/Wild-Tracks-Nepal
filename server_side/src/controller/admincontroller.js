import Tour from "../models/tourmodel.js";
import Bike from "../models/bikemodel.js";
import Itinerary from "../models/itinerarymodel.js";
import Booking from "../models/bookingmodel.js";
import Homepage from "../models/homepagemodel.js";
import sendMail from "../utils/sendMail.js";
import cloudinary from "../utils/CloudinaryConnect.js";
import { getBikesWithAvailability } from "../middleware/bike_availability_count.js";

export const createTourWithItinerary = async (req, res) => {
  try {
    // Extract tour data from request body
    const {
      name,
      description,
      location,
      introduction,
      price,
      altitude,
      numberofdays,
      country,
      availability = true,
      cover_image,
      gallery_images,
      itinerary,
      recommended_bikes, // changed from recommended_bike
      includes,
      excludes,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !location ||
      !introduction ||
      !price ||
      !altitude ||
      !numberofdays ||
      !country ||
      !cover_image ||
      !itinerary ||
      !includes ||
      !excludes
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided, including cover image and itinerary",
      });
    }

    // Validate country
    if (!["Nepal", "India", "Bhutan"].includes(country)) {
      return res.status(400).json({
        success: false,
        message: "Country must be Nepal, India, or Bhutan",
      });
    }

    // Check if tour with same name or location already exists
    const existingTour = await Tour.findOne({
      $or: [{ name }, { location }],
    });

    if (existingTour) {
      return res.status(409).json({
        success: false,
        message: "Tour with this name or location already exists",
      });
    }

    // Prepare tour data
    const tourData = {
      name,
      description,
      location,
      introduction,
      price: Number(price),
      altitude: Number(altitude),
      numberofdays: Number(numberofdays),
      country,
      availability: availability === "true" || availability === true,
      recommended_bikes,
      includes,
      excludes,
    };

    // Upload cover image to Cloudinary
    if (cover_image && cover_image.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(cover_image, {
          folder: "Tours/CoverImages",
          quality: "auto:best",
        });

        tourData.cover_image = uploadResponse.secure_url;
      } catch (err) {
        console.error("Error uploading cover image:", err);
        return res.status(400).json({
          success: false,
          message: `Error uploading cover image: ${err.message}`,
        });
      }
    }

    // Upload gallery images to Cloudinary
    const uploadedGalleryImages = [];
    if (
      gallery_images &&
      Array.isArray(gallery_images) &&
      gallery_images.length > 0
    ) {
      try {
        for (const image of gallery_images) {
          if (image.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
              folder: "Tours/GalleryImages",
            });
            uploadedGalleryImages.push(uploadResponse.secure_url);
          }
        }
        tourData.gallery_images = uploadedGalleryImages;
      } catch (err) {
        console.error("Error uploading gallery images:", err);
        return res.status(400).json({
          success: false,
          message: "Error uploading gallery images. Tour cannot be created!",
        });
      }
    }

    const newTour = new Tour(tourData);

    const savedTour = await newTour.save();

    const itineraryItems = itinerary.map((item) => ({
      tour: savedTour._id,
      day: Number(item.day),
      title: item.title,
      description: item.description,
    }));

    if (itineraryItems.length !== Number(numberofdays)) {
      return res.status(400).json({
        success: false,
        message: "Number of itinerary items must match number of days",
      });
    }

    const savedItinerary = await Itinerary.insertMany(itineraryItems);

    return res.status(201).json({
      success: true,
      message: "Tour and itinerary created successfully",
      tour: savedTour,
      itinerary: savedItinerary,
    });
  } catch (error) {
    console.error("Error creating tour:", error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field === "name" ? "Tour name" : "Location"
        } is already registered`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getTourWithItinerary = async (req, res) => {
  try {
    const tourId = req.params.tourId;

    // Get tour details
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

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
    });
  }
};

export const get_all_tours = async (req, res) => {
  try {
    const tours = await Tour.find().select(
      "name description location price numberofdays availability country cover_image gallery_images"
    );
    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: "No tours found",
      });
    }
    return res.status(200).json({
      success: true,
      tours,
    });
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
      .populate("card")
      .select("card testimonial gallery");
    if (!homepage) {
      return res.status(404).json({
        message: "Homepage not found",
      });
    }
    res.status(200).json(homepage);
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCard = async (req, res) => {
  const { homepageId } = req.params;
  const { card } = req.body;

  if (!Array.isArray(card)) {
    return res
      .status(400)
      .json({ message: "'card' must be an array of tour IDs" });
  }

  try {
    const homepage = await Homepage.findById(homepageId);
    if (!homepage) {
      return res.status(404).json({ message: "Homepage not found" });
    }

    homepage.card = card;

    await homepage.save();

    res
      .status(200)
      .json({ message: "Cards updated successfully", card: homepage.card });
  } catch (error) {
    console.error("Error updating cards:", error);
    res.status(500).json({ message: "Server error while updating cards" });
  }
};

export const update_testimonials = async (req, res) => {
  const { homepageId } = req.params;
  const { testimonial } = req.body;
  try {
    const homepage = await Homepage.findById(homepageId);
    if (!homepage) {
      return res.status(404).json({ message: "Homepage not found" });
    }
    homepage.testimonial = testimonial;
    await homepage.save();
    res.status(200).json({
      message: "Testimonials updated successfully",
      testimonial: homepage.testimonial,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching testimonials" });
  }
};

export const add_image_gallery = async (req, res) => {
  try {
    const { gallery } = req.body;

    if (!Array.isArray(gallery) || gallery.length === 0) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const uploadGallery = [];

    for (const item of gallery) {
      const { name, url } = item;

      if (!name || !url) {
        return res.status(400).json({
          message: "Each gallery item must have a name and url",
        });
      }

      let imageUrl = url;

      if (url.startsWith("data:image")) {
        const uploadResponse = await cloudinary.uploader.upload(url, {
          folder: "Homepage/Gallery",
        });
        imageUrl = uploadResponse.secure_url;
      }
      uploadGallery.push({ name, url: imageUrl });
    }

    const homepage = await Homepage.findOne();
    if (!homepage) {
      return res.status(404).json({
        message: "Homepage not found!",
      });
    }

    homepage.gallery.push(...uploadGallery);
    await homepage.save();

    res.status(200).json({
      message: "Photos added successfully,",
      gallery: homepage.gallery,
    });
  } catch (error) {
    console.log("Error Adding image: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const add_bikes = async (req, res) => {
  try {
    let {
      bike_number,
      bike_brand,
      bike_model,
      condition,
      bike_image,
      bike_description,
      bike_price,
      isNewModel,
    } = req.body;

    if (typeof isNewModel === "undefined") {
      return res.status(400).json({
        message: "isNewModel flag is required in the request body",
      });
    }

    const existingBike = await Bike.findOne({ bike_number });
    if (existingBike) {
      return res.status(409).json({
        message: "Bike number already exists",
      });
    }

    let uploadedBikeImage = bike_image;

    if (isNewModel === true || isNewModel === "true") {
      if (
        !bike_number ||
        !bike_brand ||
        !bike_model ||
        !condition ||
        !bike_image ||
        !bike_description ||
        !bike_price
      ) {
        return res.status(400).json({
          message: "All required fields must be provided for a new model",
        });
      }

      if (bike_image && bike_image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(bike_image, {
            folder: "Bikes/Images",
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "auto",
                quality: "auto",
              },
            ],
          });
          uploadedBikeImage = uploadResponse.secure_url;
        } catch (err) {
          console.error("Error uploading bike image:", err);
          return res.status(400).json({
            message: `Error uploading bike image: ${err.message}`,
          });
        }
      }
    } else {
      const existingModel = await Bike.findOne({ bike_model });
      if (!existingModel) {
        return res.status(400).json({
          message: "Bike model not found. Please check the model name.",
        });
      }
      if (!bike_brand) bike_brand = existingModel.bike_brand;
      if (!bike_description) bike_description = existingModel.bike_description;
      if (!bike_image) bike_image = existingModel.bike_image;
      if (!bike_price) bike_price = existingModel.bike_price;
      uploadedBikeImage = bike_image;
      if (
        !bike_number ||
        !bike_brand ||
        !bike_model ||
        !condition ||
        !bike_image ||
        !bike_description ||
        !bike_price
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      if (bike_image && bike_image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(bike_image, {
            folder: "Bikes/Images",
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "auto",
                quality: "auto",
              },
            ],
          });
          uploadedBikeImage = uploadResponse.secure_url;
        } catch (err) {
          console.error("Error uploading bike image:", err);
          return res.status(400).json({
            message: `Error uploading bike image: ${err.message}`,
          });
        }
      }
    }

    const addBike = new Bike({
      bike_number,
      bike_brand,
      bike_model,
      condition,
      bike_image: uploadedBikeImage,
      bike_description,
      bike_price,
      available: true,
    });

    await addBike.save();

    return res.status(200).json({ message: "Bike added successfully" });
  } catch (error) {
    console.log("Error in add_bikes:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const get_bikes = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const bikes = await Bike.findById(bikeId).select(
      "bike_number bike_brand bike_model condition bike_description bike_image"
    );

    if (!bikes) {
      return res.status(404).json({
        message: "Bike not found",
      });
    }

    const modelCount = Bike.countDocuments({ bike_model: bikes.bike_model });

    return res.status(200).json({
      message: "Bike fetched successfully",
      bikes,
      modelCount,
    });
  } catch (error) {
    console.log("Error in get_bikes:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

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

export const get_all_bikes = async (req, res) => {
  try {
    const bikes = await Bike.find().select(
      "bike_number bike_brand bike_model condition bike_description bike_image bike_price"
    );

    if (!bikes || bikes.length === 0) {
      return res.status(404).json({
        message: "No bikes found",
      });
    }

    return res.status(200).json({
      message: "Bikes fetched successfully",
      bikes,
    });
  } catch (error) {
    console.log("Error in get_all_bikes:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delete_bike = async (req, res) => {
  try {
    const bike_number = decodeURIComponent(req.params.bike_number).trim();

    const deletedBike = await Bike.findOneAndDelete({
      bike_number: { $regex: new RegExp(`^${bike_number}$`, "i") },
    });
    if (!deletedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    return res.status(200).json({
      message: "Bike deleted successfully",
    });
  } catch (error) {
    console.log("Error in delete_bike: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const get_all_bookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: { $in: ["confirmed", "cancelled", "completed"] },
    })
      .select(
        "client_name client_phone email pax_no start_date end_date guide status"
      )
      .populate("tour", "name")
      .populate("bike", "bike_number bike_model bike_brand");
    return res.status(200).json({ message: "All Bookings Fetched!", bookings });
  } catch (error) {
    console.log("Error in get_all_bookings: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const get_approved_bookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: { $in: ["approved", "confirmed"] },
    })
      .populate("tour", "name location price numberofdays availability")
      .populate("bike", "bike_number bike_brand bike_model availability")
      .populate("assigned_bike", "bike_brand bike_model bike_number")
      .select(
        "client_name client_phone email start_date end_date assigned_bike pax_no tour guide bike status"
      );
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookings,
    });
  } catch (error) {
    console.log("Error in get_bookings:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const get_pending_bookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending" })
      .populate("tour", "name location price numberofdays availability")
      .populate("bike", "bike_number bike_brand bike_model availability")
      .select(
        "client_name client_phone email start_date end_date guide enquiry pax_no tour bike"
      );
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookings,
    });
  } catch (error) {
    console.log("Error in get_bookings:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delete_pending_bookings = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const deleteBooking = await Booking.findOneAndDelete(bookingId);

    if (!deleteBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.log("Error deleting pending bookings: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const delete_cancelled_bookings = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const deletebookings = await Booking.findOneAndDelete(bookingId);
    if (!deletebookings) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
  } catch (error) {
    console.log("Error deleting cancelled bookings: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const get_confirmed_bookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "confirmed" })
      .populate("tour", "name location price numberofdays availability")
      .populate("bike", "bike_number bike_brand bike_model availability")
      .select(
        "client_name client_phone email start_date end_date guide enquiry pax_no assigned_bike tour bike"
      );
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookings,
    });
  } catch (error) {
    console.log("Error in get_confirmed_bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const get_booking_history = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: { $in: ["confirmed", "cancelled", "completed"] },
    })
      .populate("tour", "name location price numberofdays availability")
      .populate("bike", "bike_number bike_brand bike_model availability")
      .populate("assigned_bike", "bike_brand bike_model bike_number")
      .select(
        "client_name client_phone email start_date end_date assigned_bike pax_no tour guide bike"
      );
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No booking history found" });
    }

    bookings.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    bookings.forEach((booking) => {
      booking.start_date = booking.start_date
        ? new Date(booking.start_date).toISOString().split("T")[0]
        : "N/A";
      booking.end_date = booking.end_date
        ? new Date(booking.end_date).toISOString().split("T")[0]
        : "N/A";
    });
    return res.status(200).json({
      message: "Booking history fetched successfully",
      bookings,
    });
  } catch (error) {
    console.log("Error in get_booking_history:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const get_tour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId)
      .select("name location price numberofdays availability")
      .populate("itinerary", "day title description");

    if (!tour) {
      res.status(400).json({
        message: "Tour not found",
      });
    }

    const itinerary = await Itinerary.find({ tour: tourId }).select(
      "day title description"
    );

    return res.status(200).json({
      message: "Tour fetched successfully",
      ...tour.toObject(),
      itinerary,
    });
  } catch (error) {
    console.log("Error in get_tour:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const respond_booking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!bookingId || !status) {
      return res
        .status(400)
        .json({ message: "Booking ID and status are required" });
    }

    const validStatuses = ["approved", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId).populate(
      "tour",
      "name location numberofdays"
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;

    if (status === "approved") {
      await sendMail(
        booking.email,
        "Welcome Aboard! Your Booking Has Been Confirmed",
        `Dear ${booking.client_name},
        
        We are thrilled to inform you that your booking has been confirmed!  
        Thank you for choosing our service — we can't wait to take you on an unforgettable journey.

        Tour Details:
        - Tour Name: ${booking.tour.name}
        - Tour Location: ${booking.tour.location}
        - Number of Days: ${booking.tour.numberofdays}

        Here's what happens next:
        - Our team is preparing everything for your upcoming tour.
        - You'll receive further details about your itinerary and assigned bikes shortly.
        - If you have any questions, feel free to reach out to us anytime.
        
         **Stay connected on WhatsApp:**
        - Tour Coordinator: +977-9851054001
        
        **To help us serve you better, please reply to this email with your active WhatsApp number.** This helps us send you updates and provide quick assistance during the tour.
        
        We look forward to hosting you soon!
        
        Warm regards,  
        The Team`
      );
      booking.status = "confirmed";
    } else {
      booking.status = status;
    }

    await booking.save();

    return res.status(200).json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.log("Error in respond_booking:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const edit_booking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { start_date, pax_no, assigned_bike } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    if (!start_date || !pax_no || !assigned_bike) {
      return res.status(400).json({
        message: "Start date, pax number, and assigned bike are required",
      });
    }

    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const newStartDate = new Date(start_date);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + booking.tour.numberofdays);

    const overlappingBooking = await Booking.findOne({
      _id: { $ne: bookingId },
      assigned_bike: { $in: assigned_bike },
      status: { $in: ["approved", "confirmed"] },
      $or: [
        {
          start_date: { $lt: newEndDate },
          end_date: { $gt: newStartDate },
        },
        {
          start_date: { $gte: newStartDate },
          end_date: { $lte: newEndDate },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        error: "Bike is already booked for the selected dates.",
      });
    }

    booking.start_date = newStartDate;
    booking.end_date = newEndDate;
    booking.pax_no = pax_no;
    booking.assigned_bike = assigned_bike;

    await booking.save();
    return res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.log("Error in edit_booking:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const update_bike_condition = async (req, res) => {
  try {
    const bike_number = decodeURIComponent(req.params.bike_number).trim();
    const { condition } = req.body;

    if (!condition) {
      return res.status(400).json({ message: "Condition is required" });
    }

    const updatedBike = await Bike.findOneAndUpdate(
      { bike_number: { $regex: new RegExp(`^${bike_number}$`, "i") } },
      { condition },
      { new: true }
    );

    if (!updatedBike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    return res.status(200).json({
      message: "Bike condition updated successfully",
      bike: updatedBike,
    });
  } catch (error) {
    console.error("Error in update_bike_condition:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const assign_bikes = async (req, res) => {
  try {
    const { bookingId, bikeNumbers } = req.body;

    if (!bookingId || !Array.isArray(bikeNumbers) || bikeNumbers.length === 0) {
      return res
        .status(400)
        .json({ error: "bookingId and bikeNumbers are required" });
    }

    const bikes = await Bike.find({ bike_number: { $in: bikeNumbers } });
    if (!bikes || bikes.length !== bikeNumbers.length) {
      return res.status(404).json({ error: "One or more bikes not found" });
    }
    const bikeIds = bikes.map((b) => b._id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.assigned_bike = bikeIds;

    const overlappingBooking = await Booking.findOne({
      _id: { $ne: bookingId },
      assigned_bike: { $in: bikeIds }, // any overlapping bike
      status: { $in: ["approved", "confirmed"] },
      $or: [
        {
          start_date: { $lte: booking.end_date },
          end_date: { $gte: booking.start_date },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        error: "Bike is already booked for the selected dates.",
      });
    }

    booking.status = "approved";
    await booking.save();

    const today = new Date();
    if (booking.start_date <= today && booking.end_date >= today) {
      await Bike.updateMany(
        { _id: { $in: bikeIds } },
        { $set: { available: false } }
      );
    }

    res.status(200).json({ message: "Bikes assigned successfully", booking });
  } catch (err) {
    console.error("Error in assign_bikes:", err);
    res.status(500).json({ error: "Failed to assign bikes" });
  }
};

export const cancel_bookings_bike = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updateData = { status };
    if (status === "cancelled") {
      updateData.assigned_bike = [];
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const free_bikes_after_tour = async () => {
  const today = new Date();

  const bookings = await Booking.find({
    end_date: { $lt: today },
    status: { $ne: "completed" },
  });

  for (const booking of bookings) {
    await Bike.updateMany(
      { _id: { $in: booking.assigned_bike } },
      { $set: { available: true } }
    );

    booking.status = "completed";
    await booking.save();
  }
};

export const update_tour_info = async (req, res) => {
  try {
    const { tourId } = req.params;
    const updateData = req.body;

    if (!updateData || typeof updateData !== "object") {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    if (!tourId) {
      return res.status(400).json({
        success: false,
        message: "Tour ID is required",
      });
    }

    const cleanedUpdateData = {};
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        cleanedUpdateData[key] = value;
      }
    });

    if (Object.keys(cleanedUpdateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    console.log("cleanedUpdateData:", cleanedUpdateData);

    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { $set: cleanedUpdateData },
      { new: true, runValidators: true }
    );

    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      tour: updatedTour,
    });
  } catch (error) {
    console.log("Error in updating tour: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const delete_tour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const deleteTour = await Tour.findByIdAndDelete(tourId);

    if (!deleteTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tour Deleted Successfully!",
    });
  } catch (error) {
    console.log("Error Deleting tour: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const update_itinerary = async (req, res) => {
  try {
    const { tourId, day } = req.params;
    const updateData = req.body;

    const updatedItinerary = await Itinerary.findOneAndUpdate(
      { tour: tourId, day: Number(day) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItinerary) {
      return res.status(404).json({
        success: false,
        message: "No itinerary found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Itinerary updated successfully",
    });
  } catch (error) {
    console.log("Error Updating Itinerary: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
