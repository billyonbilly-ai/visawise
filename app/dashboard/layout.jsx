import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <DashboardNavbar user={user} />
      <main>{children}</main>
    </div>
  );
}
