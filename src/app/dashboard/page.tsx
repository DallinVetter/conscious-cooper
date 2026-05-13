import type { Metadata } from "next";
import { ProductManager } from "./_components/content-manager";

export const metadata: Metadata = {
  title: "Dashboard | Conscious Cooper",
  description: "Internal product manager for Conscious Cooper.",
};

export default function DashboardPage() {
  return <ProductManager />;
}
