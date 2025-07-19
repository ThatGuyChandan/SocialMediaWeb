import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import GridPostList from "./GridPostList";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) {
    return (
      <div className="saved-container">
        <Loader />
      </div>
    );
  }

  // Only include saved posts with valid post details
  const savePosts = (currentUser.save || [])
    .map((savedPost: Models.Document) => savedPost.post)
    .filter((post: any) => post && post.caption && post.imageUrl)
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      <ul className="w-full flex justify-center max-w-5xl gap-9">
        {savePosts.length === 0 ? (
          <p className="text-light-4">No saved posts available.</p>
        ) : (
          <GridPostList posts={savePosts} />
        )}
      </ul>
    </div>
  );
};

export default Saved;
