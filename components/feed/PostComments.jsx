import { useAppContext } from "@/context/context";
import { postWithToken } from "@/helpers/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Edit2,
  Trash2,
  MoreVertical,
  X,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import MediaSwiper from "./MediaSwiper";
import ReactionButton from "./ReactionButton";
import PostContent from "./PostContent";
import CommentReactionButton from "./CommentReactionButton";

export default function PostComments({ post, allMedia }) {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Check permissions
  const isPostOwner = post?.user_id === userInfo?.id;
  const isCommentOwner = (comment) => comment?.user_id === userInfo?.id;

  // Can edit: Only if user is the comment author
  const canEditComment = (comment) => isCommentOwner(comment);

  // Can delete: If user is comment author OR post owner
  const canDeleteComment = (comment) => isCommentOwner(comment) || isPostOwner;

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, comment, parentId }) => {
      const formData = new FormData();
      formData.append("comment", comment);
      if (parentId) formData.append("parent_id", parentId);

      return await postWithToken(
        `/feed_management/private/posts/${postId}/comments`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/public/feed/all/post`],
        });
        setNewComment("");
        setReplyTo(null);
        setReplyText("");
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, comment }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("comment", comment);

      return await postWithToken(
        `/feed_management/private/comments/${commentId}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/public/feed/all/post`],
        });
        setEditingComment(null);
        setEditText("");
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      return await postWithToken(
        `/feed_management/private/comments/${commentId}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/public/feed/all/post`],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  // Handle add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({
      postId: post.id,
      comment: newComment,
      parentId: null,
    });
  };

  // Handle add reply
  const handleAddReply = (parentId) => {
    if (!replyText.trim()) return;
    addCommentMutation.mutate({
      postId: post.id,
      comment: replyText,
      parentId,
    });
  };

  // Handle update comment
  const handleUpdateComment = (commentId) => {
    if (!editText.trim()) return;
    updateCommentMutation.mutate({
      commentId,
      comment: editText,
    });
  };

  // Handle delete comment
  const handleDeleteComment = (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  // Start editing
  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  // Render single comment
  const renderComment = (comment, isReply = false) => {
    const isEditing = editingComment === comment.id;
    const showEditOption = canEditComment(comment);
    const showDeleteOption = canDeleteComment(comment);
    const showMenu = showEditOption || showDeleteOption;

    return (
      <div
        key={comment.id}
        className={`flex gap-3 ${isReply ? "ml-6 mt-3" : "mb-4"}`}
      >
        <Link href={`/app/profile/${comment?.user?.id}`}>
          <Avatar className="h-8 w-8 shrink-0 cursor-pointer">
            <AvatarImage src={comment?.user?.profile_picture} />
            <AvatarFallback className="bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
              {getUserInitials(comment?.user?.name)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <Link
                  href={`/app/profile/${comment?.user?.id}`}
                  className="font-semibold text-sm text-gray-900 hover:text-secondary transition-colors inline-block"
                >
                  {comment?.user?.name}
                </Link>
                {isEditing ? (
                  <div className="mt-2">
                    <div className="relative">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[60px] resize-none bg-white pr-12"
                        placeholder="Edit your comment..."
                      />
                      <div className="absolute right-2 bottom-2 flex gap-1">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={updateCommentMutation.isPending}
                          className="cursor-pointer p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="cursor-pointer p-2 rounded-full bg-red-400 hover:bg-red-500 text-white transition-colors"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800 mt-1">
                    {comment.comment}
                  </p>
                )}
              </div>

              {showMenu && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer text-gray-500 hover:text-gray-700 p-1">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {showEditOption && (
                      <DropdownMenuItem
                        onClick={() => startEdit(comment)}
                        className="cursor-pointer"
                      >
                        <Edit2 size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {showDeleteOption && (
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-1 ml-1">
            <span className="text-xs text-gray-500">
              {formatDate(comment.created_at)}
            </span>
            <CommentReactionButton comment={comment} />
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="cursor-pointer text-xs text-gray-600 hover:text-blue-600 font-medium"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply input */}
          {replyTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Link href={`/app/profile/${userInfo?.id}`}>
                <Avatar className="h-8 w-8 shrink-0 cursor-pointer">
                  <AvatarImage src={userInfo?.user_image} />
                  <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                    {getUserInitials(userInfo?.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 relative">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[60px] resize-none pr-12"
                />
                <div className="absolute right-2 bottom-2 flex gap-1">
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    disabled={addCommentMutation.isPending || !replyText.trim()}
                    className="cursor-pointer p-2 rounded-full bg-secondary hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send Reply"
                  >
                    <Send size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyText("");
                    }}
                    className="cursor-pointer p-2 rounded-full bg-red-400 hover:bg-red-500 text-white transition-colors"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-[calc(100dvh-220px)] sm:max-h-[calc(90dvh-220px)] overflow-y-auto overscroll-contain pb-5 pr-1">
      {/* Post content */}
      <div className="mb-4 pb-4 border-b">
        <PostContent description={post?.description} />
        <MediaSwiper media={allMedia} postId={post.id} />

        {/* Reaction Button */}
        <div className="flex items-center gap-4 mt-3">
          <ReactionButton post={post} />
          <span className="text-sm text-gray-500">
            {post?.comments?.length || 0} comments
          </span>
        </div>
      </div>

      {/* Comments section */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle size={18} />
          Comments ({post?.comments?.length || 0})
        </h3>

        {/* Add comment input */}
        <div className="flex gap-3 mb-6">
          <Link href={`/app/profile/${userInfo?.id}`}>
            <Avatar className="h-8 w-8 shrink-0 cursor-pointer">
              <AvatarImage src={userInfo?.user_image} />
              <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                {getUserInitials(userInfo?.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[60px] resize-none pr-12"
            />
            <button
              onClick={handleAddComment}
              disabled={addCommentMutation.isPending || !newComment.trim()}
              className="cursor-pointer absolute right-2 bottom-2 p-2 rounded-full bg-secondary hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send Comment"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div>
          {post?.comments?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            post?.comments?.map((comment) => renderComment(comment))
          )}
        </div>
      </div>
    </div>
  );
}
