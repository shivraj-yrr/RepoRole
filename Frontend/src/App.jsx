import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SampleRepos from "./components/SampleRepos";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import ComingSoon from "./components/ComingSoon";
import AboutUs from "./components/AboutUs";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./components/AuthSuccess";
import Analysis from "./pages/analysis";
import AnalyzePage from "./pages/AnalyzePage";
import RecruiterLogin from "./pages/RecruiterLogin";


import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
            <div className="bg-[#f5f3ef] space-y-2"></div>
              <Home />
               <section id="samples" className="-mt-4"></section>

              <section id="samples">
                <SampleRepos />
              </section>

              <section id="features">
                <Features />
              </section>

              <ComingSoon />

              <section id="how">
                <HowItWorks />
              </section>

              <section id="about">
                <AboutUs />
              </section>
            </>
          }
        />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;