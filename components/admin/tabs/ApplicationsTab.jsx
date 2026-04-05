"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminTable from "../AdminTable";

const supabase = createClient();

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        profiles(name, email),
        visa_types(
          name,
          countries(name, flag_emoji)
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error.message);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          profiles(name, email),
          visa_types(
            name,
            countries(name, flag_emoji)
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (isMounted) {
        if (error) {
          console.error("Error fetching applications:", error.message);
        } else {
          setApplications(data || []);
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
    {
      key: "user",
      label: "User",
      render: (app) => app.profiles?.name || app.profiles?.email || "—",
    },
    {
      key: "country",
      label: "Country",
      render: (app) =>
        `${app.visa_types?.countries?.flag_emoji || ""} ${
          app.visa_types?.countries?.name || "—"
        }`,
    },
    {
      key: "visa_type",
      label: "Visa Type",
      render: (app) => app.visa_types?.name || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (app) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            app.status === "preparing"
              ? "bg-yellow-100 text-yellow-800"
              : app.status === "submitted"
                ? "bg-blue-100 text-blue-800"
                : app.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {app.status}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (app) => new Date(app.created_at).toLocaleDateString(),
    },
  ];

  async function handleDelete(appId) {
    if (!confirm("Delete this application?")) return;

    setLoading(true);
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", appId);

    if (error) {
      alert("Error deleting application: " + error.message);
      setLoading(false);
      return;
    }
    fetchApplications();
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold">Applications</h2>
        <p className="text-brand-gray mt-1 text-sm">
          View and manage all visa applications
        </p>
      </div>

      <AdminTable
        data={applications}
        columns={columns}
        loading={loading}
        actions={(app) => (
          <button
            onClick={() => handleDelete(app.id)}
            className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      />
    </div>
  );
}
