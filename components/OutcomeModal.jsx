"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import CheckIcon from "@/components/icons/CheckIcon";
import CancelIcon from "@/components/icons/CancelIcon";

const supabase = createClient();

export default function OutcomeModal({ application, onClose, onSuccess }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

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
    setLoading(false);
    onSuccess();
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-brand-black text-lg font-bold">Log outcome</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {application.visa_types.countries.name} —{" "}
              {application.visa_types.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 transition-colors hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        {/* Approved */}
        <div className="mb-4 rounded-xl border border-[#a3d9b8] bg-[#f0faf4] p-4">
          <p className="text-brand-black mb-3 text-sm font-semibold">
            Was your visa approved?
          </p>
          <button
            onClick={() => handleLogOutcome("approved")}
            disabled={loading}
            className="bg-brand-green flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <CheckIcon className="h-4 w-4" />
            Yes, approved
          </button>
        </div>

        {/* Divider */}
        <div className="mb-4 flex items-center gap-3">
          <hr className="flex-1 border-neutral-200" />
          <span className="text-xs text-neutral-400">or</span>
          <hr className="flex-1 border-neutral-200" />
        </div>

        {/* Rejected */}
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-brand-black mb-1 text-sm font-semibold">
            Was it rejected?
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
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <CancelIcon className="h-4 w-4" />
            Rejected
          </button>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
