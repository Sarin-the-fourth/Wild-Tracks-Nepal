import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({
  onAddTourClick,
  onAddBikeWizardClick,
  onDetailsClick,
  onManageBikeClick,
  onPendingBookingClick,
  onApproveBookingClick,
  onBookingHistoryClick,
  onEditCardClick,
  onEditTestimonialClick,
  onEditTourDetailsClick,
  onDeleteTourClick,
  onEditItinerary,
  onEditGallery,
}) => {
  const [isTourOpen, setisTourOpen] = useState(false);
  const [isBikeOpen, setisBikeOpen] = useState(false);
  const [isInquiryOpen, setisInquiryOpen] = useState(false);
  const [isHomepageOpen, setisHomepageOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[rgb(34,40,49)] hidden md:block">
      <div className="ml-5 mt-5 flex items-center space-x-2">
        <img className="w-12 h-12" src="./wtalogo1.ico" />
        <h1 className="uppercase font-bebas text-white text-3xl">
          wildtracksnepal
        </h1>
      </div>

      <div className="mt-20 ml-5 font-montserrat text-[#dddd]">
        <legend className="opacity-70 font-light mb-2">Menu</legend>
        <ul className="cursor-pointer pr-2">
          <li
            className="font-semibold hover:bg-[black] p-2 rounded-md"
            onClick={() => setisHomepageOpen(!isHomepageOpen)}
          >
            <Link to="#"> Homepage</Link>
          </li>
          {isHomepageOpen && (
            <ul className="ml-10 text-md mb-2 space-y-2 mt-1">
              <li
                className="hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  onEditCardClick();
                }}
              >
                <Link to="#">Edit Cards</Link>
              </li>
              <li
                className="hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  onEditTestimonialClick();
                }}
              >
                <Link to="#">Edit Testimonials</Link>
              </li>
              <li
                className="hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  onEditGallery();
                }}
              >
                <Link to="#">Edit Gallery</Link>
              </li>
            </ul>
          )}

          <li
            className="font-semibold hover:bg-[black] p-2 rounded-md"
            onClick={() => setisTourOpen(!isTourOpen)}
          >
            Tours
          </li>
          {isTourOpen && (
            <ul className="ml-10 text-md mb-2 space-y-2 mt-1">
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddTourClick();
                  }}
                >
                  Add Tours
                </Link>
              </li>
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditTourDetailsClick();
                  }}
                >
                  Edit Tour details
                </Link>
              </li>

              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditItinerary();
                  }}
                >
                  Edit Itinerary
                </Link>
              </li>

              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteTourClick();
                  }}
                >
                  Delete Tours
                </Link>
              </li>
            </ul>
          )}

          <li
            className="font-semibold hover:bg-[black] p-2 rounded-md"
            onClick={() => setisBikeOpen(!isBikeOpen)}
          >
            Bikes
          </li>
          {isBikeOpen && (
            <ul className="ml-10 text-md mb-2 space-y-2 mt-1">
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddBikeWizardClick();
                  }}
                >
                  Add New Bikes
                </Link>
              </li>
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onManageBikeClick();
                  }}
                >
                  Manage Bikes
                </Link>
              </li>
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onDetailsClick();
                  }}
                >
                  Details
                </Link>
              </li>
            </ul>
          )}

          <li
            className="font-semibold hover:bg-[black] p-2 rounded-md"
            onClick={() => setisInquiryOpen(!isInquiryOpen)}
          >
            Booking Inquiries
          </li>
          {isInquiryOpen && (
            <ul className="ml-10 text-md mb-2 space-y-2 mt-1">
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPendingBookingClick();
                  }}
                >
                  Pending
                </Link>
              </li>
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onApproveBookingClick();
                  }}
                >
                  Approved
                </Link>
              </li>
              <li className="hover:text-white">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBookingHistoryClick();
                  }}
                >
                  Booking History
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
