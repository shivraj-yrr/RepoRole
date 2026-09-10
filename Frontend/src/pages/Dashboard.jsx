import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API } from "../utils/api";

import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { Sparkles } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("stars");
  const [analyzingRepoId, setAnalyzingRepoId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(API.me, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setRepos(data.repos || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= ANALYZE FUNCTION ================= */
 const handleAnalyze = async (repo) => {
  try {
    setAnalyzingRepoId(repo.id); // ✅ start loading

    console.log("REPO DATA:", repo);

    const res = await fetch(API.analyzeRepo, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        repo: repo.url,
      }),
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (res.ok) {
      navigate("/analysis", { state: data });
    } else {
      console.error("Analysis failed:", data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setAnalyzingRepoId(null); // ✅ stop loading
  }
};
  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <Navigate to="/" />;

  /* FILTER */
  let filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  /* SORT */
  filteredRepos = filteredRepos.sort((a, b) => {
    if (sort === "stars") return (b.stars || 0) - (a.stars || 0);
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "updated")
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    return 0;
  });

  /* STATS */
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks || 0), 0);
  const languages = [
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];

  /* LANGUAGE COLORS */
  const getLanguageColor = (lang) => {
    const colors = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-400",
      "C++": "bg-pink-500",
      HTML: "bg-orange-500",
      CSS: "bg-blue-400",
      Python: "bg-green-500",
    };
    return colors[lang] || "bg-gray-400";
  };

  return (
    <div className="bg-[#f6f3ef] min-h-screen p-4 md:p-6">

      {/* ================= PROFILE ================= */}
      <div className="bg-purple-50 border border-purple-300 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-purple-200"
          />

          <div className="text-center sm:text-left">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <h2 className="text-xl md:text-3xl font-bold">
                {user.name || user.githubLogin}
              </h2>

              <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-semibold">
                SEEKER
              </span>

              <span className="border px-2 py-1 text-xs rounded-full">
                GITHUB
              </span>
            </div>

            <p className="text-gray-500 text-sm">
              @{user.githubLogin}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs md:text-sm text-gray-500 mt-2 items-center sm:items-start">
              <span className="flex items-center gap-2">
                <FaEnvelope />
                {user.email || "No email linked"}
              </span>

              <span className="flex items-center gap-2">
                <FaCalendarAlt />
                Joined {new Date(user.createdAt).toDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* ORIGINAL BUTTON (UNCHANGED UI) */}
        <button className="flex items-center justify-center gap-2 bg-purple-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-xl font-semibold hover:bg-purple-800 transition w-full md:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          View Analysis
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6">
        <StatCard title="Repositories" value={totalRepos} icon={<FaGithub />} />
        <StatCard title="Total Stars" value={totalStars} icon={<FaStar />} />
        <StatCard title="Total Forks" value={totalForks} icon={<FaCodeBranch />} />
        <StatCard title="Languages" value={languages.length} icon={<FaCode />} />
      </div>

      {/* ================= REPOS ================= */}
      <div className="mt-10">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Repositories</h2>
            <p className="text-gray-500 text-sm">
              {filteredRepos.length} of {repos.length} shown
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="text"
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-xl w-full sm:w-64"
            />

            <div className="flex border rounded-xl overflow-hidden text-sm w-full sm:w-auto">
              {["stars", "name", "updated"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSort(type)}
                  className={`flex-1 px-3 py-2 ${
                    sort === type ? "bg-purple-600 text-white" : ""
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* REPO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {repo.name}
                </h3>
                <FaGithub className="text-gray-500" />
              </div>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {repo.description || "No description"}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 items-center">

                <span className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${getLanguageColor(
                      repo.language
                    )}`}
                  ></span>
                  {repo.language || "N/A"}
                </span>

                <span className="flex items-center gap-1">
                  <FaStar /> {repo.stars}
                </span>

                <span className="flex items-center gap-1">
                  <FaCodeBranch /> {repo.forks}
                </span>

              </div>

              {/* ✅ ANALYZE BUTTON (NEW) */}
              <button
  onClick={(e) => {
    e.preventDefault();
    handleAnalyze(repo);
  }}
  disabled={analyzingRepoId === repo.id}
  className={`mt-4 w-full py-2 rounded-xl transition ${
    analyzingRepoId === repo.id
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-purple-700 hover:bg-purple-800 text-white"
  }`}
>
  {analyzingRepoId === repo.id ? "Analyzing..." : "Analyze"}
</button>

            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#f3f4f6] border border-gray-200 rounded-2xl p-5 md:p-6 flex justify-between items-start shadow-sm">
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          {value}
        </h3>
      </div>

      <div className="bg-purple-100 text-purple-600 p-2 md:p-3 rounded-xl text-lg">
        {icon}
      </div>
    </div>
  );
};