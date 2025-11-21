"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("Debug - Session data:", data);
        console.log("Debug - Session error:", error);
        setSessionInfo({
          session: data.session,
          user: data.session?.user || null,
          error: error
        });
      } catch (err) {
        console.error("Debug - Session check error:", err);
        setSessionInfo({ error: err });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Debug - Auth state change:", event, session);
        setSessionInfo({
          session,
          user: session?.user || null,
          event
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Checking session...</div>;
  }

  return (
    <div style={{ padding: "2rem", background: "var(--background)", minHeight: "100vh" }}>
      <h1 style={{ color: "var(--foreground)", marginBottom: "2rem" }}>Session Debug</h1>
      
      <div style={{ 
        background: "var(--card)", 
        padding: "1rem", 
        borderRadius: "8px", 
        border: "1px solid var(--border)",
        marginBottom: "1rem"
      }}>
        <h2 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>Session Info</h2>
        <pre style={{ 
          color: "var(--foreground)", 
          fontSize: "12px", 
          overflow: "auto",
          background: "var(--muted)",
          padding: "1rem",
          borderRadius: "4px"
        }}>
          {JSON.stringify(sessionInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => window.location.href = "/auth/login"}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Go to Login
        </button>
        
        <button
          onClick={() => window.location.href = "/dashboard"}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}