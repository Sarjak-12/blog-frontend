import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/client";

const initialForm = {
  title: "",
  content: "",
  image_url: "",
};

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        content: form.content,
      };

      if (form.image_url.trim()) {
        payload.image_url = form.image_url.trim();
      }

      const response = await api.post("/posts", payload);
      toast.success("Post created successfully");
      navigate(`/posts/${response.data?.data?.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h1 className="font-display text-4xl text-ink">Write a new post</h1>
      <p className="mt-2 text-sm text-slate-600">Share an idea, tutorial, or story with readers.</p>

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
          disabled={loading}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </section>
  );
};

export default CreatePostPage;