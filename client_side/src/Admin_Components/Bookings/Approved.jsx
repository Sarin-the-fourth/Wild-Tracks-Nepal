import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";
import { useBikeStore } from "../../Store/useBikeStore";

const Approved = () => {
  const {
    fetchApprovedBookings,
    bookings,
    respondBookings,
    editBooking,
    freeAssignedBike,
  } = useAdminStore();
  const { fetchBikes, bikes } = useBikeStore();
  const [loadingStates, setLoadingStates] = useState({});
  const [confirmedStates, setConfirmedStates] = useState({});
  const [editpage, seteditpage] = useState(false);
  const [blur, setblur] = useState(false);

  const [editBookingData, setEditBookingData] = useState(null);

  const handleEdit = (booking) => {
    setblur(true);
    setEditBookingData(booking);
    seteditpage(true);
    fetchBikes();
  };

  const handleCancel = async (bookingID) => {
    setLoadingStates((prev) => ({ ...prev, [bookingID]: true }));
    try {
      await respondBookings(bookingID, "cancelled");
      await freeAssignedBike(bookingID, "cancelled");
      await fetchApprovedBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [bookingID]: false }));
    }
  };

  const handleConfirm = async (bookingId) => {
    setLoadingStates((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await respondBookings(bookingId, "approved");
      setConfirmedStates((prev) => ({ ...prev, [bookingId]: true }));
      await fetchApprovedBookings();
    } catch (err) {
      console.error("Error confirming booking:", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  return (
    <>
      {blur && (
        <div className="fixed inset-0 z-9 backdrop-blur-lg w-full h-full"></div>
      )}

      {editpage && editBookingData && (
        <div className="fixed inset-0 bg-gray-600 shadow-2xl min-h-fit z-10 overflow-auto rounded m-10">
          <h3 className="text-center text-white mt-5 font-bebas text-6xl">
            Edit Booking
          </h3>

          <div className="m-6 space-y-3">
            <label className="text-white font-montserrat text-lg mb-2 block">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 font-montserrat border bg-white border-gray-300 rounded-md focus:outline-none focus:border-2"
              value={
                editBookingData.start_date
                  ? new Date(editBookingData.start_date)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditBookingData((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
            />

            <label className="text-white font-montserrat text-lg mb-2 block">
              Pax No
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 font-montserrat border bg-white border-gray-300 rounded-md focus:outline-none focus:border-2"
              value={editBookingData.pax_no}
              onChange={(e) =>
                setEditBookingData((prev) => ({
                  ...prev,
                  pax_no: e.target.value,
                }))
              }
            />

            <label className="text-white font-montserrat text-lg mb-2 block">
              Assign Bike
            </label>
            <select
              className="w-full p-5 rounded bg-gray-800 text-white font-montserrat focus:outline-none"
              value={editBookingData.assigned_bike}
              onChange={(e) =>
                setEditBookingData((prev) => ({
                  ...prev,
                  assigned_bike: e.target.value,
                }))
              }
            >
              <option value="">-- Select a Bike --</option>
              {bikes.map((bike) => (
                <option key={bike._id} value={bike._id}>
                  {bike.bike_number} ({bike.bike_model})
                </option>
              ))}
            </select>

            <div className="m-6 text-right">
              <button
                className="px-6 py-2 font-montserrat bg-[#fdb913] text-black font-bold rounded hover:bg-yellow-400 transition mr-2"
                onClick={async () => {
                  try {
                    await editBooking(editBookingData._id, {
                      start_date: editBookingData.start_date,
                      pax_no: editBookingData.pax_no,
                      assigned_bike: editBookingData.assigned_bike,
                    });
                    seteditpage(false);
                    setblur(false);
                    fetchApprovedBookings(); // refresh the list
                  } catch (err) {
                    console.error("Edit failed:", err);
                  }
                }}
              >
                Save Changes
              </button>
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold"
                onClick={() => {
                  seteditpage(false), setblur(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <h2 className="text-5xl text-center font-bebas font-bold text-white mb-6">
          Approve Bookings
        </h2>
        {Array.isArray(bookings) &&
          bookings.map(
            (booking, index) => (
              console.log("Booking status:", booking._id, booking.status),
              (
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
                          Assigned Bike
                        </td>
                        <td className="p-4 border-b border-gray-600">
                          {console.log(
                            "Assigned bikes:",
                            booking.assigned_bike
                          )}
                          {Array.isArray(booking.assigned_bike) &&
                          booking.assigned_bike.length > 0
                            ? booking.assigned_bike.map((bike, idx) => (
                                <div key={idx}>
                                  {bike.bike_number} ({bike.bike_model})
                                </div>
                              ))
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
                            ? new Date(booking.end_date)
                                .toISOString()
                                .split("T")[0]
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
                        <td
                          colSpan="2"
                          className="p-4 border-t border-gray-600 "
                        >
                          <button
                            onClick={() => handleConfirm(booking._id)}
                            className={`px-6 py-2 font-montserrat bg-gray-600 text-white font-bold rounded transition mr-2 ${
                              confirmedStates[booking._id] ||
                              booking.status === "confirmed"
                                ? "cursor-not-allowed bg-green-800"
                                : "hover:bg-[#fdb913]"
                            }`}
                            disabled={
                              loadingStates[booking._id] ||
                              confirmedStates[booking._id] ||
                              booking.status === "confirmed"
                            }
                          >
                            {loadingStates[booking._id]
                              ? "Loading..."
                              : booking.status === "confirmed"
                              ? "Tour Confirmed!"
                              : "Confirm"}
                          </button>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="px-6 py-2 font-montserrat text-left bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition mr-2"
                          >
                            Edit Booking
                          </button>
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="px-6 py-2 font-montserrat text-left bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            )
          )}
      </div>
    </>
  );
};

export default Approved;
