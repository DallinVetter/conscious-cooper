import type { Metadata } from "next";
import { ContentManager } from "./_components/content-manager";

export const metadata: Metadata = {
  title: "Dashboard | Conscious Cooper",
  description: "Internal content manager for Conscious Cooper.",
};

export default function DashboardPage() {
  return <ContentManager />;
}
