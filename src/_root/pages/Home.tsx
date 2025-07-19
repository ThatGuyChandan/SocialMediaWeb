import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { userGetRecentPosts } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";

function Home() {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = userGetRecentPosts();
  if (isErrorPosts) {
    return <div>Error loading posts</div>;
  }
  const hasPosts = posts && posts.documents && posts.documents.length > 0;
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Posts-</h2>

          {isPostLoading && !posts ? (
            <Loader />
          ) : hasPosts ? (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-96 gap-4">
              <img src="/assets/icons/posts.svg" alt="No posts" width={64} height={64} />
              <p className="text-light-4 text-xl">No posts yet. Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
