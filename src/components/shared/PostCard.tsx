import { useUserContext } from "@/context/AuthContext";
import { formatSocialMediaDate } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  if (!post.$creator) {
    // Handle this case, perhaps return null or a placeholder
    return null;
  }

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.creator.$id}`}
            className={user.id !== post.creator.$id ? "hidden" : ""}
          >
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-lime-50">
              {post.creator.name}
            </p>

            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatSocialMediaDate(post.$createdAt)}
              </p>

              <div className="subtle-semibold lg:small-regular m-1">
                <p>-{post.location}</p>
              </div>
            </div>
          </div>
        </div>
        <Link to={`/update-post/${post.$id}`}>
          <img src="/assets/icons/edit.svg" alt="edit" width={18} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-3">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post image"
        />
      </Link>
    </div>
  );
};

export default PostCard;
