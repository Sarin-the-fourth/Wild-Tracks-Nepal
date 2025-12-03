import { useEffect, useState } from "react";
import { useAdminStore } from "../Store/useAdminStore";
import { toast } from "react-toastify";
import { useAuthStore } from "../Store/useAuthStore";

const Searchbar = () => {
  const [isAdminOpen, setisAdminOpen] = useState(false);
  const [blur, setblur] = useState(false);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { updateProfile, admin, checkAuth } = useAdminStore();
  const { logout } = useAuthStore();
  const [settingpage, setSettingpage] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      await checkAuth();
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  const handlelogout = () => {
    logout();
  };

  if (loading) {
    return <div className="text-white p-4">Loading admin data...</div>;
  }

  const handleSetting = () => {
    setblur(true);
    setSettingpage(true);
  };

  const handleProfileUpdate = async () => {
    const adminId = admin?._id;
    console.log("Admin ID:", adminId);
    if (!adminId) {
      toast.error("Admin Id not found.");
      return;
    }
    try {
      const profileData = {
        oldPassword,
        newPassword,
        email,
        name,
      };
      await updateProfile(profileData, adminId);
      // toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setblur(false);
      setSettingpage(false);
    }
  };

  return (
    <>
      {blur && (
        <div className="fixed inset-0 z-9 backdrop-blur-lg w-full h-full"></div>
      )}

      {settingpage && (
        <div className="fixed inset-0 min-w-fit bg-gray-600 shadow-2xl min-h-fit z-10 overflow-auto rounded m-10">
          <button
            className=" absolute top-2 right-4 rounded text-xl text-white hover:text-black focus:text-white font-montserrat transition-all duration-300"
            onClick={() => {
              setSettingpage(false);
              setblur(false);
            }}
          >
            X
          </button>

          <h1 className="text-center text-white mt-5 mb-10 font-bebas text-6xl">
            Settings
          </h1>

          <div className="flex flex-col space-y-2 ml-4 mr-4">
            <label className="text-white text-center text-2xl uppercase font-semibold font-montserrat mt-2">
              Change Name
            </label>
            <div className="flex justify-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="w-2/4 md:w-1/2 p-2 rounded bg-white text-black font-montserrat focus:outline-none"
              />
            </div>

            <label className="text-white text-center text-2xl uppercase font-semibold font-montserrat mt-2">
              Change Email
            </label>
            <div className="flex justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-3/4 md:w-1/2 p-2 rounded bg-white text-black font-montserrat focus:outline-none"
              />
            </div>

            <label className="text-white text-center text-2xl font-semibold uppercase font-montserrat mt-2">
              Old Password
            </label>
            <div className="flex justify-center">
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter Old Password"
                className="w-2/4 md:w-1/2 p-2 rounded bg-white text-black font-montserrat focus:outline-none"
              />
            </div>

            <label className="text-white text-center text-2xl font-semibold uppercase font-montserrat mt-2">
              New Password
            </label>
            <div className="flex justify-center">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="w-2/4 md:w-1/2 p-2 mb-5 rounded bg-white text-black font-montserrat focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleProfileUpdate}
                className="bg-gray-800 hover:bg-[#fdb913] mb-5 text-white transition-all duration-300 font-montserrat px-4 py-2 rounded w-fit mt-4"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
        <div className="w-full flex items-center justify-between px-4">
          <h1 className="text-white text-md text-center font-bebas text-6xl font-light">
            Dashboard
          </h1>
          <div
            className="relative flex items-center gap-3 ml-4 cursor-pointer"
            onClick={() => setisAdminOpen(!isAdminOpen)}
          >
            <h1 className="text-whit text-md font-montserrat font-light group-hover:text-white text-[#dddd]">
              {admin?.name}
            </h1>
            <img
              src="./admin_image.jpg"
              alt="admin_image"
              className="w-10 h-10 rounded-full object-cover"
            />

            {isAdminOpen && (
              <ul className="absolute top-full right-0 mt-2 w-40 font-montserrat font-light text-sm bg-[#222831] text-[#dddd] rounded shadow-lg z-50">
                <li
                  onClick={handleSetting}
                  className="px-4 py-2 transition-all duration-300 hover:text-white cursor-pointer"
                >
                  Settings
                </li>
                <li
                  onClick={handlelogout}
                  className="px-4 py-2 hover:text-white cursor-pointer"
                >
                  Log Out
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchbar;
