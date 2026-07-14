"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "@/components/feed/PostCard";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import PostCardSkeletonList from "@/components/feed/PostCardSkletonList";
import { ChevronUp } from "lucide-react";
import SuggestionList from "@/components/feed/SuggestionList";

export default function FeedPage() {
  const { accessToken } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const postsContainerRef = useRef(null);
  const observerRef = useRef(null);
  const postRefs = useRef([]);

  // Fetch posts for specific page
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "/feed_management/public/feed/all/post",
      accessToken,
      currentPage,
    ],
    queryFn: ({ queryKey }) => {
      const [endpoint, token] = queryKey;
      return fetchWithToken({
        queryKey: [`${endpoint}?page=${currentPage}`, token],
      });
    },
    enabled: !!accessToken && hasNextPage,
    keepPreviousData: true,
  });

  // Combine posts from all pages
  useEffect(() => {
    if (data?.data) {
      if (currentPage === 1) {
        setAllPosts(data.data);
      } else {
        setAllPosts((prev) => [...prev, ...data.data]);
      }
      setPagination(data.pagination || {});
      setHasNextPage(!!data.pagination?.next_page_url);
    }
  }, [data, currentPage]);

  // Setup Intersection Observer for 60% threshold
  useEffect(() => {
    if (!postsContainerRef.current || allPosts.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const index = postRefs.current.indexOf(entry.target);
        // Calculate 60% threshold of total posts
        const threshold60Percent = Math.ceil(allPosts.length * 0.6);

        if (entry.isIntersecting && index >= threshold60Percent - 1) {
          // Trigger next page load if available
          if (
            hasNextPage &&
            !isFetching &&
            currentPage < pagination.last_page
          ) {
            setCurrentPage((prev) => prev + 1);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe the threshold post
    const thresholdIndex = Math.ceil(allPosts.length * 0.6) - 1;
    if (postRefs.current[thresholdIndex]) {
      observerRef.current.observe(postRefs.current[thresholdIndex]);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    allPosts.length,
    hasNextPage,
    isFetching,
    currentPage,
    pagination.last_page,
  ]);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading)
    return (
      <div className="p-4">
        <PostCardSkeletonList />
      </div>
    );

  return (
    <main
      className="max-w-2xl mx-auto space-y-4 mt-14 md:mt-8 p-4"
      ref={postsContainerRef}
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600">
          Latest insights and updates from your connections.
        </p>
      </div>

      {showSuggestion && (
        <SuggestionList setShowSuggestion={setShowSuggestion} />
      )}

      <div>
        {allPosts.length === 0 && !isLoading ? (
          <p className="text-center text-gray-500 py-8">No posts available</p>
        ) : (
          allPosts.map((post, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) postRefs.current[i] = el;
              }}
            >
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>

      {/* Loading indicator for next page */}
      {isFetching && currentPage > 1 && (
        <div className="flex justify-center py-8">
          <PostCardSkeletonList limit={2} />
        </div>
      )}

      {/* All posts loaded message */}
      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4 text-lg">You've reached the end of the feed!</p>
          <button
            onClick={scrollToTop}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/70 transition"
          >
            Back to Top
          </button>
        </div>
      )}

      {/* Floating scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hidden lg:block fixed bottom-6 right-6 bg-secondary text-white p-3 rounded-full shadow-lg hover:bg-secondary/70 transition z-20"
          title="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </main>
  );
}
