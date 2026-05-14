import Link from "next/link";
import { getAdminUser, getCurrentUser } from "@/lib/supabase-auth";
import { login, logout } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error = getSearchParam(resolvedSearchParams?.error);
  const message = getSearchParam(resolvedSearchParams?.message);
  const user = await getCurrentUser();
  const adminUser = user ? await getAdminUser() : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "28rem",
          display: "grid",
          gap: "1rem",
          padding: "1.5rem",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "1rem",
          background: "rgba(9, 11, 15, 0.84)",
        }}
      >
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Admin Login
          </p>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>Conscious Cooper</h1>
          <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.72)" }}>
            Sign in with a Supabase Auth account that is listed in
            `ADMIN_EMAILS`.
          </p>
        </div>

        {error ? (
          <p style={{ margin: 0, color: "#ff9b8a" }}>{error}</p>
        ) : null}

        {message ? (
          <p style={{ margin: 0, color: "#9dd6b5" }}>{message}</p>
        ) : null}

        {adminUser ? (
          <>
            <p style={{ margin: 0 }}>
              Signed in as <strong>{adminUser.email}</strong>.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/dashboard">Go to dashboard</Link>
              <form action={logout}>
                <button type="submit">Sign out</button>
              </form>
            </div>
          </>
        ) : user ? (
          <>
            <p style={{ margin: 0, color: "#ffcf70" }}>
              Signed in as <strong>{user.email}</strong>, but that account is not
              on the admin allowlist.
            </p>
            <form action={logout}>
              <button type="submit">Sign out</button>
            </form>
          </>
        ) : (
          <form action={login} style={{ display: "grid", gap: "0.75rem" }}>
            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>

            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit">Sign in</button>
          </form>
        )}
      </section>
    </main>
  );
}
