import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import api from "../api/client";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/posts", {
        params: search ? { search } : {},
      });
      setPosts(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const emptyMessage = useMemo(() => {
    if (search && posts.length === 0) {
      return "No posts match your search.";
    }

    if (posts.length === 0) {
      return "No blog posts yet. Be the first to write one.";
    }

    return null;
  }, [search, posts]);

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted");
      await loadPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete post");
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await loadPosts();
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-ocean/20 via-white to-ember/20 p-6 sm:p-8">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">Stories with sharp edges.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          Explore insights, tutorials, and ideas from the community. Authenticated users can publish,
          edit, and discuss posts.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, content, or author"
            className="w-full rounded-full border border-ink/20 px-5 py-3 text-sm outline-none transition focus:border-ember"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading posts..." />
      ) : (
        <>
          {emptyMessage ? (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-600 shadow-card">
              {emptyMessage}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default HomePage;