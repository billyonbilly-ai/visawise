"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import CustomSelect from "@/components/ui/CustomSelect";
import { useVisaData } from "@/contexts/VisaDataContext";

const GlobeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 16.5H19.5M5.5 8.5H19.5M4.5 12.5H20.5M12.5 20.5C12.5 20.5 8 18.5 8 12.5C8 6.5 12.5 4.5 12.5 4.5M12.5 4.5C12.5 4.5 17 6.5 17 12.5C17 18.5 12.5 20.5 12.5 20.5M12.5 4.5V20.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z"
      stroke="#595451"
      strokeWidth="0.8"
    />
  </svg>
);

const getFlagUrl = (code) => {
  let flagCode = code.toLowerCase();
  if (flagCode === "uk") flagCode = "gb";
  return `https://flagcdn.com/h40/${flagCode}.png`;
};

export default function HeroSection() {
  const { countries, getVisaTypesForCountry } = useVisaData();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedVisaType, setSelectedVisaType] = useState("");

  // Derive visa types from selected country instead of using effect
  const visaTypes = useMemo(() => {
    if (!selectedCountry) return [];
    return getVisaTypesForCountry(selectedCountry);
  }, [selectedCountry, getVisaTypesForCountry]);

  // Handle country change
  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedVisaType(""); // Reset visa type when country changes
  };

  const countryOptions = countries.map((c) => ({
    value: c.id,
    label: c.name,
    code: c.code,
  }));

  const visaTypeOptions = visaTypes.map((vt) => ({
    value: vt.id,
    label: vt.name,
  }));

  const renderFlagAndCode = (opt) => {
    const isSelected = selectedCountry === opt.value;
    return (
      <div className="flex items-center gap-2">
        <Image
          src={getFlagUrl(opt.code)}
          width={24}
          height={16}
          className="h-3.5 w-5 shrink-0 rounded-sm object-cover"
          unoptimized
          alt={opt.label}
        />
        <span
          className={`text-sm font-bold transition-colors ${isSelected ? "text-brand-green" : "text-neutral-800"}`}
        >
          {opt.code.toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-10 px-4 pt-8 pb-12 lg:pt-16 lg:pb-24">
      <div className="text-center">
        <p className="text-brand-green bg-brand-green-light mx-auto mb-3.5 w-fit rounded-md p-1 text-[10px]">
          Built for Nigerians
        </p>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:mb-8 md:text-6xl">
          Get your visa right <br /> the first time
        </h1>
        <p className="text-brand-gray mx-auto mb-8 max-w-md text-lg md:text-xl">
          Get personalized document checklists that are tailored to your exact
          situation.
        </p>

        <div className="mx-auto w-64">
          <div className="flex flex-col gap-1.5">
            <div className="flex w-full gap-1.5">
              <div className="w-18.75 shrink-0 text-left">
                <CustomSelect
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  placeholder={<GlobeIcon />}
                  renderSelected={renderFlagAndCode}
                  renderOption={renderFlagAndCode}
                />
              </div>
              <div className="flex-1 text-left">
                <CustomSelect
                  options={visaTypeOptions}
                  value={selectedVisaType}
                  onChange={setSelectedVisaType}
                  placeholder="Select visa type"
                  disabled={!selectedCountry}
                />
              </div>
            </div>
            <Button
              className="w-full py-3 text-[16px]"
              href={
                selectedCountry && selectedVisaType
                  ? `/signup?country=${selectedCountry}&visa=${selectedVisaType}`
                  : "/signup"
              }
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
          </div>
        </div>
      </div>
    </section>
  );
}
