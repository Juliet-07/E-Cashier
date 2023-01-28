import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useIdle } from "./hooks/useIdleTImer";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  // how do I make the token dynamic?
  let auth = { token: true };
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  const { isIdle } = useIdle({ onIdle: logout, idleTime: 0.25 });
  return (
    <div>
      {isIdle ? <Navigate to="/" /> : <Outlet />}
      {/* {auth.token ? <Outlet /> : <Navigate to="/" />} */}
    </div>
  );
};

export default PrivateRoutes;
