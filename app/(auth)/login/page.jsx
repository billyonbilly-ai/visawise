"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login"); // 'login' | 'verify'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        // resend OTP and show verify step
        const { error: resendError } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        if (resendError) {
          setError(resendError.message);
          setLoading(false);
          return;
        }
        setStep("verify");
        setLoading(false);
        return;
      }
      setError(error.message);
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
        <h1>Confirm your email</h1>
        <p>
          Your email isn't verified yet. We sent a confirmation code to{" "}
          <strong>{email}</strong>.
        </p>

        <input
          type="text"
          placeholder="Enter code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        {error && <p>{error}</p>}

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Confirm and sign in"}
        </button>

        <button onClick={handleResend}>Resend code</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign in</h1>

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

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
