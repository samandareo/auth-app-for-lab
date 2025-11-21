"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          router.push('/auth/login');
          return;
        }

        if (!session) {
          router.push('/auth/login');
          return;
        }

        setSession(session);
        setUser(session.user);
      } catch (error) {
        console.error('Dashboard session error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Hide footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/auth/login');
        } else {
          setSession(session);
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      // Show footer when leaving dashboard
      const footer = document.querySelector('footer');
      if (footer) {
        footer.style.display = 'block';
      }
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{ margin: "2rem auto" }}></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div style={{ textAlign: "center" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: "var(--foreground)",
              marginBottom: "1rem"
            }}>
              Access Denied
            </h2>
            <p style={{ 
              color: "var(--muted-foreground)", 
              marginBottom: "1.5rem"
            }}>
              You need to be signed in to access this page.
            </p>
            <button 
              onClick={() => router.push('/auth/login')} 
              className="btn btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border)"
        }}>
          <h1 style={{ 
            fontSize: "1.875rem", 
            fontWeight: "700", 
            color: "var(--foreground)"
          }}>
            Dashboard
          </h1>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: "0.5rem" }}>
              <path fillRule="evenodd" d="M2 2.75A.75.75 0 0 1 2.75 2h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 2 13.25V2.75zm6.56 4.5l1.97-1.97a.75.75 0 1 1 1.06 1.06L10.06 8l1.53 1.53a.75.75 0 1 1-1.06 1.06L8.56 8.62a.75.75 0 0 1 0-1.06z"/>
            </svg>
            Sign Out
          </button>
        </div>

        {/* Welcome Section */}
        <div style={{ 
          background: "var(--muted)", 
          borderRadius: "var(--radius)", 
          padding: "1.5rem", 
          marginBottom: "2rem"
        }}>
          <h2 style={{ 
            fontSize: "1.25rem", 
            fontWeight: "600", 
            color: "var(--foreground)", 
            marginBottom: "0.5rem"
          }}>
            Welcome back! 👋
          </h2>
          <p style={{ 
            color: "var(--muted-foreground)"
          }}>
            You're successfully signed in to your account.
          </p>
        </div>

        {/* User Profile Card */}
        <div style={{ 
          background: "var(--card)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--radius)", 
          padding: "1.5rem", 
          marginBottom: "2rem"
        }}>
          <h3 style={{ 
            fontSize: "1.125rem", 
            fontWeight: "600", 
            color: "var(--foreground)", 
            marginBottom: "1rem"
          }}>
            Profile Information
          </h3>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "500", 
                color: "var(--muted-foreground)", 
                marginBottom: "0.25rem"
              }}>
                Email Address
              </label>
              <p style={{ 
                color: "var(--foreground)", 
                fontSize: "1rem"
              }}>
                {user.email}
              </p>
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "500", 
                color: "var(--muted-foreground)", 
                marginBottom: "0.25rem"
              }}>
                User ID
              </label>
              <p style={{ 
                color: "var(--foreground)", 
                fontSize: "0.875rem", 
                fontFamily: "var(--font-mono)", 
                background: "var(--muted)", 
                padding: "0.25rem 0.5rem", 
                borderRadius: "0.25rem", 
                wordBreak: "break-all"
              }}>
                {user.id}
              </p>
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "500", 
                color: "var(--muted-foreground)", 
                marginBottom: "0.25rem"
              }}>
                Member Since
              </label>
              <p style={{ 
                color: "var(--foreground)", 
                fontSize: "1rem"
              }}>
                {joinDate}
              </p>
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                fontWeight: "500", 
                color: "var(--muted-foreground)", 
                marginBottom: "0.25rem"
              }}>
                Session Status
              </label>
              <p style={{ 
                color: "var(--primary)", 
                fontSize: "0.875rem",
                fontWeight: "500"
              }}>
                ✅ Active Session
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
