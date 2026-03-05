import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/client";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/date";

const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data?.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Post not found");
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete post");
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading post..." />;
  }

  if (!post) {
    return null;
  }

  const canManage = user && (user.id === post.author_id || user.role === "admin");

  return (
    <div className="space-y-8">
      <article className="overflow-hidden rounded-3xl bg-white shadow-card">
        {post.image_url && (
          <img src={post.image_url} alt={post.title} className="h-72 w-full object-cover" />
        )}

        <div className="space-y-5 p-6 sm:p-8">
          <header className="space-y-3">
            <h1 className="font-display text-4xl text-ink sm:text-5xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span>By {post.author_name}</span>
              <span>{formatDate(post.created_at)}</span>
              {post.updated_at !== post.created_at && <span>Updated {formatDate(post.updated_at)}</span>}
            </div>
          </header>

          <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700 sm:text-base">
            {post.content}
          </p>

          {canManage && (
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink"
              >
                Edit Post
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </article>

      <CommentSection postId={post.id} comments={post.comments || []} onChanged={loadPost} />
    </div>
  );
};

export default SinglePostPage;