import { Models } from "appwrite";
type PostStatProps = {
  post: Models.Document;
  userId: string;
};
const PostStats = ({ post, userId }: PostStatProps) => {
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src="/assets/icons/like.svg"
          alt="like"
          width={22}
          height={18}
          className="cursor-pointer"
          onClick={() => {}}
        />
        <p className="small-medium lg:base-medium">0</p>
      </div>
      <div className="flex gap-2 mr-5">
        <img
          src="/assets/icons/save.svg"
          alt="like"
          width={22}
          height={18}
          className="cursor-pointer"
          onClick={() => {}}
        />
        <p className="small-medium lg:base-medium">0</p>
      </div>
    </div>
  );
};

export default PostStats;
