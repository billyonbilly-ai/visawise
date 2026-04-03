"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ApplicationCard from "@/components/ui/ApplicationCard";
import Loading from "@/app/Loading";

const supabase = createClient();

function SectionHeader({ title, count, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="mb-5 flex w-full items-center justify-between"
    >
      <p className="text-md font-semibold">
        {title}
        <span className="text-brand-gray ml-2 text-sm font-normal">
          ({count})
        </span>
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={`text-brand-gray h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      >
        <path
          fillRule="evenodd"
          d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOpen, setActiveOpen] = useState(true);
  const [submittedOpen, setSubmittedOpen] = useState(true);

  const fetchApplications = useCallback(async () => {
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

    const apps = data || [];
    if (apps.length === 0) {
      router.replace("/dashboard/new");
      return;
    }
    setApplications(apps);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    async function load() {
      await fetchApplications();
    }
    load();
  }, [fetchApplications]);

  const active = applications.filter((a) => a.status === "preparing");
  const submitted = applications.filter((a) =>
    ["submitted", "approved", "rejected"].includes(a.status),
  );

  return (
    <div className="px-3 py-8 pb-16 min-[1200px]:px-38">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <Button type="primary">
              <Link href="/dashboard/new">+ New application</Link>
            </Button>
          </div>

          {active.length > 0 && (
            <div className="mb-10">
              <SectionHeader
                title="Ongoing Applications"
                count={active.length}
                open={activeOpen}
                onToggle={() => setActiveOpen((p) => !p)}
              />
              {activeOpen && (
                <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2 min-[1490px]:grid-cols-3">
                  {active.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onOutcomeLogged={fetchApplications}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {submitted.length > 0 && (
            <div>
              <SectionHeader
                title="Submitted Applications"
                count={submitted.length}
                open={submittedOpen}
                onToggle={() => setSubmittedOpen((p) => !p)}
              />
              {submittedOpen && (
                <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2 min-[1490px]:grid-cols-3">
                  {submitted.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onOutcomeLogged={fetchApplications}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
