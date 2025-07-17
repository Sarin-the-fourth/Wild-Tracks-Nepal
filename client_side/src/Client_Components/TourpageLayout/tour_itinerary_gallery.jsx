import { useTourStore } from "../../Store/useTourStore";
import "./gallery.scss";
import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

const Itinerary_Gallery = () => {
  const openLightbox = (src) => {
    basicLightbox.create(`<img src="${src}" alt="preview" />`).show();
  };

  const { itinerary } = useTourStore();
  const { tour } = useTourStore();

  return (
    <div
      className="relative grid grid-cols-2 gap-5 mt-10 bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${tour?.cover_image})` }}
    >
      {/*Itinerary*/}
      <div className="absolute inset-0 bg-white opacity-75 z-0"></div>

      <div className="m-15 z-1">
        <h1 className="flex justify-center text-[#fdb913] text-5xl font-bebas">
          Trip Itinerary
        </h1>

        <div className="mt-10 text-justify font-montserrat">
          {itinerary.map((item) => (
            <div key={item.day} className="mt-5">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-xl">Day {item.day}:</h2>
                <h2 className="font-bold text-xl">{item.title}</h2>
              </div>
              <p className="font-light">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/*Gallery*/}
      <div>
        <h1 className="mt-15 pb-10 flex justify-center items-center text-5xl font-bebas">
          Recent & Previous Trips
        </h1>
        <div className="Gallery pb-10 gap-3 font-bebas">
          {tour?.gallery_images?.map((img, index) => {
            const transformedUrl = img.replace(
              "/upload/",
              "/upload/w_1200,h_900,c_fill/"
            );
            return (
              <div
                key={index}
                onClick={() => openLightbox(img)}
                className="cursor-pointer"
              >
                <img
                  src={transformedUrl}
                  alt={`Gallery ${index}`}
                  className="w-30 h-10 object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Itinerary_Gallery;
