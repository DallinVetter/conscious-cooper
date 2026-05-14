import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser, getCurrentUser } from "@/lib/supabase-auth";
import { ProductManager } from "./_components/content-manager";

export const metadata: Metadata = {
  title: "Dashboard | Conscious Cooper",
  description: "Internal product manager for Conscious Cooper.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const adminUser = await getAdminUser();

  if (!adminUser) {
    redirect("/login?error=Admin access required");
  }

  return <ProductManager />;
}
