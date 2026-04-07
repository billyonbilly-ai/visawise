import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/ui/DashboardNavbar";
import { ProfileProvider } from "@/contexts/ProfileContext";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const initialProfile = {
    id: user.id,
    email: user.email,
    name: profileData?.name || null,
  };

  return (
    <div className="min-h-screen">
      <ProfileProvider initialProfile={initialProfile}>
        <DashboardNavbar user={user} />
        <main>{children}</main>
      </ProfileProvider>
    </div>
  );
}
