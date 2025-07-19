import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserContext();
  useEffect(() => {
    if (isSuccess) navigate("/signin");
  }, [isSuccess, navigate]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo3.png" alt="logo" width={110} />
        </Link>
        {user.id ? (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-12 w-12 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        ) : (
          <Link to="/signin" className="flex gap-3 items-center justify-center py-4">
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-12 w-12 rounded-full"
            />
            <span className="body-bold text-primary-500">Sign in</span>
          </Link>
        )}
        <ul className="flex flex-col gap-6">
          <li className={`leftsidebar-link group ${pathname === "/" ? "bg-primary-500 shadow-lg scale-[1.03] text-white" : "hover:bg-primary-500/30 hover:text-white transition-all"}`}>
            <NavLink to="/" className="flex gap-4 items-center p-4">
              <img src="/assets/icons/home.svg" alt="Home" className={`transition-all ${pathname === "/" ? "invert-white" : "group-hover:invert-white"}`} />
              <span className="transition-all">Home</span>
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              {sidebarLinks.filter(link => link.route !== "/").map((link: INavLink) => {
                const isActive = pathname === link.route;
                return (
                  <li
                    key={link.label}
                    className={`leftsidebar-link group ${
                      isActive ? "bg-primary-500 text-white" : "hover:bg-primary-500/30 hover:text-white transition-all"
                    }`}
                  >
                    <NavLink
                      to={link.route}
                      className="flex gap-4 items-center p-4"
                    >
                      <img
                        src={link.imgURL}
                        alt={link.label}
                        className={`transition-all ${isActive ? "invert-white" : "group-hover:invert-white"}`}
                      />
                      <span className="transition-all">{link.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </div>
      {isAuthenticated ? (
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      ) : null}
    </nav>
  );
};

export default LeftSidebar;
