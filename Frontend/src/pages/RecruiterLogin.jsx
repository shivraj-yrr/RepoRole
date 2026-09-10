
import React, { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Send OTP
  const sendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(API.sendOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to send OTP");
      }

      setOtpSent(true);
      setMessage(data.message || "OTP sent successfully.");
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(API.verifyOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Invalid OTP");
      }

      console.log("Recruiter OTP verified:", data);

      // After successful verification
      navigate("/recruiter-dashboard", {
        state: data,
      });
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
            <MdEmail className="text-purple-600 text-3xl" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
            Recruiter Login
          </h1>

          <p className="text-gray-500 mt-2">
            Continue with your email address
          </p>
        </div>

        {/* Email */}
        <div className="mt-7">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
            <MdEmail className="text-gray-400 text-xl mr-3" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recruiter@example.com"
              disabled={otpSent}
              className="w-full outline-none text-gray-900 bg-transparent"
            />
          </div>
        </div>

        {/* Send OTP */}
        {!otpSent && (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full mt-5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* OTP */}
        {otpSent && (
          <>
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>

              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
                <MdLock className="text-gray-400 text-xl mr-3" />

                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full outline-none text-gray-900 bg-transparent tracking-widest"
                />
              </div>
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setMessage("");
                setError("");
              }}
              className="w-full mt-3 text-purple-600 hover:text-purple-700 font-medium"
            >
              Change Email
            </button>
          </>
        )}

        {/* Success message */}
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="w-full mt-5 text-gray-500 hover:text-gray-800 text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default RecruiterLogin;

