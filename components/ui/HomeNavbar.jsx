"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleFaqClick = (e) => {
    const el = document.getElementById("faq");
    if (window.location.pathname === "/" && el) {
      e.preventDefault();
      if (isOpen) toggleSidebar();
      el.scrollIntoView({ behavior: "smooth" });
    } else if (isOpen) {
      toggleSidebar();
    }
  };

  const handleLoginClick = (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }

    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      <nav className="flex w-full items-center justify-between border-b border-black/6 px-3 py-4 min-[1200px]:px-38">
        <div className="flex min-[1001px]:flex-1">
          <Logo href="/" />
        </div>

        <div className="hidden flex-1 items-center justify-center min-[1001px]:flex">
          <Link
            href="/#faq"
            className="text-brand-black text-sm font-medium transition-opacity hover:opacity-70"
            onClick={handleFaqClick}
          >
            FAQ
          </Link>
        </div>

        <div className="hidden flex-1 justify-end min-[1001px]:flex">
          <Button type="outline" callback={handleLoginClick}>
            Log in
          </Button>
        </div>

        <button
          onClick={toggleSidebar}
          className="text-brand-gray transition-colors hover:text-black min-[1001px]:hidden"
          aria-label="Open Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/10 backdrop-blur-sm transition-opacity min-[1001px]:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`bg-brand-background fixed top-0 right-0 z-70 h-full shadow-2xl transition-transform duration-300 ease-in-out min-[1001px]:hidden ${isOpen ? "translate-x-0" : "translate-x-full"} w-full md:w-1/2`}
      >
        <div className="flex flex-col p-8">
          <div className="flex items-center justify-between">
            <Logo href="/" />
            <button
              onClick={toggleSidebar}
              className="text-brand-gray transition-colors hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            <Link
              href="/#faq"
              className="text-brand-black text-lg font-medium transition-opacity hover:opacity-70"
              onClick={handleFaqClick}
            >
              FAQ
            </Link>

            <div className="h-px w-full bg-black/9" />

            <div className="pt-2">
              <Button
                type="outline"
                className="w-full"
                callback={handleLoginClick}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
