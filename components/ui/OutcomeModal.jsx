"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import CheckIcon from "@/components/icons/CheckIcon";
import CancelIcon from "@/components/icons/CancelIcon";
import Button from "@/components/ui/Button";

const supabase = createClient();

export default function OutcomeModal({
  application,
  onClose,
  onSuccess,
  initialStep = "outcome",
}) {
  const [step, setStep] = useState(initialStep);
  const [rejectionReason, setRejectionReason] = useState("");
  const [outcomeAt, setOutcomeAt] = useState("");
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

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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

    setOutcomeAt(now);
    setLoading(false);

    if (outcome === "approved") {
      setStep("approved");
    } else {
      onSuccess();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-brand-black text-lg font-bold">
              {step === "rejection"
                ? "Tell us why 😓"
                : step === "approved"
                  ? "Congratulations 🥳"
                  : "Log outcome"}
            </h2>
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

        {/* STEP 1 — outcome buttons */}
        {step === "outcome" && (
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
                onClick={() => setStep("rejection")}
                disabled={loading}
                className="flex-1 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500 transition-colors duration-400 hover:bg-red-100"
              >
                Rejected
              </button>
            </div>
          </>
        )}

        {/* STEP 2 — rejection reason */}
        {step === "rejection" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs leading-relaxed text-neutral-500">
              Adding the reason helps other Visawise users prepare better.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Section 214(b) — insufficient ties to Nigeria"
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
              {initialStep !== "rejection" && (
                <Button
                  type="outline"
                  callback={() => setStep("outcome")}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
            </div>
          </div>
        )}

        {/* SUCCESS STEP — Approved message */}
        {step === "approved" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-800">
              Visa approved.
            </p>
            <p className="text-xs text-neutral-500">
              Approved on {formatDate(outcomeAt)}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Wishing you safe travels!
            </p>
            <Button type="outline" callback={onSuccess} className="mt-4 w-full">
              Close
            </Button>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
