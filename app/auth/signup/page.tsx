"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "1.875rem", 
            fontWeight: "700", 
            color: "var(--foreground)",
            marginBottom: "0.5rem"
          }}>
            Create account
          </h1>
          <p style={{ 
            color: "var(--muted-foreground)", 
            fontSize: "0.875rem"
          }}>
            Sign up to get started with your account
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: "0.5rem", flexShrink: 0 }}>
              <path fillRule="evenodd" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: "0.5rem", flexShrink: 0 }}>
              <path fillRule="evenodd" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5z" />
            </svg>
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignup} className="slide-up">
          <div className="form-group" style={{ animationDelay: "0.1s" }}>
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form-input"
              placeholder="Enter your email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ animationDelay: "0.2s" }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                className="form-input"
                placeholder="Create a password (min. 4 characters)"
                type={showPassword ? "text" : "password"}
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                  padding: "0.25rem",
                  borderRadius: "0.25rem"
                }}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ animationDelay: "0.3s" }}>
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={4}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                  padding: "0.25rem"
                }}
              >
                {showConfirmPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating account...
              </>
            ) : success ? (
              "Account created!"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: "center", 
          paddingTop: "1.5rem", 
          borderTop: "1px solid var(--border)"
        }}>
          <p style={{ 
            color: "var(--muted-foreground)", 
            fontSize: "0.875rem"
          }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
