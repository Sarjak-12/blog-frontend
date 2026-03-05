import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const from = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate(from, { replace: true });
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h1 className="font-display text-3xl text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to create posts and join discussions.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-ink/20 px-4 py-3 outline-none transition focus:border-ember"
          />
        </label>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {authLoading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        No account yet?{" "}
        <Link to="/register" className="font-semibold text-ember hover:underline">
          Create one
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;