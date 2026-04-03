"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";

import Link from "next/link";

import Button from "@/components/ui/Button";
import CheckIcon from "@/components/icons/CheckIcon";
import BinIcon from "@/components/icons/BinIcon";
import EditIcon from "@/components/icons/EditIcon";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const { profile, setProfile } = useProfile();

  const [name, setName] = useState(profile?.name || "");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function handleSaveName(e) {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);

    await supabase.from("profiles").upsert({
      id: profile.id,
      name: name.trim(),
    });

    setProfile((prev) => ({
      ...prev,
      name: name.trim(),
    }));

    setSaving(false);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  async function handleDeleteAccount() {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );
    if (!confirmDelete) return;

    await supabase.from("profiles").delete().eq("id", profile.id);
    await supabase.auth.signOut();

    router.push("/");
  }

  if (!profile) return null;

  return (
    <>
      {showToast && (
        <div className="animate-toast fixed top-6 left-1/2 z-50">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-4">
            <span className="bg-brand-green flex items-center justify-center rounded-full p-1.5">
              <CheckIcon className="h-4 w-4 text-white" />
            </span>
            <span className="text-brand-black text-sm">
              Name updated successfully
            </span>
          </div>
        </div>
      )}
      <main className="px-3 py-12 min-[1200px]:px-38">
        <div className="mx-auto max-w-lg">
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
              </svg>{" "}
              Back
            </Button>
          </Link>
          <h1 className="mt-7.5 mb-8 text-2xl font-extrabold tracking-tight">
            Settings
          </h1>

          <div className="flex flex-col gap-6">
            {/* PROFILE */}
            <div className="card-shadow rounded-xl border bg-white p-5">
              <h2 className="text-brand-black text-md mb-4 font-semibold">
                Profile
              </h2>

              {/* FIX 1: Form wrapper to enable submitting with 'Enter' */}
              <form
                onSubmit={handleSaveName}
                className="flex h-8 items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base h-full"
                />

                <Button
                  type="primary"
                  loading={saving}
                  className="h-full"
                  callback={handleSaveName}
                >
                  Save
                </Button>
              </form>

              <p className="text-brand-gray mt-2 text-xs">{profile.email}</p>
            </div>

            <div className="card-shadow rounded-xl border bg-white p-5">
              <h2 className="text-brand-black text-md mb-4 font-semibold">
                Account
              </h2>

              <div className="flex flex-col items-start gap-3">
                <Button
                  onClick={() => router.push("/reset-password")}
                  type="outline"
                >
                  <EditIcon className="text-brand-black h-4 w-4" />
                  Reset password
                </Button>

                <Button
                  onClick={handleDeleteAccount}
                  type="outline"
                  className="border-red-100 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                >
                  <BinIcon className="h-4 w-4 text-red-500" />
                  Delete account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
