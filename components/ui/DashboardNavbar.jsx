"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";

export default function DashboardNavbar({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const supabase = createClient();

  const { profile } = useProfile();

  // 👇 derive display name from global state
  const displayName = profile?.name || user.email.split("@")[0];

  const placeholder = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="flex w-full items-center justify-between border-b border-black/6 px-3 py-4 min-[1200px]:px-38">
      <Logo href="/dashboard" />

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-black/5"
        >
          <span className="bg-brand-gray/50 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white">
            {placeholder}
          </span>

          <span className="text-brand-black max-w-30 truncate text-sm font-medium">
            {displayName}
          </span>
        </button>

        {open && (
          <div className="bg-brand-background absolute top-[120%] right-0 z-50 flex w-56 flex-col gap-2 rounded-xl border border-black/9 p-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-0.5 border-b border-black/6 pb-2">
              <span className="text-brand-black truncate text-sm font-semibold">
                {displayName}
              </span>
              <span className="text-brand-gray truncate text-xs">
                {user.email}
              </span>
            </div>

            <div className="flex border-b border-black/6 pb-2">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium hover:bg-neutral-100"
              >
                Settings
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
