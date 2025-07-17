import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";

const EditGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setloading] = useState(false);

  const { addGalleryImage } = useAdminStore();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!reader.result) return;
        setGalleryItems((prev) => [
          ...prev,
          { url: reader.result.trim(), name: "" },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (galleryItems.length === 0) return;

    const hasInvalid = galleryItems.some(
      (item) => item.name.trim() === "" || !item.url?.startsWith("data:image")
    );

    if (hasInvalid) {
      toast.error("Each image must have a name and valid image file.");
      return;
    }

    setloading(true);
    try {
      await addGalleryImage(galleryItems);
      setGalleryItems([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <h1 className="text-center text-white mt-5 font-bebas text-6xl">
          Edit Gallery
        </h1>

        <div className="m-6 space-y-3">
          <label className="text-white font-montserrat text-lg mb-2 block">
            Add Image
          </label>
          <div>
            <input
              type="file"
              id="customFileInput"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="customFileInput"
              className="inline-block px-6 py-2 rounded font-montserrat font-light bg-gray-600 text-white hover:bg-[#fdb913] hover:text-black transition-transform duration-300 transform hover:scale-102 focus:scale-98 cursor-pointer"
            >
              Upload Image
            </label>
          </div>

          {galleryItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mt-4">
              <div className="w-25 h-25 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-sm text-gray-500">No Image</span>
                )}
              </div>
              <input
                type="text"
                placeholder="Enter place name"
                value={item.name}
                onChange={(e) => {
                  const updatedItems = [...galleryItems];
                  updatedItems[index].name = e.target.value;
                  setGalleryItems(updatedItems);
                }}
                className="flex-1 p-2 bg-white rounded-md border focus:outline-none font-montserrat"
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-[#fdb913]"
              } text-md font-montserrat text-white px-6 py-2 rounded-md transition-colors duration-200 focus:outline-none`}
            >
              {loading ? "Uploading" : "Done"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGallery;
