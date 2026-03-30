"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="flex w-full items-center justify-between border-b border-black/6 px-8 py-4 min-[1200px]:px-38">
        {/* 1. Left: Logo (Occupies 1/3 on Desktop) */}
        <div className="flex min-[1001px]:flex-1">
          <Logo href="/" />
        </div>

        {/* 2. Middle: Navlinks (Visible only > 1000px) */}
        <div className="hidden flex-1 items-center justify-center min-[1001px]:flex">
          <Link
            href="/faq"
            className="text-brand-black text-sm font-medium transition-opacity hover:opacity-70"
          >
            FAQ
          </Link>
        </div>

        {/* 3. Right: Login Button (Visible only > 1000px) */}
        <div className="hidden flex-1 justify-end min-[1001px]:flex">
          <Button type="outline" href="/signin">
            Log in
          </Button>
        </div>

        {/* 4. Right: Mobile Hamburger (Visible only <= 1000px) */}
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

      {/* Sidebar Overlay (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/10 backdrop-blur-sm transition-opacity min-[1001px]:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar (Mobile Only) */}
      <div
        className={`bg-brand-background fixed top-0 right-0 z-70 h-full shadow-2xl transition-transform duration-300 ease-in-out min-[1001px]:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-full md:w-1/2`}
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
              href="/faq"
              className="text-brand-black text-lg font-medium transition-opacity hover:opacity-70"
              onClick={toggleSidebar}
            >
              FAQ
            </Link>

            <div className="h-px w-full bg-black/9" />

            <div className="pt-2">
              <Button
                type="outline"
                href="/signin"
                className="w-full"
                onClick={toggleSidebar}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
