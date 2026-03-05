import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/date";

const AdminDashboardPage = () => {
  const { user: currentUser } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
      ]);

      setStats(statsResponse.data?.data || null);
      setUsers(usersResponse.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success("User role updated");
      await loadDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Role update failed");
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 font-display text-4xl text-ink">{stats?.totalUsers ?? 0}</p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Posts</p>
          <p className="mt-2 font-display text-4xl text-ink">{stats?.totalPosts ?? 0}</p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Comments</p>
          <p className="mt-2 font-display text-4xl text-ink">{stats?.totalComments ?? 0}</p>
        </article>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-3xl text-ink">Users</h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Joined</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const targetRole = item.role === "admin" ? "user" : "admin";
                const isCurrentAdmin = currentUser?.id === item.id;

                return (
                  <tr key={item.id} className="border-b border-ink/5">
                    <td className="py-3 font-medium text-ink">{item.name}</td>
                    <td className="py-3 text-slate-600">{item.email}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-clay px-3 py-1 text-xs font-semibold uppercase text-ink">
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{formatDate(item.created_at)}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        disabled={isCurrentAdmin}
                        onClick={() => handleRoleChange(item.id, targetRole)}
                        className="rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Set {targetRole}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;