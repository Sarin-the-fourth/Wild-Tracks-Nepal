import { useState, useEffect } from "react";
import bgimage from "./../../assets/images/uppermustang.jpg";
import { useTourStore } from "../../Store/useTourStore";
import { useBikeStore } from "../../store/useBikeStore";
import { useBookStore } from "../../Store/useBookStore";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setformData] = useState({
    client_name: "",
    email: "",
    client_phone: "",
    tour: "",
    bike: "",
    pax_no: "",
    start_date: "",
    guide: "",
    enquiry: "",
  });

  const { allTours, loadingTours, getAllTours } = useTourStore();

  const { bikes, loadingBikes, fetchBikes } = useBikeStore();

  const [loading, setloading] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllTours();
    fetchBikes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let val = value;
    if (name === "guide") {
      val = value === "true" ? true : value === "false" ? false : "";
    } else if (type === "checkbox") {
      val = checked;
    }

    setformData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Data: ", formData);
    if (
      !formData.client_name ||
      !formData.email ||
      !formData.client_phone ||
      !formData.tour ||
      !formData.bike ||
      !formData.pax_no ||
      !formData.start_date ||
      typeof formData.guide !== "boolean"
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setloading(true);
    await useBookStore.getState().addBookings(formData.tour, formData);
    console.log(" Booking submitted:", formData);
    setloading(false);

    setformData({
      client_name: "",
      email: "",
      client_phone: "",
      tour: "",
      bike: "",
      pax_no: "",
      start_date: "",
      guide: "",
      enquiry: "",
    });
    toast.success("Your booking has been submitted");
  };

  return (
    <div
      className="min-h-screen grid grid-cols-2 relative"
      style={{
        backgroundImage: `url(${bgimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-35"></div>
      <div className="m-20 relative text-white">
        <h1 className="text-4xl font-bold mb-4 uppercase mt-10">
          A quick Inquiry
        </h1>
        <div className="backdrop-blur-md bg-white/20 p-8 shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <label className="font-montserrat font-light text-md">
              <p>Your Name (required)</p>
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="text-black p-2 pl-2 w-full mt-2 font-montserrat focus:outline-none focus:shadow-xl bg-transparent placeholder-shown:bg-white transition-all duration-300"
              required
              placeholder="Enter your name"
              pattern="[A-Za-z ]{2,}"
              title="Name must contain at least 2"
            />
            {/*Client Email */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Your Email (required)</p>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-black p-2 pl-2 w-full mt-2 font-montserrat focus:outline-none focus:shadow-xl bg-transparent placeholder-shown:bg-white transition-all duration-300"
              required
              placeholder="Enter your email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />
            {/*Client Phone Number */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Your Phone Number</p>
            </label>
            <input
              type="tel"
              name="client_phone"
              value={formData.client_phone}
              onChange={handleChange}
              className="text-black  p-2 pl-2 w-full mt-2 font-montserrat focus:outline-none focus:shadow-xl bg-transparent placeholder-shown:bg-white transition-all duration-300"
              placeholder="Enter your phone number"
              pattern="\d{10,13}"
              title="Enter valid phone number"
            />
            {/*Number of people */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Number of Persons</p>
            </label>
            <input
              type="number"
              name="pax_no"
              value={formData.pax_no}
              onChange={handleChange}
              className="text-black  p-2 pl-2 w-full mt-2 font-montserrat focus:outline-none focus:shadow-xl bg-transparent placeholder-shown:bg-white transition-all duration-300"
              placeholder="Enter number of persons"
              title="Select number of persons"
              min="1"
              step="1"
              required
            />
            {/*Select tour */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-3">Select Tour</p>
            </label>
            <select
              name="tour"
              value={formData.tour || ""}
              onChange={handleChange}
              className={`text-black p-2 w-full mt-2 font-montserrat focus:outline-none focus:shadow-xl transition-all duration-300 ${
                formData.tour ? "bg-transparent" : "bg-white"
              }`}
              required
            >
              <option value="" disabled>
                {loadingTours ? "Loading..." : "Choose a tour"}
              </option>
              {allTours.map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.name}
                </option>
              ))}
            </select>

            {/*Select Bikes */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Select Bike</p>
            </label>
            <select
              name="bike"
              value={formData.bike || ""}
              onChange={handleChange}
              className={`text-black p-2 w-full font-montserrat mt-2 focus:outline-none focus:shadow-xl transition-all duration-300 ${
                formData.bike ? "bg-transparent" : "bg-white"
              }`}
              required
            >
              <option value="" disabled>
                {loadingBikes ? "Loading Bikes" : "Choose a Bike"}
              </option>
              {[
                ...new Map(
                  bikes.map((bike) => [bike.bike_model, bike])
                ).values(),
              ].map((bike) => (
                <option key={bike._id} value={bike._id}>
                  {bike.bike_model}
                </option>
              ))}
              ;
            </select>
            {/*Select Dates */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Select Date</p>
            </label>
            <input
              type="date"
              className={`text-black p-2 pl-2 w-full mt-2 font-montserrat focus:outline-none focus:shadow-xl bg-white transition-all duration-300 focus:bg-transparent
              ${formData.start_date ? "bg-transparent" : "bg-white"}`}
              placeholder="Enter date"
              title="Select tour starting date"
              required
              name="start_date"
              value={formData.start_date || ""}
              onChange={handleChange}
              min={today}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
            />

            {/*Guide Option */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Guide Option</p>
            </label>
            <div className="p-2 font-montserrat font-light text-sm">
              <input
                type="radio"
                name="guide"
                className="radio mr-1"
                value={true}
                checked={formData.guide === true}
                onChange={handleChange}
              />
              With Guide
              <input
                type="radio"
                name="guide"
                value={false}
                checked={formData.guide === false}
                onChange={handleChange}
                className="radio ml-2 mr-1"
              />
              Self-Guided
            </div>
            {/*Tour Inquiry */}
            <label className="font-montserrat font-light text-md">
              <p className="mt-5">Tour Inquiry Details</p>
            </label>
            <textarea
              className="textarea text-black p-2 pl-2 w-full font-montserrat h-[100px] mt-2 focus:outline-none focus:shadow-xl bg-transparent placeholder-shown:bg-white transition-all duration-300"
              placeholder="Inquiry"
              name="enquiry"
              value={formData.enquiry}
              onChange={handleChange}
            ></textarea>
            <button
              type="submit"
              className="btn font-montserrat font-light text-lg flex mt-10 bg-[#fdb913] focus:bg-black focus:text-white hover:shadow-2xl outline-none border-none shadow-none transition-all duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="m-20 relative text-white">
        <h1 className="text-4xl font-bold mb-4 uppercase mt-10">
          contact info
        </h1>
        <div className="font-montserrat  mt-10">
          <h2 className="uppercase font-bold">GOVT. REGISTRATION DETAILS</h2>
          <p className="font-light">
            Company Regd No. 89980/68/69 VAT NO: 600485395 Registered under
            <br />
            Company Act, Kathmandu, Nepal Tourism Industry Division License No:
            1783
          </p>

          <h2 className="uppercase font-bold mt-10">Office Address</h2>
          <p className="font-light">
            PO Box: 21087
            <br />
            Subarnashumshere Marg
            <br />
            Baluwatar, Kathmandu, Nepal
          </p>

          <h2 className="uppercase font-bold mt-10">email us</h2>
          <p className="font-light">
            wildtracksnepal@gmail.com
            <br />
            info@wildtracksnepal.com
          </p>

          <h2 className="uppercase font-bold mt-10">call us</h2>
          <p className="font-light">
            Tel. +977.1.4439590
            <br />
            Mobile: +977.9851054001 <br />
            WhatsApp: +977.9851054001 <br />
            Viber: +977.9851054001
          </p>

          <h2 className="uppercase font-bold mt-10">
            review us on tripadvisor
          </h2>
          <a
            href="https://www.tripadvisor.com/Attraction_Review-g293890-d6696340-Reviews-Wild_Tracks_Nepal_Himalayan_Moto_Journeys-Kathmandu_Kathmandu_Valley_Bagmati_Zone.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:cursor-pointer text-[#fdb913] hover:text-[#fad472] focus:text-[#fdb913]"
          >
            <p>Wild Tracks Nepal</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
