import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-ink text-white" : "text-ink hover:bg-white/80"
  }`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-clay/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="font-display text-2xl font-bold tracking-tight text-ink">
          EmberLog
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/create-post" className={navLinkClass}>
              Write
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;