import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

function Authlayout() {
  const { isAuthenticated } = useUserContext();
  const location = useLocation();

  // Only redirect from /signin if already authenticated
  if (isAuthenticated && location.pathname === "/signin") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
      <img
        src="/assets/images/socialMedia.jpg"
        alt="logo"
        className="hidden md:block h-screen w-1/2 object-cover bg-no-repeat"
      ></img>
    </>
  );
}

export default Authlayout;
