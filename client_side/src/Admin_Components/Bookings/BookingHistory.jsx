import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";

const BookingHistory = () => {
  const { fetchAllBookings, bookings } = useAdminStore();
  const [openTablePage, setopenTablePage] = useState();
  const [tableData, settableData] = useState(null);
  const [blur, setblur] = useState(false);

  const handleopenTable = (bookings) => {
    setopenTablePage(true);
    settableData(bookings);
    setblur(true);
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <>
      {blur && (
        <div className="fixed inset-0 z-9 backdrop-blur-lg w-full h-full"></div>
      )}

      {openTablePage && tableData && (
        <div className="fixed inset-0 bg-[rgb(34,40,49)]  shadow-2xl min-w-fit min-h-fit z-10 overflow-auto rounded m-10">
          <h3 className="text-6xl mt-5 text-white text-center font-bebas mb-4">
            Booking Information
          </h3>
          <table className="w-full m-2 font-montserrat text-left text-white border-2 border-gray-600">
            <tbody>
              <tr>
                <td
                  className="p-4 border-2
                border-black bg-gray-800 font-semibold"
                >
                  Client Name
                </td>
                <td className="p-4 mr-2 border-2 border-black">
                  {tableData.client_name}
                </td>
              </tr>
              <tr>
                <td
                  className="p-4 bg-gray-800 border-2
                border-black font-semibold"
                >
                  Email
                </td>
                <td className="p-4 border-2 border-black">{tableData.email}</td>
              </tr>
              <tr>
                <td
                  className="p-4 bg-gray-800 border-2
                border-black font-semibold"
                >
                  Phone Number
                </td>
                <td className="p-4 border-2 border-black">
                  {tableData.client_phone}
                </td>
              </tr>
              <tr>
                <td
                  className="p-4 bg-gray-800 border-2
                border-black font-semibold"
                >
                  Tour
                </td>
                <td className="p-4 border-2 border-black">
                  {tableData.tour?.name || "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  className="p-4 bg-gray-800 border-2
                border-black font-semibold"
                >
                  Pax No.
                </td>
                <td className="p-4 border-2 border-black">
                  {tableData.pax_no || "N/A"}
                </td>
              </tr>
              <tr>
                <td
                  className="p-4 bg-gray-800 border-2
                border-black font-semibold"
                >
                  Date
                </td>
                <td className="p-4 border-2 border-black">
                  {new Date(tableData.start_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
              <tr>
                <td
                  className="p-4 bg-gray-800 border-2
                border-black font-semibold"
                >
                  Status
                </td>
                <td className="p-4 border-2 border-black">
                  {tableData.status}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <button
              onClick={() => {
                setopenTablePage(false);
                settableData(null);
                setblur(false);
              }}
              className="bg-red-600 font-montserrat font-light m-2 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <h2 className="text-5xl text-center font-bebas font-bold text-white mb-6">
          Booking History
        </h2>
        {Array.isArray(bookings) &&
          bookings.map((booking, index) => (
            <div className="mt-4 overflow-x-auto" key={booking._id || index}>
              <div
                onClick={() => handleopenTable(booking)}
                className="bg-gray-800 text-white border hover:text-xl transition-all duration-300 text-left text-lg font-semibold p-4 rounded cursor-pointer"
              >
                Booking Details: {index + 1} - {booking.client_name}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default BookingHistory;
