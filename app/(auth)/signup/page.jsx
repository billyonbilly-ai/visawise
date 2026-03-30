"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // 'signup' | 'verify'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setStep("verify");
    setLoading(false);
  }

  async function handleVerify() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  async function handleResend() {
    setError("");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) return setError(error.message);
    setError("Code resent — check your email.");
  }

  if (step === "verify") {
    return (
      <div>
        <h1>Check your email</h1>
        <p>
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to
          confirm your account.
        </p>

        <input
          type="text"
          placeholder="6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        {error && <p>{error}</p>}

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Confirm account"}
        </button>

        <button onClick={handleResend}>Resend code</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Create account</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p>{error}</p>}

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p>
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
}
