import { redirect } from "next/navigation";
import { isAdmin } from "@/utils/supabase/admin-check";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  return <AdminDashboardClient />;
}
