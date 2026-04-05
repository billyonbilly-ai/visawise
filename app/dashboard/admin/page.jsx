import { redirect } from "next/navigation";
import { isAdmin } from "@/utils/supabase/admin-check";

export default async function AdminPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}
