import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthorizerLandingPage from "./pages/Authorizer/LandingPage";
import Login from "./pages/login";
import PrivateRoutes from "./PrivateRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        {/* <Route path="/landingpage" element={<LandingPage />} /> */}
        <Route path="/authorizer" element={<AuthorizerLandingPage />} />
        {/* <Route path="/paywithid" element={<PayWithId />} />
        <Route path="/confirmationPage" element={<ConfirmationPage />} />
        <Route path="/paywithoutid" element={<PayWithoutId />} />
        <Route path="/paywithassessment" element={<PayWithAssessment />} />
        <Route path="/authorizerCompleted" element={<Completed />} />
        <Route path="/authorizerRejected" element={<Rejected />} /> */}
        {/* <Route
          path="/transactionSuccessful"
          element={<TransactionSuccessful />}
        /> */}
      </Route>
    </Routes>
  );
}
export default App;
