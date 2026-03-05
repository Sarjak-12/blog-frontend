import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/date";

const ProfilePage = () => {
  const { fetchProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <h1 className="font-display text-4xl text-ink">{profile.user.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{profile.user.email}</p>
        <p className="mt-1 inline-flex rounded-full bg-clay px-3 py-1 text-xs font-semibold uppercase text-ink">
          {profile.user.role}
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Your posts</h2>
          <Link to="/create-post" className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">
            New Post
          </Link>
        </div>

        <div className="space-y-3">
          {profile.posts.length === 0 ? (
            <p className="text-sm text-slate-600">No posts yet.</p>
          ) : (
            profile.posts.map((post) => (
              <article key={post.id} className="rounded-xl border border-ink/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink">
                    <Link to={`/posts/${post.id}`} className="hover:text-ember">
                      {post.title}
                    </Link>
                  </h3>
                  <span className="text-xs text-slate-500">{formatDate(post.created_at)}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;