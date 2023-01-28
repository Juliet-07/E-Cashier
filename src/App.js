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
import TransactionSuccessful from "./pages/transactionSuccessful";
import Rejected from "./pages/authorizerRejected";
import PrivateRoutes from "./PrivateRoutes";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/authorizer" element={<Authorizer />} />
        <Route path="/paywithid" element={<PayWithId />} />
        <Route path="/confirmationPage" element={<ConfirmationPage />} />
        <Route path="/paywithoutid" element={<PayWithoutId />} />
        <Route path="/paywithassessment" element={<PayWithAssessment />} />
        <Route path="/authorizerCompleted" element={<Completed />} />
        <Route path="/authorizerRejected" element={<Rejected />} />
        <Route
          path="/transactionSuccessful"
          element={<TransactionSuccessful />}
        />
      </Route>
    </Routes>
  );
};
export default App;
