const BASE = import.meta.env.VITE_API_BASE_URL;

console.log("ENV CHECK:", import.meta.env); // 👈 ADD THIS
console.log("BASE:", BASE); // 👈 ADD THIS

export const API = {
  githubLogin: `${BASE}${import.meta.env.VITE_AUTH_GITHUB}`,
  me: `${BASE}${import.meta.env.VITE_AUTH_ME}`,
  logout: `${BASE}${import.meta.env.VITE_AUTH_LOGOUT}`,

  sendOtp: `${BASE}${import.meta.env.VITE_AUTH_RECRUITER_OTP}`,
  verifyOtp: `${BASE}${import.meta.env.VITE_AUTH_RECRUITER_VERIFY}`,

  analyzeRepo: `${BASE}${import.meta.env.VITE_ANALYZE_ROLES}`,
  analyzeYourRepo: `${BASE}${import.meta.env.VITE_ANALYZE_YOUR_ROLES}`,
};