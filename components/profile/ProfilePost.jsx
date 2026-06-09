import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import PostCardSkeletonList from "../feed/PostCardSkletonList";
import PostCard from "../feed/PostCard";

export default function ProfilePost() {
  const { accessToken, userInfo } = useAppContext();
  const router = useRouter();
  // Fetch personal posts
  const { data, isLoading, error } = useQuery({
    queryKey: [
      `/feed_management/private/feeds/all/post/${userInfo.id}`,
      accessToken,
    ],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const posts = data?.data || [];

  if (isLoading) return <PostCardSkeletonList />;
  if (error)
    return (
      <p className="text-red-400 text-center mt-10">Failed to load feed</p>
    );

  if (posts.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col items-center">
        <p className="text-amber-800 font-medium">No posts yet</p>
        <p className="text-sm text-amber-700 mt-1">
          Start sharing with your audience by creating your first post.
        </p>
        <button
          type="button"
          onClick={() => router.push("/app/create")}
          className="mt-4 inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 transition"
        >
          Add your first post
        </button>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post, i) => (
        <PostCard key={i} post={post} />
      ))}
    </div>
  );
}
