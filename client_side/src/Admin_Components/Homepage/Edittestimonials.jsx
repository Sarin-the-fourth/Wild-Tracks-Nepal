import { useEffect } from "react";
import { useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";

const EditTestimonials = () => {
  const { updateTestimonials, fetchHomepage, homepage } = useAdminStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHomepage();
  }, []);

  useEffect(() => {
    if (homepage && Array.isArray(homepage.testimonial)) {
      setTestimonial1(homepage.testimonial[0] || "");
      setTestimonial2(homepage.testimonial[1] || "");
      setTestimonial3(homepage.testimonial[2] || "");
    }
  }, [homepage]);

  const [testimonial1, setTestimonial1] = useState("");
  const [testimonial2, setTestimonial2] = useState("");
  const [testimonial3, setTestimonial3] = useState("");

  const handleupdateTestimonials = async (UpdateData) => {
    const { homepageId, testimonials } = UpdateData;
    try {
      setLoading(true);
      await updateTestimonials(homepageId, testimonials);
      console.log("Data sent to updateTestimonials:", UpdateData);
    } catch (err) {
      toast.error("Failed to update testimonials.");
      console.error("Error updating testimonials:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <h2 className="text-center text-white mt-5 font-bebas text-6xl">
          Edit Testimonials
        </h2>

        <div className="m-6 space-y-3">
          <label className="text-white font-montserrat text-lg mb-2 block">
            Testimonial 1:
          </label>
          <input
            type="text"
            value={testimonial1}
            onChange={(e) => setTestimonial1(e.target.value)}
            className="w-full p-2 bg-white focus:outline-none hover:outline-none font-montserrat rounded"
          />

          <label className="text-white font-montserrat text-lg mb-2 block">
            Testimonial 2:
          </label>
          <input
            type="text"
            value={testimonial2}
            onChange={(e) => setTestimonial2(e.target.value)}
            className="w-full bg-white focus:outline-none hover:outline-none font-montserrat p-2 rounded"
          />

          <label className="text-white font-montserrat text-lg mb-2 block">
            Testimonial 3:
          </label>
          <input
            type="text"
            value={testimonial3}
            onChange={(e) => setTestimonial3(e.target.value)}
            className="w-full bg-white focus:outline-none hover:outline-none font-montserrat p-2 rounded"
          />

          <div className="flex pt-2 justify-end">
            <button
              onClick={() => {
                if (homepage && homepage._id) {
                  handleupdateTestimonials({
                    homepageId: homepage._id,
                    testimonials: [testimonial1, testimonial2, testimonial3],
                  });
                }
              }}
              disabled={loading}
              className="px-6 py-2 mt-5 font-montserrat text-right  bg-gray-600 text-white font-bold rounded hover:bg-[#fdb913] transition mr-2"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTestimonials;
