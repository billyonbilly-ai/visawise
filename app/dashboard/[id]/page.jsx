import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import ChecklistClient from "./ChecklistClient";

export default async function ApplicationPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: application } = await supabase
    .from("applications")
    .select(
      `
      *,
      visa_types (
        name,
        processing_days,
       countries (
  name,
  code,
  flag_emoji
)
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!application) notFound();

  const { data: checklistItems } = await supabase
    .from("checklist_items")
    .select(
      `
      *,
      requirements (
        name,
        description,
        is_mandatory
      )
    `,
    )
    .eq("application_id", application.id)
    .order("created_at");

  return (
    <ChecklistClient
      application={application}
      initialItems={checklistItems || []}
    />
  );
}
