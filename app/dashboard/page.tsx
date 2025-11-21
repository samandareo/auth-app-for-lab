import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div>
        <h2>Not signed in</h2>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome {user.email}</p>

      <form action="/api/logout" method="post">
        <button type="submit">Log Out</button>
      </form>
    </div>
  );
}
