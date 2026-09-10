import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const RepoInput = () => {
  const [repo, setRepo] = useState("");
  const navigate = useNavigate();

  const analyze = async () => {
    const res = await axios.post("/analyze/roles", { repo });
    navigate("/result", { state: res.data });
  };

  return (
    <div className="mt-8 flex justify-center gap-2">
      <input
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="owner/repo"
        className="px-4 py-3 rounded-lg bg-white/10 w-72 outline-none"
      />
      <button
        onClick={analyze}
        className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-lg"
      >
        Analyze 🚀
      </button>
    </div>
  );
};

export default RepoInput;