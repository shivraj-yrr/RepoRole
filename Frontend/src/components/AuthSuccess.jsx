import { useEffect } from "react";
import axios from "axios";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Calling:", API.me); // 🔥 debug

        const res = await axios.get(API.me, {
          withCredentials: true, // 🔥 VERY IMPORTANT
        });

        console.log("USER:", res.data);

        navigate("/dashboard");
      } catch (err) {
        console.error("Auth failed:", err.response?.data || err.message);
        navigate("/");
      }
    };

    checkAuth();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default AuthSuccess;