"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, isAdminEmail } from "@/lib/supabase-auth";

function redirectToLogin(params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);
  redirect(`/login?${searchParams.toString()}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectToLogin({ error: "Email and password are required." });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirectToLogin({ error: "Invalid email or password." });
  }

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    redirectToLogin({ error: "This account is not authorized for admin access." });
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login?message=Signed out.");
}
