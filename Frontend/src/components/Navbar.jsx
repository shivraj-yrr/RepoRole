import React, { useState, useEffect } from "react";
import SignUpModal from "./SignUpModal";
import { API } from "../utils/api";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(API.me, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkUser();
  }, []);

  // ✅ Logout function
  const handleLogout = async () => {
  try {
    await fetch(API.logout, {
      method: "GET",
      credentials: "include",
    });

    setUser(null);

    // ✅ Better than window.location
    navigate("/");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      {/* Navbar */}
      <div
        className="sticky top-0 z-50 w-full px-5 md:px-10 py-4 
        bg-[#f5f3ef]/70 backdrop-blur-md border-b border-white/20 
        flex items-center justify-between relative"
      >
        {/* Logo */}
        <Link
  to="/"
  className="flex items-center gap-2 group transition duration-300"
>
  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold group-hover:scale-110 transition">
    RR
  </div>

  <h1 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-black transition">
    Repo<span className="text-purple-600 group-hover:text-purple">Role</span>
  </h1>
</Link>
        {/* Desktop Menu */}
        {location.pathname !== "/dashboard" &&
          location.pathname !== "/analysis" && location.pathname !== "/analyze" && (
            <div className="hidden md:flex gap-8 text-gray-600 font-medium">
      
      <a href="#features" className="relative group transition">
        <span className="group-hover:text-black transition">Features</span>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
      </a>

      <a href="#how" className="relative group transition">
        <span className="group-hover:text-black transition">How it works</span>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
      </a>

      <a href="#samples" className="relative group transition">
        <span className="group-hover:text-black transition">Samples</span>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
      </a>

      <a href="#about" className="relative group transition">
        <span className="group-hover:text-black transition">About us</span>
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
      </a>

    </div>
          )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          
          {/* ✅ Profile (ADDED BACK) */}
          {user && (
            <div
              onClick={() => navigate("/dashboard")}
              className="w-9 h-9 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition border border-gray-300">
              <img
                src={
                  user?.avatarUrl ||
                  "https://github.com/identicons/default.png"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Desktop Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-red-400 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold shadow-md text-black"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="hidden md:block bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-lg font-semibold shadow-md text-black"
            >
              Sign up
            </button>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden text-3xl font-bold text-black"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="absolute top-16 left-0 w-full bg-white/90 backdrop-blur-md shadow-md flex flex-col items-center gap-5 py-6 md:hidden z-50">

            {/* Hide links on dashboard & analysis */}
            {location.pathname !== "/dashboard" &&
              location.pathname !== "/analysis" && location.pathname !== "/analyze" &&(
                <>
                  <a href="#features" onClick={() => setOpen(false)}>Features</a>
                  <a href="#how" onClick={() => setOpen(false)}>How it works</a>
                  <a href="#samples" onClick={() => setOpen(false)}>Samples</a>
                  <a href="#about" onClick={() => setOpen(false)}>About us</a>
                </>
              )}

            {/* Auth buttons */}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="bg-red-400 px-5 py-2 rounded-lg font-semibold text-black"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowModal(true);
                  setOpen(false);
                }}
                className="bg-yellow-400 px-5 py-2 rounded-lg font-semibold text-black"
              >
                Sign up
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
  <SignUpModal onClose={() => setShowModal(false)} />
)}
    </>
  );
};

export default Navbar;