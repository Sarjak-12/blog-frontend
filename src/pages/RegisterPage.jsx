import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, authLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (error) {
      // Toast is handled in AuthContext.
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h1 className="font-display text-3xl text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-slate-600">Publish your first post in minutes.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Name</span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={50}
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none transition focus:border-ember"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none transition focus:border-ember"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-ink">
          <span>Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            maxLength={72}
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none transition focus:border-ember"
          />
        </label>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {authLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-ocean hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;
