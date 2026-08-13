import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../utils/api";

const Home = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!repoUrl) {
      alert("Please enter GitHub repo URL");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API.analyzeYourRepo, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo: repoUrl }),
        credentials: "include",
      });

      const data = await response.json();

      console.log("API Response:", data);

      navigate("/analyze", { state: data });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="bg-[#f5f3ef] min-h-[70vh]"> {/* changed here */}
  <div className="flex flex-col items-center justify-center text-center mt-6 md:mt-10 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900">
          RepoRole
        </h1>

        <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl">
          No Resume, No form, Just Code → Roles
        </p>

        <div className="mt-8 md:mt-10 w-full max-w-2xl flex flex-col sm:flex-row items-center gap-4">
          
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="w-full px-5 py-3 md:py-4 rounded-xl border border-gray-300 shadow-sm focus:outline-none"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 px-8 py-4 rounded-xl text-lg font-medium shadow-md text-black w-[200px]"
          >
            {loading ? "Analyzing..." : "Analyze →"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;