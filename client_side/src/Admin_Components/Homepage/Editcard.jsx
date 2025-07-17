import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";
import { toast } from "react-toastify";

const EditCard = () => {
  const { fetchAllTours, tour, updateCard, fetchHomepage, homepage } =
    useAdminStore();
  const [card1, setCard1] = useState("");
  const [card2, setCard2] = useState("");
  const [card3, setCard3] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllTours();
    fetchHomepage();
  }, []);

  useEffect(() => {
    if (homepage && Array.isArray(homepage.card)) {
      setCard1(homepage.card[0] || "");
      setCard2(homepage.card[1] || "");
      setCard3(homepage.card[2] || "");
    }
  }, [homepage]);

  const handleupdateCard = async (UpdateData) => {
    const { homepageId, card } = UpdateData;
    try {
      setLoading(true);
      await updateCard(homepageId, card);
      console.log("Data sent to updateCard:", UpdateData);
    } catch (err) {
      toast.error("Failed to update card.");
      console.error("Error updating card:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <h1 className="text-center text-white mt-5 font-bebas text-6xl">
          Add Card
        </h1>
        <div className="m-6 space-y-3">
          <label className="text-white font-montserrat text-lg mb-2 block">
            Card 1:
          </label>
          <select
            value={card1}
            onChange={(e) => setCard1(e.target.value)}
            className="w-full p-3 rounded bg-white text-gray-800 font-montserrat focus:outline-none"
          >
            <option value="">Select a tour</option>
            {tour &&
              tour.map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.name}
                </option>
              ))}
          </select>

          <label className="text-white font-montserrat text-lg mb-2 block">
            Card 2:
          </label>
          <select
            value={card2}
            onChange={(e) => setCard2(e.target.value)}
            className="w-full p-3 rounded bg-white text-gray-800 font-montserrat focus:outline-none"
          >
            <option value="">Select a tour</option>
            {tour &&
              tour.map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.name}
                </option>
              ))}
          </select>

          <label className="text-white font-montserrat text-lg mb-2 block">
            Card 3:
          </label>
          <select
            value={card3}
            onChange={(e) => setCard3(e.target.value)}
            className="w-full p-3 rounded bg-white text-gray-800 font-montserrat focus:outline-none"
          >
            <option value="">Select a tour</option>
            {tour &&
              tour.map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.name}
                </option>
              ))}
          </select>

          <button
            onClick={() => {
              if (homepage && homepage._id) {
                handleupdateCard({
                  homepageId: homepage._id,
                  card: [card1, card2, card3].filter((id) => id),
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
    </>
  );
};
export default EditCard;
