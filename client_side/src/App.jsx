import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./Client_Components/Footer";
import HomeLayout from "./Client_Components/HomeLayout/HomeLayout";
import { Bounce, ToastContainer } from "react-toastify";
import AboutUs from "./Client_Components/AboutUsLayout/AboutUs";
import AdminLogin from "./Admin_Components/AdminLoginLayout/AdminLogin";
import Contact from "./Client_Components/ContactUsLayout/Contact";
import Tour from "./Client_Components/TourpageLayout/tourpage";
import { useTourStore } from "./Store/useTourStore";
import { useEffect } from "react";
import NavBar from "./Client_Components/Navbar/NavBar";
import AdminDashboard from "./Admin_Components/AdminDashboard";
import { useAuthStore } from "./Store/useAuthStore";

function App() {
  const location = useLocation();
  const isadminroute =
    location.pathname.startsWith("/admin") || location.pathname === "/login";

  const { getTourNepal, getTourIndia, loadingNepal, loadingIndia } =
    useTourStore();

  const { checkAuth, loadingCheckAuth, admin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    getTourIndia();
    getTourNepal();
  }, [getTourIndia, getTourNepal]);

  if (loadingIndia || loadingNepal) {
    return <div>Loading...</div>;
  }

  if (loadingCheckAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isadminroute && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/tour/:id" element={<Tour />} />

        <Route
          path="/admin/login"
          element={!admin ? <AdminLogin /> : <Navigate to="/admin" />}
        />
        <Route
          path="/admin"
          element={
            admin ? <AdminDashboard /> : <Navigate to={"/admin/login"} />
          }
        />
        {/* 
        <Route
          path="/tour-form"
          element={admin ? <TourWizard /> : <Navigate to={"/admin/login"} />}
        /> */}
      </Routes>
      {!isadminroute && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
