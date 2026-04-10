"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/auth/AuthLayout";
import FormAlert from "@/components/auth/FormAlert";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [sent, setSent] = useState(false);

  async function sendResetEmail() {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await sendResetEmail();

    setLoading(false);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    setSent(true);
    setMessage(
      <>
        Password reset link sent to{" "}
        <span className="text-md font-bold">{email}</span>.
      </>,
    );
    setMessageType("success");
  }

  async function handleResend() {
    setResending(true);

    const { error } = await sendResetEmail();

    setResending(false);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    setMessage(
      <>
        Another reset link has been sent to{" "}
        <span className="font-bold">{email}</span>.
      </>,
    );
    setMessageType("success");
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
      isLoginPage={false}
      isResetPage={true}
    >
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-black text-sm font-semibold">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="input-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <FormAlert message={message} type={messageType} />

          {sent && (
            <div className="mt-0 flex flex-col items-center gap-2">
              <p className="text-center text-sm text-neutral-500">
                Didn't receive the email? Check your spam folder or resend it.
              </p>

              <Button
                className="w-full py-3"
                callback={handleResend}
                loading={resending}
              >
                Resend email
              </Button>
            </div>
          )}

          {!sent && (
            <Button
              className="mt-2 w-full py-3"
              buttonType="submit"
              loading={loading}
            >
              Send reset link
            </Button>
          )}

          <p className="mt-2 text-center text-sm text-neutral-500">
            Remembered it?{" "}
            <Link
              href="/signin"
              className="text-brand-black font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </fieldset>
      </form>
    </AuthLayout>
  );
}
