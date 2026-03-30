"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ApplicationCard from "@/components/ui/ApplicationCard";
import Loading from "@/app/Loading";

const supabase = createClient();

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("applications")
      .select(
        `
      *,
      visa_types (
        name,
        processing_days,
        countries ( name, code, flag_emoji )
      ),
      checklist_items (
        id,
        is_checked,
        requirements (
          is_mandatory
        )
      )
    `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    async function load() {
      await fetchApplications();
    }
    load();
  }, []);

  const active = applications.filter((a) => a.status === "preparing");
  const submitted = applications.filter((a) =>
    ["submitted", "approved", "rejected"].includes(a.status),
  );

  return (
    <div className="px-8 py-8 pb-16 min-[1200px]:px-38">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <Button type="primary">
              <Link href="/dashboard/new">+ New application</Link>
            </Button>
          </div>

          {applications.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
              <p className="mb-3 text-2xl">🗂️</p>
              <p className="mb-1 text-sm font-medium text-neutral-700">
                No applications yet
              </p>
              <p className="mb-5 text-xs text-neutral-400">
                Start by creating your first visa checklist
              </p>
              <Button type="primary">
                <Link href="/dashboard/new">+ New application</Link>
              </Button>
            </div>
          )}

          {active.length > 0 && (
            <div className="mb-20">
              <p className="mb-5 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                Ongoing Applications
              </p>
              <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2">
                {active.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onOutcomeLogged={fetchApplications}
                  />
                ))}
              </div>
            </div>
          )}

          {submitted.length > 0 && (
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                Submitted Applications
              </p>
              <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2">
                {submitted.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onOutcomeLogged={fetchApplications}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
