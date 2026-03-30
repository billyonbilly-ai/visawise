"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CustomSelect from "@/components/CustomSelect";
import Button from "@/components/Button";

const supabase = createClient();

export default function NewApplicationPage() {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedVisaType, setSelectedVisaType] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      const { data } = await supabase
        .from("countries")
        .select("*")
        .eq("is_active", true)
        .order("name");
      setCountries(data || []);
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchVisaTypes() {
      if (!selectedCountry) {
        setVisaTypes([]);
        setSelectedVisaType("");
        return;
      }
      const { data } = await supabase
        .from("visa_types")
        .select("*")
        .eq("country_id", selectedCountry)
        .eq("is_active", true)
        .order("name");
      setVisaTypes(data || []);
      setSelectedVisaType("");
    }
    fetchVisaTypes();
  }, [selectedCountry]);

  async function handleSubmit() {
    if (!selectedCountry || !selectedVisaType || !employmentStatus) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        visa_type_id: selectedVisaType,
        status: "preparing",
      })
      .select()
      .single();

    if (appError) {
      setError(appError.message);
      setLoading(false);
      return;
    }

    const { data: requirements, error: reqError } = await supabase
      .from("requirements")
      .select("*")
      .eq("visa_type_id", selectedVisaType)
      .order("sort_order");

    if (reqError) {
      setError(reqError.message);
      setLoading(false);
      return;
    }

    const filtered = requirements.filter(
      (req) => req.condition === null || req.condition === employmentStatus,
    );

    const checklistItems = filtered.map((req) => ({
      application_id: application.id,
      requirement_id: req.id,
      is_checked: false,
    }));

    const { error: checklistError } = await supabase
      .from("checklist_items")
      .insert(checklistItems);

    if (checklistError) {
      setError(checklistError.message);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/${application.id}`);
  }

  const countryOptions = countries.map((c) => ({
    value: c.id,
    label: c.name,
    code: c.code,
  }));

  const visaTypeOptions = visaTypes.map((vt) => ({
    value: vt.id,
    label: vt.name,
  }));

  const employmentOptions = [
    { value: "employed", label: "Employed (full-time)" },
    { value: "self_employed", label: "Self-employed / Freelance" },
    { value: "student", label: "Student" },
    { value: "business_owner", label: "Business owner" },
    { value: "retired", label: "Retired" },
    { value: "unemployed", label: "Unemployed" },
  ];

  function renderCountryOption(option) {
    return (
      <div className="flex items-center gap-2.5">
        <Image
          src={`https://flagcdn.com/h40/${option.code.toLowerCase()}.png`}
          width={24}
          height={16}
          className="h-4 w-6 shrink-0 rounded object-cover"
          unoptimized
          alt={option.label}
        />
        <span
          className={`text-sm ${
            option.value === selectedCountry
              ? "font-semibold text-neutral-900"
              : "text-neutral-700"
          }`}
        >
          {option.label}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-background px-3 py-8 md:px-8">
      <div className="mx-auto max-w-lg">
        <Link href={loading ? "#" : "/dashboard"}>
          <Button type="outline" disabled={loading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 rotate-180"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                clipRule="evenodd"
              />
            </svg>{" "}
            My Applications
          </Button>
        </Link>

        <div className="card-shadow mt-7.5 flex flex-col gap-6 rounded-xl bg-white px-5 py-6">
          <div className="font-bold">Create a new visa checklist</div>

          {/* This fieldset disables all nested inputs when loading is true */}
          <fieldset
            disabled={loading}
            className="group flex flex-col gap-6 transition-opacity duration-300 disabled:opacity-60"
          >
            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-black text-sm font-semibold">
                Destination country
              </label>
              <CustomSelect
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Select a country..."
                renderOption={renderCountryOption}
                renderSelected={renderCountryOption}
              />
            </div>

            {/* Visa type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-black text-sm font-semibold">
                Visa type
              </label>
              <CustomSelect
                options={visaTypeOptions}
                value={selectedVisaType}
                onChange={setSelectedVisaType}
                placeholder={
                  selectedCountry
                    ? "Select visa type..."
                    : "Select a country first"
                }
                disabled={!selectedCountry || loading}
              />
            </div>

            {/* Employment status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-black text-sm font-semibold">
                Employment status
              </label>
              <CustomSelect
                options={employmentOptions}
                value={employmentStatus}
                onChange={setEmploymentStatus}
                placeholder="Select status..."
              />
              <p className="text-xs leading-relaxed text-neutral-500">
                This helps us filter out documents that don't apply to your
                situation.
              </p>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              className="w-full py-3 text-[16px]"
              callback={handleSubmit}
              disabled={loading}
              loading={loading}
            >
              Build my checklist
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </fieldset>
        </div>

        <p className="mt-7.5 text-center text-xs text-neutral-500">
          Need help?{" "}
          <a
            href="mailto:billy@visawise.ng"
            className="text-brand-black hover:text-brand-green underline transition-colors"
          >
            billy@visawise.ng
          </a>
        </p>
      </div>
    </div>
  );
}
