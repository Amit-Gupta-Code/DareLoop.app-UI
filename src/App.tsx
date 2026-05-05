import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Landing from "./pages/Landing";
import Signup from "./pages/Auth/Signup";
import UserProfile from "./pages/Profile/UserProfile";
import Explore from "./pages/Explore";
import Analytics from "./pages/Analytics";
import ChallengeDetail from "./pages/Challenge/Detail";
import CreateChallenge from "./pages/Challenge/Create";
import EditProfile from "./pages/Profile/EditProfile";
import StaticPage from "./pages/Static/StaticPage";
import { useTokenExpiry } from "./utils/jwt";
import { useEffect } from "react";




function App() {
  useEffect(() => {
    useTokenExpiry(); // runs once on mount — clears expired token from localStorage & store
  }, []);
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Signup />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/c/:code" element={<ChallengeDetail />} />
            <Route path="/create" element={<CreateChallenge />} />
            <Route path="/documentation" element={<StaticPage pageKey="documentation" />} />
            <Route path="/api-reference" element={<StaticPage pageKey="api-reference" />} />
            <Route path="/growth-engine-lab" element={<StaticPage pageKey="growth-engine-lab" />} />
            <Route path="/whitepaper" element={<StaticPage pageKey="whitepaper" />} />
            <Route path="/privacy-policy" element={<StaticPage pageKey="privacy-policy" />} />
            <Route path="/terms-of-service" element={<StaticPage pageKey="terms-of-service" />} />
            <Route path="/cookies" element={<StaticPage pageKey="cookies" />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
