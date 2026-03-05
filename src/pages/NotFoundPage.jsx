import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-white p-10 text-center shadow-card">
      <p className="font-display text-7xl text-ink">404</p>
      <h1 className="mt-4 font-display text-3xl text-ink">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600">The page you requested does not exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
      >
        Go Home
      </Link>
    </section>
  );
};

export default NotFoundPage;