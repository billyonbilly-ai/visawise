"use client";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpInput from "@/components/auth/OtpInput";
import FormAlert from "@/components/auth/FormAlert";

export default function SigninPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);

  const [step, setStep] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getFriendlyError = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("invalid login credentials"))
      return "Incorrect email or password.";
    if (m.includes("too many requests"))
      return "Too many attempts. Please wait.";
    return msg;
  };

  // OTP handlers same as Signup
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);
    if (element.value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (data.length === 6 && !isNaN(data)) {
      setOtp(data.split(""));
      otpRefs.current[5].focus();
    }
  };

  async function handleLogin() {
    if (!email || !password) return setError("Please enter your details.");
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        await supabase.auth.resend({ type: "signup", email });
        setStep("verify");
      } else {
        setError(getFriendlyError(error.message));
      }
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  async function handleVerify() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.join(""),
      type: "signup",
    });
    if (error) {
      setError(getFriendlyError(error.message));
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <AuthLayout
      isLoginPage
      title={step === "login" ? "Sign in to Visawise" : "Confirm your email"}
      subtitle={
        step === "login"
          ? "Welcome back! Please enter your details."
          : `Enter the code sent to ${email}.`
      }
    >
      <fieldset
        disabled={loading}
        className="flex flex-col gap-4 transition-opacity disabled:opacity-60"
      >
        {step === "login" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-black text-sm font-semibold">
                Email address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`input-base ${error && !email ? "border-red-500" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-black text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`input-base ${error && password.length < 8 ? "border-red-500" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-brand-green absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.2}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.2}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <OtpInput
            otp={otp}
            otpRefs={otpRefs}
            onChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        )}

        <FormAlert message={error} />

        <Button
          className="mt-2 w-full py-3"
          callback={step === "login" ? handleLogin : handleVerify}
          loading={loading}
        >
          {step === "login" ? "Sign in" : "Confirm and sign in"}
        </Button>

        <p className="mt-2 text-center text-sm text-neutral-500">
          {step === "login" ? (
            <>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-black font-semibold hover:underline"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setStep("login")}
              className="text-xs text-neutral-400 hover:underline"
            >
              Back to login
            </button>
          )}
        </p>
      </fieldset>
    </AuthLayout>
  );
}
