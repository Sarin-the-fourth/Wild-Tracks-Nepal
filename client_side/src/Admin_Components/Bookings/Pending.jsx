import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";
import { useBikeStore } from "../../Store/useBikeStore";

const Pending = () => {
  const { fetchPendingBookings, deletependingbooking, bookings, assignBikes } =
    useAdminStore();
  const { fetchBikes, bikes } = useBikeStore();
  const [Approvepage, setApprovepage] = useState(false);
  const [blur, setblur] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBikes, setSelectedBikes] = useState([]);
  const [currentBookingDates, setCurrentBookingDates] = useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    fetchBikes();
    fetchPendingBookings();
  }, []);

  const handleBikeSelection = (event) => {
    const options = event.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedBikes(selected);
  };

  const openApproveModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedBikes([]);
    setApprovepage(true);
    setblur(true);
    setCurrentBookingDates({
      start: new Date(booking.start_date),
      end: new Date(booking.end_date),
    });
  };

  const handleAssignBikes = async () => {
    if (!selectedBooking || selectedBikes.length === 0) return;
    // Find selected bike objects from bikes array
    const selectedBikeObjects = bikes.filter((bike) =>
      selectedBikes.includes(bike.bike_number)
    );
    // Check if any selected bike has condition "Needs Repair"
    const needsRepair = selectedBikeObjects.some(
      (bike) => bike.condition === "Needs Repair"
    );
    if (needsRepair) {
      const proceed = window.confirm(
        "One or more of the selected bikes need repair. Are you sure you want to assign them?"
      );
      if (!proceed) {
        return;
      }
    }
    try {
      // assignBikes expects booking ID and an array of bike numbers
      await assignBikes(selectedBooking._id, selectedBikes);
      // After successful assignment, reset modal and selection state
      setApprovepage(false);
      setblur(false);
      setSelectedBooking(null);
      setSelectedBikes([]);
    } catch (error) {
      // Optionally handle error (e.g., show notification)
      console.error("Failed to assign bikes:", error);
    }
  };

  const handleDeleteBooking = async (booking) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the booking of ${booking.client_name}?`
    );
    if (!confirmDelete) return;
    try {
      await deletependingbooking(booking._id);
      await fetchPendingBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <>
      {Approvepage && (
        <div className="fixed inset-0 bg-gray-600 shadow-2xl min-h-fit z-10 overflow-auto rounded m-10">
          <button
            className=" absolute top-2 right-4 rounded text-xl text-white hover:text-2xl focus:text-yellow-400 font-montserrat transition-all duration-300"
            onClick={() => {
              setApprovepage(false);
              setblur(false);
              setSelectedBooking(null);
              setSelectedBikes([]);
            }}
          >
            X
          </button>

          <h1 className="text-center text-white mt-5 font-bebas text-6xl">
            Assign Bikes
          </h1>
          <div className="m-6">
            <label className="text-white font-montserrat text-lg mb-2 block">
              Select Bikes:
            </label>
            <select
              multiple
              value={selectedBikes}
              onChange={handleBikeSelection}
              className="w-full p-5 space-y-2 rounded bg-gray-800 text-white font-montserrat focus:outline-none"
            >
              {bikes &&
                bikes
                  .filter((bike) => {
                    if (!bike.bookings || bike.bookings.length === 0)
                      return true;

                    return !bike.bookings.some((booking) => {
                      if (booking.status !== "approved") return false;

                      const start = new Date(booking.start_date);
                      const end = new Date(booking.end_date);

                      return (
                        start <= currentBookingDates.end &&
                        end >= currentBookingDates.start
                      ); // Overlapping date range
                    });
                  })
                  .map((bike) => (
                    <option key={bike.bike_number} value={bike.bike_number}>
                      {bike.bike_brand} - {bike.bike_model} - {bike.bike_number}
                    </option>
                  ))}
            </select>
          </div>
          <div className="m-6 text-right">
            <button
              onClick={handleAssignBikes}
              className="px-6 py-2 font-montserrat bg-[#fdb913] text-black font-bold rounded hover:bg-yellow-400 transition"
              disabled={selectedBikes.length === 0}
            >
              Assign Selected Bikes
            </button>
          </div>
        </div>
      )}

      {blur && (
        <div className="fixed inset-0 z-9 backdrop-blur-lg w-full h-full"></div>
      )}

      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <h2 className="text-5xl text-center font-bebas font-bold text-white mb-6">
          Pending Bookings
        </h2>
        {Array.isArray(bookings) &&
          bookings.map((booking, index) => (
            <div className="overflow-x-auto" key={booking.id || index}>
              <table className="w-full m-2 font-montserrat text-left text-white border border-gray-600">
                <thead>
                  <tr>
                    <th
                      className="text-left p-4 border-b-2 bg-gray-800 border-gray-600 text-white text-lg"
                      colSpan="2"
                    >
                      Booking Number: {index + 1}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Name
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.client_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Email
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.email}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Phone
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.client_phone}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Pax No
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.pax_no}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Booked Tour
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.tour?.name || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Selected Bikes
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.bike?.[0]
                        ? `${booking.bike[0].bike_brand}, ${booking.bike[0].bike_model}`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Start Date
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.start_date
                        ? new Date(booking.start_date)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      End Date
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.end_date
                        ? new Date(booking.end_date).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Guide
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.guide ? "Guided" : "Self-Guided"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-600 font-semibold">
                      Tour Inquiry
                    </td>
                    <td className="p-4 border-b border-gray-600">
                      {booking.enquiry}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="p-4 border-t border-gray-600 ">
                      <button
                        onClick={() => openApproveModal(booking)}
                        className="px-6 py-2 font-montserrat text-right  bg-gray-600 text-white font-bold rounded hover:bg-[#fdb913] transition mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking)}
                        className="px-6 py-2 font-montserrat text-left bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </>
  );
};

export default Pending;
