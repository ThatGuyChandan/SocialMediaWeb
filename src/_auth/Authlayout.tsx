import { Outlet, Navigate } from "react-router-dom";
function Authlayout() {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
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
      )}
    </>
  );
}

export default Authlayout;
