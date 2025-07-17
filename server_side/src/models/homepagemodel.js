import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  card: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
  ],

  testimonial: {
    type: [String],
  },

  gallery: [
    {
      name: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const Homepage = mongoose.model("Homepage", homepageSchema);

export default Homepage;
