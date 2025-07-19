import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import { useGetCommentsByPostId, useCreateComment } from "@/lib/react-query/queriesAndMutation";
import { formatSocialMediaDate } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deletePost } from "@/lib/appwrite/api";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Function to fix old /preview URLs to /view URLs
const fixImageUrl = (url: string): string => {
  if (url && url.includes('/preview')) {
    return url.replace('/preview', '/view');
  }
  return url;
};

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user, isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const { toast } = useToast();
  const { data: commentsData, isLoading: isCommentsLoading } = useGetCommentsByPostId(id || "");
  const { mutateAsync: createComment, isLoading: isCommenting } = useCreateComment();

  // Fix the image URL if it's an old /preview URL
  const fixedImageUrl = post ? fixImageUrl(post.imageUrl) : "";

  const handleDeletePost = async () => {
    setShowConfirm(false);
    if (!post) return;
    setDeleting(true);
    await deletePost(post.$id, post.imageId);
    setDeleting(false);
    navigate("/");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");
    if (!comment.trim()) return;
    try {
      await createComment({ postId: id || "", userId: user.id, userName: user.username, content: comment });
      setComment("");
    } catch (err: any) {
      const msg = err?.message || "Failed to add comment. Please try again.";
      setCommentError(msg);
      toast({ title: "Comment failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={fixedImageUrl} alt="post" className="post_details-img" />
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
                {user.id === post?.creator.$id && (
                  <Button
                    onClick={() => setShowConfirm(true)}
                    variant="ghost"
                    className="ghost_details-delete_btn"
                    disabled={deleting}
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={22}
                      height={22}
                    />
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                )}
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
                {post?.tags && post.tags.length > 0 ? (
                  post.tags.map((tag: string, idx: number) => (
                    <li key={`${post.$id}-tag-${idx}`} className="text-light-3">
                      #{tag}
                    </li>
                  ))
                ) : (
                  <li className="text-light-4">No tags available.</li>
                )}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
            <div className="w-full mt-8">
              <h3 className="h3-bold mb-4">Comments</h3>
              {isCommentsLoading ? (
                <Loader />
              ) : commentsData && commentsData.documents && commentsData.documents.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {commentsData.documents.map((c: any) => (
                    <li key={c.$id} className="bg-dark-3 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={"/assets/icons/profile-placeholder.svg"} alt="user" className="w-7 h-7 rounded-full" />
                        <span className="font-semibold text-light-1">{c.userName || c.userId}</span>
                        <span className="text-xs text-light-4 ml-2">{formatSocialMediaDate(c.$createdAt)}</span>
                      </div>
                      <p className="text-light-2 ml-9">{c.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-light-4">No comments yet.</div>
              )}
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="flex gap-2 mt-6">
                  <input
                    type="text"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="shad-input flex-1"
                  />
                  {commentError && <div className="text-red-500 text-sm mt-2">{commentError}</div>}
                  <Button type="submit" className="shad-button_primary" disabled={isCommenting || !comment.trim()}>
                    {isCommenting ? "Posting..." : "Post"}
                  </Button>
                </form>
              )}
            </div>
          </div>
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-dark-2 p-8 rounded-lg flex flex-col items-center gap-4">
                <p className="text-lg">Are you sure you want to delete this post?</p>
                <div className="flex gap-4">
                  <Button onClick={handleDeletePost} variant="destructive">Yes, Delete</Button>
                  <Button onClick={() => setShowConfirm(false)} variant="ghost">Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
