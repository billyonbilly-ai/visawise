"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import ChecklistSection from "./ChecklistSection";
import Button from "@/components/ui/Button";

const supabase = createClient();

function HourglassIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      <path d="M5 2h14M5 22h14M6 2v4c0 3 6 6 6 6s6-3 6-6V2M6 22v-4c0-3 6-6 6-6s6 3 6 6v4" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      <path d="M4 12.5l5.5 5.5L20 7" />
    </svg>
  );
}

function XIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function CircularProgress({ progress, color, bg, icon, size = 52 }) {
  const stroke = 2.8;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill={bg} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="relative z-10" style={{ color: color }}>
        {icon}
      </div>
    </div>
  );
}

export default function ChecklistClient({ application, initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState(application.status);
  const [submittedAt, setSubmittedAt] = useState(application.submitted_at);
  const [outcomeAt, setOutcomeAt] = useState(application.outcome_at);
  const [rejectionReason, setRejectionReason] = useState(
    application.rejection_reason || "",
  );
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const country = application.visa_types.countries;
  const mandatoryItems = items.filter((i) => i.requirements.is_mandatory);
  const optionalItems = items.filter((i) => !i.requirements.is_mandatory);
  const allMandatoryChecked = mandatoryItems.every((i) => i.is_checked);
  const mandatoryChecked = mandatoryItems.filter((i) => i.is_checked).length;
  const mandatoryTotal = mandatoryItems.length;

  const progress =
    mandatoryTotal > 0
      ? Math.round((mandatoryChecked / mandatoryTotal) * 100)
      : 0;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const displayStatus =
    status === "preparing" && allMandatoryChecked ? "awaiting" : status;

  const statusConfig = {
    preparing: {
      label: "Preparing",
      color: "#FACC15",
      bgColor: "#fefce8",
      bgClass: "bg-yellow-50 text-yellow-500 border border-yellow-200",
      icon: <HourglassIcon className="h-5 w-5" />,
    },
    awaiting: {
      label: "Awaiting submission",
      color: "#FACC15",
      bgColor: "#fefce8",
      bgClass: "bg-yellow-50 text-yellow-500 border border-yellow-200",
      icon: <HourglassIcon className="h-5 w-5" />,
    },
    submitted: {
      label: "Submitted",
      color: "#f97316",
      bgColor: "#fff7ed",
      bgClass: "bg-orange-50 text-orange-500 border border-orange-200",
      icon: <HourglassIcon className="h-5 w-5" />,
    },
    approved: {
      label: "Approved",
      color: "#16a34a",
      bgColor: "#f0faf4",
      bgClass: "bg-[#f0faf4] text-brand-green border border-[#a3d9b8]",
      icon: <CheckIcon className="h-5 w-5" />,
    },
    rejected: {
      label: "Rejected",
      color: "#ef4444",
      bgColor: "#fef2f2",
      bgClass: "bg-red-50 text-red-500 border border-red-200",
      icon: <XIcon className="h-5 w-5" />,
    },
  };

  const current = statusConfig[displayStatus];

  async function toggleItem(item) {
    if (status !== "preparing") return;
    const newChecked = !item.is_checked;
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              is_checked: newChecked,
              checked_at: newChecked ? new Date().toISOString() : null,
            }
          : i,
      ),
    );
    const { error } = await supabase
      .from("checklist_items")
      .update({
        is_checked: newChecked,
        checked_at: newChecked ? new Date().toISOString() : null,
      })
      .eq("id", item.id);
    if (error) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_checked: item.is_checked } : i,
        ),
      );
    }
  }

  async function handleMarkSubmitted() {
    setLoading(true);
    setError("");
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("applications")
      .update({ status: "submitted", submitted_at: now })
      .eq("id", application.id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setStatus("submitted");
    setSubmittedAt(now);
    setLoading(false);
  }

  async function handleLogOutcome(outcome) {
    setLoading(true);
    setError("");
    const now = new Date().toISOString();
    const updates = {
      status: outcome,
      outcome_at: now,
      ...(outcome === "rejected" && rejectionReason
        ? { rejection_reason: rejectionReason }
        : {}),
    };
    const { error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", application.id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setStatus(outcome);
    setOutcomeAt(now);
    setShowOutcomeForm(false);
    setLoading(false);
  }

  const checklistContent = (
    <>
      <ChecklistSection
        sectionItems={mandatoryItems}
        label="Required documents"
        status={status}
        onToggle={toggleItem}
      />
      {optionalItems.length > 0 && (
        <ChecklistSection
          sectionItems={optionalItems}
          label="Optional but recommended"
          status={status}
          onToggle={toggleItem}
        />
      )}
    </>
  );

  return (
    <div className="px-3 py-8 min-[1200px]:px-38">
      <Link href="/dashboard">
        <Button type="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 rotate-180"
          >
            <path
              fillRule="evenodd"
              d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
              clipRule="evenodd"
            />
          </svg>
          My Applications
        </Button>
      </Link>

      <div className="mt-6 flex flex-col gap-6 min-[941px]:flex-row min-[941px]:items-start">
        <div className="w-full min-[941px]:w-1/2">
          <div className="card-shadow flex flex-col gap-4 rounded-lg bg-white px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={`https://flagcdn.com/h40/${country.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/h80/${country.code.toLowerCase()}.png 2x`}
                  width={32}
                  height={20}
                  className="h-5 w-8 rounded object-cover"
                  unoptimized
                  alt={country.name}
                />
                <div>
                  <p className="text-sm leading-snug font-semibold text-neutral-800">
                    {country.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {application.visa_types.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                <CircularProgress
                  progress={progress}
                  color={current.color}
                  bg={current.bgColor}
                  icon={current.icon}
                  size={40}
                />
                <span
                  className={`shrink-0 rounded px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${current.bgClass}`}
                >
                  {current.label}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">
                {mandatoryChecked} of {mandatoryTotal} mandatory documents
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: current.color }}
              >
                {progress}%
              </span>
            </div>
          </div>

          <div className="mt-6 hidden min-[941px]:block">
            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {checklistContent}
          </div>
        </div>

        <div className="w-full min-[941px]:w-1/2">
          <div className="card-shadow rounded-lg bg-white px-3 py-3 sm:px-5 sm:py-5">
            {(status === "preparing" || status === "submitted") && (
              <div>
                {!showOutcomeForm && (
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="mb-2 text-sm font-semibold text-neutral-800">
                        {status === "submitted"
                          ? "Application Submitted, fingers crossed."
                          : allMandatoryChecked
                            ? "All mandatory documents gathered 🎉"
                            : mandatoryChecked === 0
                              ? "Start by checking off the documents"
                              : "You're making progress"}
                      </h2>
                      <p className="mb-3.5 text-sm text-neutral-500">
                        {status === "submitted"
                          ? `Submitted on ${formatDate(submittedAt)}`
                          : allMandatoryChecked
                            ? "Mark it as submitted here to track wait time."
                            : `${mandatoryTotal - mandatoryChecked} documents remaining`}
                      </p>
                    </div>
                  </div>
                )}
                {allMandatoryChecked && status !== "submitted" && (
                  <Button
                    type="primary"
                    callback={handleMarkSubmitted}
                    loading={loading}
                    className="w-full"
                  >
                    Mark as submitted
                  </Button>
                )}
              </div>
            )}

            <div
              className={
                status !== "submitted" &&
                status !== "approved" &&
                status !== "rejected"
                  ? "pointer-events-none opacity-40"
                  : ""
              }
            >
              {status === "submitted" && !showOutcomeForm && (
                <>
                  <p className="text-brand-black mb-4 text-sm">
                    Help other travelers by sharing your outcome. Was your
                    application:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLogOutcome("approved")}
                      disabled={loading}
                      className="text-brand-green flex-1 rounded-lg border border-[#a3d9b8] bg-[#f0faf4] p-2 text-sm transition-colors duration-400 hover:bg-[#cbf4db]"
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setShowOutcomeForm(true)}
                      disabled={loading}
                      className="flex-1 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500 transition-colors duration-400 hover:bg-red-100"
                    >
                      Rejected
                    </button>
                  </div>
                </>
              )}

              {status === "submitted" && showOutcomeForm && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-neutral-700">
                    Tell us why 😓
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Section 214(b) — insufficient ties"
                    rows={3}
                    className="focus:border-brand-green w-full resize-none rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm transition-colors outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLogOutcome("rejected")}
                      disabled={loading}
                      className="flex-1 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500 transition-colors duration-400 hover:bg-red-100"
                    >
                      Submit
                    </button>
                    <Button
                      type="outline"
                      callback={() => setShowOutcomeForm(false)}
                      disabled={loading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {status === "approved" && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-neutral-800">
                    Visa approved 🎉
                  </p>
                  <p className="text-xs text-neutral-500">
                    Approved on {formatDate(outcomeAt)}
                  </p>
                </div>
              )}

              {status === "rejected" && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-neutral-800">
                    Application rejected
                  </p>
                  <p className="text-xs text-neutral-500">
                    Rejected on {formatDate(outcomeAt)}
                  </p>
                  <Link href="/dashboard/new" className="mt-2">
                    <Button>
                      Start a new application{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 min-[941px]:hidden">
            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {checklistContent}
          </div>
        </div>
      </div>
    </div>
  );
}
