import { useEffect } from "react";
import { useHomeStore } from "../../Store/useHomeStore";

const Divider = () => {
  const { fetchHomepage, homepage } = useHomeStore();

  useEffect(() => {
    fetchHomepage();
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ backgroundColor: "#fdb913" }}
    >
      <h1
        className="text-6xl font-bebas text-bold mt-15 mb-10"
        style={{ letterSpacing: 1 }}
      >
        Testimonials
      </h1>
      <div className="font-pt-sans-narrow text-center pl-10 pr-10 text-2xl mb-5">
        {homepage?.testimonial?.length > 0 && (
          <>
            {homepage.testimonial.slice(0, 3).map((testimonial, index) => (
              <h2 key={index} className="mb-10">
                {testimonial}
              </h2>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Divider;
