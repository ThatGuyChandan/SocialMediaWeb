import { useUserContext } from "@/context/AuthContext";
import { formatSocialMediaDate } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user, isAuthenticated } = useUserContext();
  
  if (!post.creator) return null;

  // Fix the image URL if it's an old /preview URL
  const fixedImageUrl = post.imageUrl && post.imageUrl.includes('/preview')
    ? post.imageUrl.replace('/preview', '/view')
    : post.imageUrl;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.creator.$id}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="rounded-full w-12 lg:h-12 border-2 border-primary-500 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="base-medium lg:body-bold text-lime-50 group-hover:underline">
                {post.creator.name}
              </span>
              <span className="small-regular text-light-3 group-hover:text-primary-500">@{post.creator.username}</span>
            </div>
          </Link>
        </div>
        {isAuthenticated && user.id === post.creator.$id && (
          <Link
            to={`/update-post/${post.$id}`}
            className=""
          >
            <img src="/assets/icons/edit.svg" alt="edit" width={18} />
          </Link>
        )}
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className="small-medium lg:base-medium py-6">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-3">
            {post.tags && Array.isArray(post.tags) && post.tags.map((tag: string, idx: number) => (
              <li key={`${post.$id}-tag-${idx}`} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={fixedImageUrl || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post image"
          onError={(e) => {
            e.currentTarget.src = "/assets/icons/profile-placeholder.svg";
          }}
        />
      </Link>
      {isAuthenticated ? (
        <PostStats post={post} userId={user.id} />
      ) : (
        <div className="text-center mt-4">
          <Link to="/signin" className="text-blue-400 underline text-sm">Sign in to like, save, or comment</Link>
        </div>
      )}
    </div>
  );
};

export default PostCard;
