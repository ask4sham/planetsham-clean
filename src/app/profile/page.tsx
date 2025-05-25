"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState({ full_name: "", bio: "", location: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn("No user session found");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, bio, location")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Fetch error:", error.message);
        }

        if (data) {
          console.log("Fetched profile:", data);
          setProfile(data);
        }
      } catch (err: any) {
        console.error("Unexpected fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("No user session found");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user.id);

      if (error) {
        console.error("Update error:", error.message);
        alert("Update failed: " + error.message);
      } else {
        alert("Profile updated!");
      }
    } catch (err: any) {
      console.error("Unexpected update error:", err.message);
      alert("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧑 Edit Your Profile</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Full Name"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Location"
          value={profile.location}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
