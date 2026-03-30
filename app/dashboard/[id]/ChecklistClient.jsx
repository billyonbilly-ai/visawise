"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

import ChecklistSection from "./ChecklistSection";
import Button from "@/components/ui/Button";

const supabase = createClient();

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
  const checked = items.filter((i) => i.is_checked).length;
  const total = items.length;
  const progress = Math.round((checked / total) * 100);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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

  const displayStatus =
    status === "preparing" && allMandatoryChecked ? "awaiting" : status;

  const statusBadge = {
    preparing: "bg-yellow-50 text-yellow-500 border border-yellow-200",
    awaiting: "bg-neutral-100 text-neutral-500 border border-neutral-300",
    submitted: "bg-[#f0faf4] text-[#16a34a] border border-[#a3d9b8]",
    approved: "bg-[#f0faf4] text-[#16a34a] border border-[#a3d9b8]",
    rejected: "bg-red-50 text-red-600 border border-red-200",
  };

  const statusLabel = {
    preparing: "Preparing",
    awaiting: "Awaiting submission",
    submitted: "Submitted",
    approved: "Approved",
    rejected: "Rejected",
  };

  const progressBarColor = (() => {
    if (status === "submitted") return "bg-brand-green";
    if (allMandatoryChecked) return "bg-brand-black";
    return "bg-yellow-400";
  })();

  const progressTextColor = (() => {
    if (status === "submitted") return "text-brand-green";
    if (allMandatoryChecked) return "text-neutral-500";
    return "text-yellow-500";
  })();

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard">
          <Button type="outline">← My Applications</Button>
        </Link>

        <div className="card-shadow mt-7.5 flex items-center justify-between rounded-xl bg-white px-5 py-6">
          <div className="flex items-center gap-3">
            <Image
              src={`https://flagcdn.com/h40/${country.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/h80/${country.code.toLowerCase()}.png 2x,
                  https://flagcdn.com/h120/${country.code.toLowerCase()}.png 3x`}
              width={32}
              height={32}
              className="h-5 w-8 rounded object-cover"
              unoptimized
              alt={country.name}
            />
            <h1 className="font-serif text-3xl leading-tight font-normal tracking-tight">
              {country.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {application.visa_types.name}
            </p>
          </div>
          <span
            className={`mt-1 shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${statusBadge[displayStatus]}`}
          >
            {statusLabel[displayStatus]}
          </span>
        </div>

        <div className="mb-6 rounded-lg border border-neutral-200 bg-white px-5 py-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className={`text-xs font-medium ${progressTextColor}`}>
              Documents gathered
            </span>
            <span className={`text-xs font-bold ${progressTextColor}`}>
              {checked} of {total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

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

        <hr className="my-6 border-neutral-200" />

        {status === "preparing" && allMandatoryChecked && (
          <div className="rounded-lg border border-[#a3d9b8] bg-[#f0faf4] px-5 py-5">
            <h2 className="text-brand-green mb-1 font-semibold">
              Ready to submit
            </h2>
            <p className="text-brand-green mb-4 text-sm leading-relaxed">
              All required documents are gathered. Once you have physically
              submitted your application to the embassy or consulate, mark it
              here.
            </p>
            <button
              onClick={handleMarkSubmitted}
              disabled={loading}
              className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-75 disabled:opacity-40"
            >
              {loading ? "Saving..." : "Mark as submitted →"}
            </button>
          </div>
        )}

        {status === "submitted" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-5">
            <h2 className="mb-1 font-semibold text-yellow-800">
              Application submitted
            </h2>
            <p className="mb-1 text-xs text-neutral-500">
              Submitted on {formatDate(submittedAt)}
            </p>
            {application.visa_types.processing_days && (
              <p className="mb-4 text-sm leading-relaxed text-yellow-700">
                Average processing time is{" "}
                {application.visa_types.processing_days} days. Once you hear
                back, log your outcome below.
              </p>
            )}
            {!showOutcomeForm ? (
              <button
                onClick={() => setShowOutcomeForm(true)}
                className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-75"
              >
                Log outcome
              </button>
            ) : (
              <div>
                <p className="mb-3 text-sm font-semibold text-neutral-700">
                  What was the result?
                </p>
                <div className="mb-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLogOutcome("approved")}
                    disabled={loading}
                    className="bg-brand-green rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                  >
                    ✅ Approved
                  </button>
                  <button
                    onClick={() => setShowOutcomeForm(false)}
                    disabled={loading}
                    className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400"
                  >
                    Cancel
                  </button>
                </div>
                <hr className="mb-4 border-neutral-200" />
                <p className="mb-1 text-sm font-semibold text-neutral-700">
                  Or log a rejection
                </p>
                <p className="mb-3 text-xs leading-relaxed text-neutral-500">
                  Adding the reason helps other Visawise users prepare better.
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Section 214(b) — insufficient ties to Nigeria"
                  rows={3}
                  className="focus:border-brand-green mb-3 w-full resize-none rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm transition-colors outline-none"
                />
                <button
                  onClick={() => handleLogOutcome("rejected")}
                  disabled={loading}
                  className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  ❌ Mark as rejected
                </button>
              </div>
            )}
          </div>
        )}

        {status === "approved" && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-5">
            <h2 className="mb-1 font-semibold text-green-800">
              Visa approved 🎉
            </h2>
            <p className="mb-2 text-xs text-neutral-500">
              Outcome logged on {formatDate(outcomeAt)}
            </p>
            <p className="text-brand-green text-sm">
              Congratulations. Safe travels!
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-5">
            <h2 className="mb-1 font-semibold text-red-700">
              Application rejected
            </h2>
            <p className="mb-2 text-xs text-neutral-500">
              Outcome logged on {formatDate(outcomeAt)}
            </p>
            {rejectionReason && (
              <p className="mb-4 text-sm text-red-600">
                Reason: {rejectionReason}
              </p>
            )}
            <Link
              href="/dashboard/new"
              className="text-brand-green text-sm font-semibold hover:underline"
            >
              Start a new application →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
