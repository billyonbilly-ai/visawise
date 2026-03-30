"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import OutcomeModal from "@/components/OutcomeModal";
import CheckIcon from "@/components/icons/CheckIcon";
import CancelIcon from "@/components/icons/CancelIcon";
import Button from "./Button";

export default function ApplicationCard({ app, onOutcomeLogged }) {
  const [showModal, setShowModal] = useState(false);
  const total = app.checklist_items.length;
  const checked = app.checklist_items.filter((i) => i.is_checked).length;
  const progress = total > 0 ? Math.round((checked / total) * 100) : 0;
  const country = app.visa_types.countries;
  const allChecked = progress === 100;

  const badge = (() => {
    if (app.status === "submitted")
      return { label: "Submitted", classes: "bg-[#f0faf4] text-brand-green" };
    if (app.status === "approved") return null;
    if (app.status === "rejected") return null;
    if (allChecked)
      return {
        label: "Awaiting submission",
        classes: "bg-neutral-100 text-brand-black",
      };
    return { label: "Preparing", classes: "bg-yellow-50 text-yellow-500" };
  })();

  const barColor = (() => {
    if (app.status === "submitted") return "bg-brand-green";
    if (allChecked) return "bg-brand-black";
    return "bg-yellow-400";
  })();

  const progressTextColor = (() => {
    if (app.status === "submitted") return "text-brand-green";
    if (allChecked) return "text-brand-black";
    return "text-yellow-500";
  })();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="card-shadow flex flex-col justify-between rounded-[20px] bg-white px-5 py-4 transition-all duration-200">
        <div className="mb-8 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Image
              src={`https://flagcdn.com/h40/${country.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/h80/${country.code.toLowerCase()}.png 2x, https://flagcdn.com/h120/${country.code.toLowerCase()}.png 3x`}
              width={32}
              height={20}
              className="mt-1 h-5 w-8 rounded object-cover"
              unoptimized
              alt={country.name}
            />
            <div>
              <p className="text-sm leading-snug font-semibold text-neutral-800">
                {country.name}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {app.visa_types.name}
              </p>
            </div>
          </div>
          {badge && (
            <span
              className={`shrink-0 rounded px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${badge.classes}`}
            >
              {badge.label}
            </span>
          )}
        </div>

        {["preparing", "submitted"].includes(app.status) && (
          <div className="mb-4.5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="items center flex gap-1.5">
                <span className="text-[11px] text-neutral-400">
                  {checked} of {total} documents{" "}
                  {app.status === "submitted" ? "submitted" : "ready"}
                </span>
                {app.status === "submitted" && (
                  <span
                    onClick={() => setShowModal(true)}
                    className="text-brand-green hover:text-brand-green cursor-pointer text-[12px] font-bold hover:underline"
                  >
                    Log outcome ❯
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-semibold ${progressTextColor}`}
              >
                {progress}%
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            {app.status === "approved" && (
              <p className="text-brand-green flex items-center gap-1 text-[11px] font-medium">
                <CheckIcon className="h-3 w-3" />
                Approved{" "}
                {app.outcome_at ? `· ${formatDate(app.outcome_at)}` : ""}
              </p>
            )}
            {app.status === "rejected" && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                <CancelIcon className="h-3 w-3" />
                Rejected{" "}
                {app.outcome_at ? `· ${formatDate(app.outcome_at)}` : ""}
              </p>
            )}
            {app.status !== "approved" && app.status !== "rejected" && (
              <p className="text-[11px] text-neutral-400">
                Created {formatDate(app.created_at)}
              </p>
            )}
          </div>

          <Button type="ghost">
            <Link href={`/dashboard/${app.id}`}>View checklist ❯</Link>
          </Button>
        </div>
      </div>

      {showModal && (
        <OutcomeModal
          application={app}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onOutcomeLogged();
          }}
        />
      )}
    </>
  );
}
