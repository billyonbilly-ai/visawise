import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
  title,
  subtitle,
  isLoginPage = false,
  isResetPage = false,
}) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-3 py-12 md:px-8">
      <div className="w-full max-w-lg">
        <div className="card-shadow flex flex-col gap-6 rounded-xl bg-white px-5 py-8 md:px-8">
          <Link className="-mb-3 flex" href="/">
            <Image
              src="/icon.svg"
              alt="Visawise"
              width={40}
              height={40}
              priority
            />
          </Link>
          <div className="space-y-3">
            <h1 className="text-brand-black text-xl font-bold">{title}</h1>
            <p className="text-brand-gray text-sm">{subtitle}</p>
          </div>
          {children}
        </div>

        {!isResetPage && (
          <p className="mt-8 text-center text-xs text-neutral-400">
            By {isLoginPage ? "signing in" : "signing up"}, you agree to our{" "}
            <Link
              href="/legal"
              className="text-brand-black font-medium transition-colors hover:underline"
            >
              Terms of Service and Privacy Policy
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
