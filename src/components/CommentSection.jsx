import { useState } from "react";
import { toast } from "react-toastify";

import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/date";

const CommentSection = ({ postId, comments = [], onChanged }) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/comments", {
        content: content.trim(),
        post_id: postId,
      });
      setContent("");
      toast.success("Comment added");
      await onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      await onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete comment");
    }
  };

  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-card">
      <h3 className="font-display text-xl text-ink">Comments ({comments.length})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a thoughtful reply..."
            rows={4}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 text-sm outline-none ring-0 transition focus:border-ember"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="rounded-xl bg-clay px-4 py-3 text-sm text-ink">
          Login to comment on this post.
        </p>
      )}

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-slate-600">No comments yet.</p>
        )}

        {comments.map((comment) => {
          const canDelete =
            user && (user.id === comment.user_id || user.role === "admin");

          return (
            <article key={comment.id} className="rounded-xl border border-ink/10 p-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-600">
                <span className="font-semibold text-ink">{comment.user_name}</span>
                <span>{formatDate(comment.created_at)}</span>
              </div>

              <p className="text-sm leading-6 text-slate-700">{comment.content}</p>

              {canDelete && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CommentSection;