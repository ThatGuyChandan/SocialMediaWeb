import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type GridPostListProps = {
  posts: Models.Document[];
};
const GridPostList = ({
  posts,
}: GridPostListProps) => {
  const { user } = useUserContext();
  // Filter out posts with missing creators
  const filteredPosts = posts.filter(post => post.creator);
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <li key={post.$id} className="bg-dark-3 rounded-lg p-4 flex flex-col h-full">
          {/* Profile info at the top, only once */}
          <div className="flex items-center gap-2 mb-1">
            <img src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="user" className="w-7 h-7 rounded-full" />
            <span className="font-semibold text-light-1">{post.creator?.username || 'Unknown User'}</span>
          </div>
          {/* Post image */}
          <Link to={`/post/${post.$id}`} className="grid-post_link flex-1">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>
          {/* Likes/Save at the bottom */}
          <div className="mt-3">
            <PostStats post={post} userId={user.id} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
