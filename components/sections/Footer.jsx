"use client";

import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-4 py-12 lg:px-20 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="max-w-sm">
          <div className="mb-3">
            <Logo />
          </div>
          <p className="text-sm text-neutral-600">
            Helping Nigerian travelers navigate the visa process with clarity,
            structure, and ease.
          </p>
          <p className="mt-4 text-xs text-neutral-600">
            © {new Date().getFullYear()} Visawise. All rights reserved.
          </p>
          <p className="mt-4 text-sm text-neutral-600">
            Built with 🖤 by{" "}
            <a
              href="https://x.com/billyonbilly"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-green underline"
            >
              Billy
            </a>
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 uppercase">
            Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/signup" className="hover:text-brand-green">
                Sign up
              </a>
            </li>

            <li>
              <Link
                href="/#faq"
                className="hover:text-brand-green"
                onClick={(e) => {
                  const el = document.getElementById("faq");
                  if (window.location.pathname === "/" && el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                FAQ
              </Link>
            </li>
            <li>
              <a href="/contact" className="hover:text-brand-green">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 uppercase">
            Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/legal" className="hover:text-brand-green">
                Terms of service
              </a>
            </li>
            <li>
              <a href="/legal" className="hover:text-brand-green">
                Privacy policy
              </a>
            </li>
          </ul>
        </div>

        {/* More */}
        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 uppercase">
            More
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/updates" className="hover:text-brand-green">
                Updates
              </a>
            </li>
            {/* <li>
              <a href="/updates" className="hover:text-brand-green">
                CineBuddy
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </footer>
  );
}
