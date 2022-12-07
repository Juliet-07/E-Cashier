import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/signin";
import PayWithId from "./pages/payWithId";
import PayWithoutId from "./pages/payWithoutId";
import PayWithAssessment from "./pages/payWithAssessment";
import LandingPage from "./pages/LandingPage";
import Authorizer from "./pages/authorizer";
import Completed from "./pages/authorizerCompleted";
import ConfirmationPage from "./pages/confirmationPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/authorizer" element={<Authorizer />} />
      <Route path="/paywithid" element={<PayWithId />} />
      <Route path="/confirmationPage" element={<ConfirmationPage />} />
      <Route path="/paywithoutid" element={<PayWithoutId />} />
      <Route path="/paywithassessment" element={<PayWithAssessment />} />
      <Route path="/authorizerCompleted" element={<Completed />} />
    </Routes>
  );
};
export default App;
