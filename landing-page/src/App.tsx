import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
