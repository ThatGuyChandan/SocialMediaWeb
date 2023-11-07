import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import { formatSocialMediaDate } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useParams, Link } from "react-router-dom";
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();
  const handleDeletePost = () => {};
  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full ">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 lg:w-12 lg:h-12 "
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-lime-50 ">
                    {post?.creator.name}
                  </p>

                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {post && post.$createdAt
                        ? formatSocialMediaDate(post.$createdAt)
                        : ""}
                    </p>

                    <div className="subtle-semibold lg:small-regular m-1">
                      <p>-{post?.location}</p>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-4">
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  } `}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={22}
                    height={22}
                  />
                </Button>
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"} `}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    width={22}
                    height={22}
                  />
                </Link>
              </div>
            </div>
            <hr className="border w-full border-primary-500/80 "></hr>
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-3">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
