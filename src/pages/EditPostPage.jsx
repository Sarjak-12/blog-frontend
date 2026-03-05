import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/posts/${id}`);
        const post = response.data?.data;

        const canEdit = user && (user.id === post.author_id || user.role === "admin");
        if (!canEdit) {
          toast.error("You are not allowed to edit this post");
          navigate(`/posts/${id}`, { replace: true });
          return;
        }

        setAuthorized(true);
        setForm({
          title: post.title || "",
          content: post.content || "",
          image_url: post.image_url || "",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load post");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, user?.id, user?.role]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.put(`/posts/${id}`, {
        title: form.title,
        content: form.content,
        image_url: form.image_url.trim() || null,
      });
      toast.success("Post updated");
      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading editor..." />;
  }

  if (!authorized) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h1 className="font-display text-4xl text-ink">Edit post</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Title</span>
          <input
            type="text"
            name="title"
            required
            minLength={3}
            maxLength={150}
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none transition focus:border-ember"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Image URL (optional)</span>
          <input
            type="url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none transition focus:border-ember"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Content</span>
          <textarea
            name="content"
            required
            minLength={10}
            rows={12}
            value={form.content}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 text-sm leading-7 outline-none transition focus:border-ember"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
};

export default EditPostPage;