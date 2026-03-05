import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/date";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const canManage = user && (user.id === post.author_id || user.role === "admin");

  return (
    <article className="animate-rise overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="space-y-3 p-5">
        <h2 className="font-display text-2xl text-ink">
          <Link to={`/posts/${post.id}`} className="hover:text-ember">
            {post.title}
          </Link>
        </h2>

        <p className="max-h-24 overflow-hidden text-sm leading-6 text-slate-700">{post.content}</p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>By {post.author_name}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/posts/${post.id}`}
            className="rounded-full bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Read Post
          </Link>

          {canManage && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="rounded-full border border-ink/20 px-3 py-1 text-xs font-medium text-ink"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete?.(post.id)}
                className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
