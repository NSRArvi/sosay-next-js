"use client";

import Image from "next/image";
import {
  UserPlus,
  UserMinus,
  X,
  Check,
  Loader2,
  Eye,
} from "lucide-react";

export default function SearchUserCard({
  user,
  onAddFriend,
  onUnfriend,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onViewProfile,
  isLoading,
  currentAction,
}) {
  const friend = user?.friend || {};
  const { is_self, is_friend, is_request_sent, is_request_received } = friend;

  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  const getActionButtons = () => {
    return (
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button
          onClick={(e) => {
            handleStopPropagation(e);
            onViewProfile(user.id);
          }}
          className="cursor-pointer group h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-purple-500/90 hover:border-purple-400 transition-all duration-300 flex items-center justify-center shadow-lg"
          title="View Profile"
        >
          <Eye className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
        </button>
        {!is_self && (
          <>
            {is_friend ? (
              <button
                onClick={(e) => {
                  handleStopPropagation(e);
                  onUnfriend(user.id);
                }}
                disabled={isLoading && currentAction === "unfriend"}
                className="cursor-pointer group h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-red-500/90 hover:border-red-400 transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Unfriend"
              >
                {isLoading && currentAction === "unfriend" ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <UserMinus className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                )}
              </button>
            ) : is_request_sent ? (
              <button
                onClick={(e) => {
                  handleStopPropagation(e);
                  onCancelRequest(user.id);
                }}
                disabled={isLoading && currentAction === "cancel"}
                className="cursor-pointer group h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-red-500/90 hover:border-red-400 transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel Request"
              >
                {isLoading && currentAction === "cancel" ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                )}
              </button>
            ) : is_request_received ? (
              <>
                <button
                  onClick={(e) => {
                    handleStopPropagation(e);
                    onAcceptRequest(user.id);
                  }}
                  disabled={isLoading && currentAction === "accept"}
                  className="cursor-pointer group h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-green-500/90 hover:border-green-400 transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Accept"
                >
                  {isLoading && currentAction === "accept" ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Check className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    handleStopPropagation(e);
                    onRejectRequest(user.id);
                  }}
                  disabled={isLoading && currentAction === "reject"}
                  className="cursor-pointer group h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-red-500/90 hover:border-red-400 transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reject"
                >
                  {isLoading && currentAction === "reject" ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  handleStopPropagation(e);
                  onAddFriend(user.id);
                }}
                disabled={isLoading && currentAction === "add"}
                className="cursor-pointer group h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-blue-500/90 hover:border-blue-400 transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add Friend"
              >
                {isLoading && currentAction === "add" ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <UserPlus className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                )}
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => onViewProfile(user.id)}
      className="relative group overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
    >
      {/* Background Image or Gradient */}
      <div className="relative h-80 w-full">
        {user?.user_image || user?.profile_picture ? (
          <>
            <Image
              src={user?.user_image || user?.profile_picture}
              alt={user?.name}
              className="h-full w-full object-cover"
              height={500}
              width={500}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name,
                )}&background=random&size=500`;
              }}
            />
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="h-full w-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
          </>
        )}

        {/* Action Buttons */}
        {getActionButtons()}

        {/* User Info - Glassmorphic Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Avatar Circle (only if no image) */}
          {!user?.user_image && !user?.profile_picture && (
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Glassmorphic Info Card */}
          <div className="">
            <h3 className="font-bold text-lg text-white text-center truncate drop-shadow-lg">
              {user.name}
            </h3>
            {user?.email && (
              <p className="text-white/80 text-sm text-center mt-1 truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hover Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}

