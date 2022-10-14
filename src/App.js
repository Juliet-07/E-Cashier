import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/signin";
import PayWithId from "./pages/payWithId";
import PayWithoutId from "./pages/payWithoutId";
import PayWithCode from "./pages/payWithCode";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/paywithid" element={<PayWithId />} />
      <Route path="/paywithoutid" element={<PayWithoutId />} />
      <Route path="/paywithcode" element={<PayWithCode />} />
    </Routes>
  );
};
export default App;
