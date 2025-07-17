import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useBikeStore } from "../../store/useBikeStore";

const Book = () => {
  const [showGarage, setShowGarage] = useState(false);
  const [blur, setblur] = useState(false);

  const [loading, setLoading] = useState(false);
  const { bikes, fetchBikes } = useBikeStore();

  useEffect(() => {
    const loadBikes = async () => {
      setLoading(true);
      await fetchBikes();
      console.log(bikes);
      setLoading(false);
    };
    loadBikes();
  }, []);

  return (
    <>
      {showGarage && (
        <div className="fixed inset-0 bg-gray-100 shadow-2xl z-10 overflow-auto rounded m-10">
          <div className="space-y-5">
            <h1 className="text-center mt-5 font-bebas text-6xl">Garage</h1>
            <div className="grid grid-cols-2">
              {[
                ...new Map(
                  bikes.map((item) => [item.bike_model, item])
                ).values(),
              ].map((items) => {
                const transformedUrl = items.bike_image.replace(
                  "/upload/",
                  "/upload/w_1200,h_900,c_fit/"
                );
                return (
                  <div className="ml-5 flex flex-col items-center justify-center space-y-2">
                    <img
                      className="w-full h-70 max-w-[300px]"
                      src={transformedUrl}
                      alt="bike_image"
                    />
                    <h1 className="font-montserrat font-bold text-lg">
                      The {items.bike_model}
                    </h1>
                    <p className="font-montserrat font-normal text-medium">
                      {items.bike_description}
                    </p>
                    <p className="font-montserrat mb-10 font-semibold text-medium">
                      Price/day: {items.bike_price}$
                    </p>
                  </div>
                );
              })}
            </div>
            <button
              className=" absolute top-2 right-4 rounded text-xl text-black hover:text-2xl focus:text-yellow-400 font-montserrat transition-all duration-300"
              onClick={() => {
                setShowGarage(false);
                setblur(false);
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
      {blur && (
        <div className="fixed inset-0 z-5 backdrop-blur-2xl w-full h-full"></div>
      )}
      <div className="min-h-30">
        <div className="mt-20 grid grid-cols-2">
          <button
            onClick={() => {
              setShowGarage(true);
              setblur(true);
            }}
            className="flex justify-center font-montserrat font-light text-xl "
          >
            <p className="border-0 rounded-md pl-5 pr-5 pt-1.5 pb-1.5 bg-[#fdb913] hover:bg-black hover:text-white">
              View Garage
            </p>
          </button>

          <Link
            to="/contactus"
            className="flex justify-center font-montserrat font-light text-xl "
          >
            <p className=" rounded-md pl-5 pr-5 pt-1.5 pb-1.5 bg-[#fdb913] hover:bg-black hover:text-white">
              Send Trip Inquiry
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Book;
