"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminTable from "../AdminTable";

const supabase = createClient();

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        applications(count)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          applications(count)
        `,
        )
        .order("created_at", { ascending: false });

      if (isMounted) {
        if (error) {
          console.error("Error fetching users:", error.message);
        } else {
          setUsers(data || []);
        }
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "applications",
      label: "Applications",
      render: (user) => user.applications?.[0]?.count || 0,
    },
    {
      key: "is_admin",
      label: "Admin",
      render: (user) => (user.is_admin ? "✅" : "—"),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (user) => new Date(user.created_at).toLocaleDateString(),
    },
  ];

  async function handleDelete(userId) {
    if (
      !confirm(
        "Delete this user? This will also delete all their applications.",
      )
    )
      return;

    setLoading(true);
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      alert("Error deleting user: " + error.message);
      setLoading(false);
      return;
    }
    fetchUsers();
  }

  async function toggleAdmin(userId, currentStatus) {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId);

    if (error) {
      alert("Error updating admin status: " + error.message);
      setLoading(false);
      return;
    }
    fetchUsers();
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold">Users</h2>
        <p className="text-brand-gray mt-1 text-sm">Manage registered users</p>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        actions={(user) => (
          <>
            <button
              onClick={() => toggleAdmin(user.id, user.is_admin)}
              className="text-brand-black rounded px-2 py-1 text-xs hover:bg-neutral-200"
            >
              {user.is_admin ? "Remove Admin" : "Make Admin"}
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        )}
      />
    </div>
  );
}
