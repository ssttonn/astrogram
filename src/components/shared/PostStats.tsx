import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect, useMemo, useState } from "react";
import Loader from "./Loader";

interface PostStatsProps {
  post: Models.Document;
  userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [saved, setSaved] = useState(false);

  const { data: currentUser } = useGetCurrentUser();


  const savedPostRecord = useMemo(() => {
    return currentUser?.save.find((save: Models.Document) => save.post.$id === post.$id);
  }, [currentUser, post.$id]);

  useEffect(() => {
    console.log(savedPostRecord);
    setSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavePost();

  const onLikePost = (e: any) => {
    e.stopPropagation();
    const newLikes = likes.includes(userId)
      ? likes.filter((id: any) => id !== userId)
      : [...likes, userId];

    setLikes(newLikes);

    likePost({
      postId: post.$id,
      likesArray: newLikes,
    });
  }

  const onSavePost = (e: any) => {
    e.stopPropagation();
 
    if (savedPostRecord) {
      deleteSavePost({
        documentId: savedPostRecord.$id,
      });
      return;
    }

    savePost({
      postId: post.$id,
      userId,
    });
  }

  const isLiked = useMemo(() => likes.includes(userId), [likes, userId]);

  return (
    <div className="flex justify-between items-center z-20 mt-3">
      <div className="flex gap-2 mr-5">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt={isLiked ? "liked" : "like"}
          width={20}
          height={20}
          onClick={onLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 mr-5">
       {isSavingPost || isDeletingSaved ? <Loader/> : <img
          src={saved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt={saved ? "saved" : "save"}
          width={20}
          height={20}
          onClick={onSavePost}
          className="cursor-pointer"
        />}
      </div>
    </div>
  );
};

export default PostStats;
