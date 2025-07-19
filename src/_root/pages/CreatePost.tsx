import Post from "@/components/forms/Post";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const CreatePost = () => {
  const { isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={40}
            height={40}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <Post action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
