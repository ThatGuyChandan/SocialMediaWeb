import { useParams, useLocation, Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutation";
import { Loader } from "lucide-react";
import StatBlock from "@/components/shared/StatBlock";
import GridPostList from "./GridPostList";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser, isLoading, isError } = useGetUserById(id || "");

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (isError || !currentUser || !currentUser.$id) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 gap-4">
        <img src="/assets/icons/profile-placeholder.svg" alt="Invalid user" width={80} />
        <h2 className="text-2xl font-bold text-red-400">Invalid or non-existent user</h2>
        <p className="text-light-4">The user you are looking for does not exist or the profile is unavailable.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser.$id === user.id;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full border-2 border-primary-500"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
            </div>
          </div>
        </div>
      </div>
      {/* Only show edit options if it's your own profile */}
      {isOwnProfile && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={18}
              height={18}
            />
            Posts
          </Link>
        </div>
      )}
      {/* Render user's posts */}
      <div className="w-full mt-10">
        {currentUser.posts && currentUser.posts.length > 0 ? (
          <GridPostList posts={currentUser.posts} />
        ) : (
          <div className="text-light-4 text-center mt-10">No posts yet.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
