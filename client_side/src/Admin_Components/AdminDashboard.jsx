import { useState } from "react";
import Searchbar from "./Searchbar";
import Sidebar from "./Sidebar";
import TourWizard from "./Tour/TourWizard";
import Welcomepage from "./Welcomepage";
import Details from "./Bike/Details";
import Managebike from "./Bike/Managebike";
import AddBikeWizard from "./Bike/Addbikewizard";
import Pending from "./Bookings/Pending";
import Approved from "./Bookings/Approved";
import BookingHistory from "./Bookings/BookingHistory";
import EditCard from "./Homepage/Editcard";
import EditTestimonials from "./Homepage/Edittestimonials";
import EditTourDetails from "./Tour/EditTourDetails";
import DeleteTour from "./Tour/DeleteTour";
import EditItinerary from "./Tour/EditItinerary";
import EditGallery from "./Homepage/Editgallery";

const AdminDashboard = () => {
  const [showTourForm, setShowTourForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showBikeWizard, setShowBikeWizard] = useState(false);
  const [showBikeDetails, setShowBikeDetails] = useState(false);
  const [showManageBike, setShowManageBike] = useState(false);
  const [showPendingBooking, setshowPendingBooking] = useState(false);
  const [showApproveBooking, setshowApproveBooking] = useState(false);
  const [showBookingHistory, setshowBookingHistory] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [showEditTestimonials, setShowTestimonials] = useState(false);
  const [showEditTourDetails, setShowEditTourDetials] = useState(false);
  const [showDeleteTour, setShowDeleteTour] = useState(false);
  const [showEditItinerary, setShowEditItinerary] = useState(false);
  const [showEditGallery, setShowEditGallery] = useState(false);

  const handleSidebarItemClick = () => {
    setShowWelcome(false);
  };

  const handleAddTourClick = () => {
    setShowTourForm(true);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowBikeDetails(false);
    setShowManageBike(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setshowBookingHistory(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleAddBikeWizardClick = () => {
    setShowBikeWizard(true);
    setShowTourForm(false);
    setShowWelcome(false);
    setShowBikeDetails(false);
    setShowManageBike(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setshowBookingHistory(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleBikeDetails = () => {
    setShowBikeDetails(true);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowManageBike(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setshowBookingHistory(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleManageBike = () => {
    setShowManageBike(true);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setshowBookingHistory(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handlePendingBooking = () => {
    setshowPendingBooking(true);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setshowApproveBooking(false);
    setshowBookingHistory(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleApproveBooking = () => {
    setshowApproveBooking(true);
    setshowPendingBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setshowBookingHistory(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleBookingHistory = () => {
    setshowBookingHistory(true);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowEditCard(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleEditCard = () => {
    setShowEditCard(true);
    setshowBookingHistory(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowTestimonials(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleTestimonials = () => {
    setShowTestimonials(true);
    setShowEditCard(false);
    setshowBookingHistory(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowEditTourDetials(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleEditTourDetails = () => {
    setShowEditTourDetials(true);
    setShowTestimonials(false);
    setShowEditCard(false);
    setshowBookingHistory(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowDeleteTour(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleDeleteTour = () => {
    setShowDeleteTour(true);
    setShowEditTourDetials(false);
    setShowTestimonials(false);
    setShowEditCard(false);
    setshowBookingHistory(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowEditItinerary(false);
    setShowEditGallery(false);
  };

  const handleEditItinerary = () => {
    setShowEditItinerary(true);
    setShowDeleteTour(false);
    setShowEditTourDetials(false);
    setShowTestimonials(false);
    setShowEditCard(false);
    setshowBookingHistory(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
    setShowEditGallery(false);
  };

  const handleEditGallery = () => {
    setShowEditGallery(true);
    setShowEditItinerary(false);
    setShowDeleteTour(false);
    setShowEditTourDetials(false);
    setShowTestimonials(false);
    setShowEditCard(false);
    setshowBookingHistory(false);
    setshowPendingBooking(false);
    setshowApproveBooking(false);
    setShowManageBike(false);
    setShowBikeDetails(false);
    setShowTourForm(false);
    setShowBikeWizard(false);
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-[#393e46] grid grid-cols-[290px_1fr]">
      <Sidebar
        onSidebarItemClick={handleSidebarItemClick}
        onAddTourClick={handleAddTourClick}
        onAddBikeWizardClick={handleAddBikeWizardClick}
        onDetailsClick={handleBikeDetails}
        onManageBikeClick={handleManageBike}
        onPendingBookingClick={handlePendingBooking}
        onApproveBookingClick={handleApproveBooking}
        onBookingHistoryClick={handleBookingHistory}
        onEditCardClick={handleEditCard}
        onEditTestimonialClick={handleTestimonials}
        onEditTourDetailsClick={handleEditTourDetails}
        onDeleteTourClick={handleDeleteTour}
        onEditItinerary={handleEditItinerary}
        onEditGallery={handleEditGallery}
      />
      <div className="flex flex-col p-4 space-y-4">
        <Searchbar />
        {showTourForm && <TourWizard onClose={() => setShowTourForm(false)} />}
        {showBikeWizard && (
          <AddBikeWizard onClose={() => setShowBikeWizard(false)} />
        )}
        {showBikeDetails && (
          <Details onClose={() => setShowBikeDetails(false)} />
        )}
        {showManageBike && (
          <Managebike onClose={() => setShowManageBike(false)} />
        )}
        {showPendingBooking && (
          <Pending onClose={() => setshowPendingBooking(false)} />
        )}
        {showApproveBooking && (
          <Approved onClose={() => setshowApproveBooking(false)} />
        )}
        {showBookingHistory && (
          <BookingHistory onClose={() => setshowBookingHistory(false)} />
        )}
        {showEditCard && <EditCard onClose={() => setShowEditCard(false)} />}
        {showEditTestimonials && (
          <EditTestimonials onClose={() => setShowTestimonials(false)} />
        )}
        {showEditTourDetails && (
          <EditTourDetails onClose={() => setShowEditTourDetials(false)} />
        )}
        {showDeleteTour && (
          <DeleteTour onClose={() => setShowDeleteTour(false)} />
        )}
        {showEditItinerary && (
          <EditItinerary onClose={() => setShowEditItinerary(false)} />
        )}
        {showEditGallery && (
          <EditGallery onClose={() => setShowEditGallery(false)} />
        )}
        {showWelcome && !showTourForm && <Welcomepage />}
      </div>
    </div>
  );
};

export default AdminDashboard;
