import { useEffect, useState } from "react";
import "./Gallery.scss";

import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";
import { useAdminStore } from "../../Store/useAdminStore";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const { fetchHomepage, homepage } = useAdminStore();

  useEffect(() => {
    fetchHomepage();
  }, []);

  useEffect(() => {
    if (homepage?.gallery) {
      setImages(homepage.gallery);
    }
  }, [homepage]);

  const openLightbox = (src) => {
    basicLightbox.create(`<img src="${src}" alt="preview" />`).show();
  };

  return (
    <>
      <h1 className="pt-10 pb-10 flex justify-center items-center text-6xl font-bebas">
        Gallery
      </h1>
      <div className="Gallery pb-10 grid grid-cols-3 gap-4 uppercase justify-items-center font-bebas">
        {images.map((item, index) => {
          const transformedUrl = item.url.replace(
            "/upload/",
            "/upload/w_1200,h_900,c_fill/"
          );
          return (
            <div
              key={index}
              data-location={item.name}
              onClick={() => openLightbox(item.url)}
              className="cursor-pointer"
            >
              <img
                src={transformedUrl}
                alt={item.name}
                className="w-[400px] h-[250px] rounded shadow-md"
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Gallery;
