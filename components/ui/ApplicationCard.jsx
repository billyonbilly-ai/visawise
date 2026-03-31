"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import OutcomeModal from "@/components/ui/OutcomeModal";

function HourglassIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
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
      strokeWidth="3"
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
      strokeWidth="3"
      className={className}
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function DotsIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

// --- CIRCULAR PROGRESS ---
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
        {/* Fill Background */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill={bg} />
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f5f5f5"
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
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {/* Icon in center - inherits the progress color */}
      <div className="relative z-10" style={{ color: color }}>
        {icon}
      </div>
    </div>
  );
}

// --- RELATIVE DATE ---
function relativeDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Started today";
  if (diffDays === 1) return "Started yesterday";
  return `Started ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined })}`;
}

// --- MAIN COMPONENT ---
export default function ApplicationCard({ app, onOutcomeLogged }) {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalStep, setModalStep] = useState("outcome");

  const menuRef = useRef(null);

  const mandatoryItems = app.checklist_items.filter(
    (i) => i.requirements?.is_mandatory,
  );
  const mandatoryChecked = mandatoryItems.filter((i) => i.is_checked).length;
  const mandatoryTotal = mandatoryItems.length;
  const progress =
    mandatoryTotal > 0
      ? Math.round((mandatoryChecked / mandatoryTotal) * 100)
      : 0;
  const allMandatoryChecked =
    mandatoryTotal > 0 && mandatoryChecked === mandatoryTotal;
  const country = app.visa_types.countries;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Status config with matching light backgrounds
  const statusConfig = {
    preparing: {
      label: "Preparing",
      color: "#eab308",
      bgColor: "#fefce8",
      bgClass: "bg-yellow-50 text-yellow-600 border border-yellow-200",
      icon: <HourglassIcon className="h-4.5 w-4.5" />,
    },
    submitted: {
      label: "Submitted",
      color: "#f97316",
      bgColor: "#fff7ed",
      bgClass: "bg-orange-50 text-orange-500 border border-orange-200",
      icon: <HourglassIcon className="h-4.5 w-4.5" />,
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

  const current = statusConfig[app.status];

  const menuItems = [
    {
      label: "View checklist",
      href: `/dashboard/${app.id}`,
      disabled: false,
    },
    {
      label: "Mark as submitted",
      disabled: !allMandatoryChecked || app.status !== "preparing",
    },
    {
      label: "Log outcome",
      disabled: app.status !== "submitted",
      onClick: () => {
        setMenuOpen(false);
        setShowModal(true);
      },
    },
    {
      label: "Insights",
      disabled: true,
      locked: true,
    },
  ];

  return (
    <>
      <div className="card-shadow flex flex-col gap-4 rounded-xl bg-white px-5 py-4 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src={`https://flagcdn.com/h40/${country.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/h80/${country.code.toLowerCase()}.png 2x, https://flagcdn.com/h120/${country.code.toLowerCase()}.png 3x`}
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
              <p className="text-xs text-neutral-500">{app.visa_types.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-6">
            <CircularProgress
              progress={progress}
              color={current.color}
              bg={current.bgColor}
              icon={current.icon}
              size={36}
            />

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <DotsIcon className="text-brand-gray h-7 w-7" />
              </button>

              {menuOpen && (
                <div className="absolute top-full right-0 z-50 mt-1 w-48 overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                  {menuItems.map((item, i) => (
                    <div key={i}>
                      {item.href && !item.disabled ? (
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                            item.disabled
                              ? "cursor-not-allowed text-neutral-300"
                              : "text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.locked && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3.5 w-3.5 text-neutral-300"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                              />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`w-fit rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${current.bgClass}`}
          >
            {current.label}
          </span>
          {app.status === "submitted" && (
            <span
              onClick={() => {
                setModalStep("outcome");
                setShowModal(true);
              }}
              className="text-brand-black hover:text-brand-green cursor-pointer text-[11px] transition-colors"
            >
              Let us know the outcome 🤓
            </span>
          )}
          {app.status === "rejected" && !app.rejection_reason && (
            <span
              onClick={() => {
                setModalStep("rejection");
                setShowModal(true);
              }}
              className="text-brand-black hover:text-brand-green cursor-pointer text-[11px] transition-colors"
            >
              Tell us why 😓
            </span>
          )}
          {app.status === "approved" && (
            <span className="text-brand-black text-[11px]">Bon voyage! 🥳</span>
          )}
        </div>

        <p className="text-[11px] text-neutral-500">
          <span className="font-semibold text-neutral-800">
            {mandatoryChecked} of {mandatoryTotal}
          </span>{" "}
          mandatory documents gathered
        </p>

        <p className="text-[11px] text-neutral-400">
          {relativeDate(app.created_at)}
        </p>
      </div>

      {showModal && (
        <OutcomeModal
          application={app}
          initialStep={modalStep}
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
