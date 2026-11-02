import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}