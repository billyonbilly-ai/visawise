"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const VisaDataContext = createContext();

export function VisaDataProvider({ children }) {
  const [supabase] = useState(() => createClient());
  const [countries, setCountries] = useState([]);
  const [allVisaTypes, setAllVisaTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      const [countriesResult, visaTypesResult] = await Promise.all([
        supabase
          .from("countries")
          .select("*")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("visa_types")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);

      setCountries(countriesResult.data || []);
      setAllVisaTypes(visaTypesResult.data || []);
      setLoading(false);
    }

    fetchAllData();
  }, [supabase]);

  // Helper to get visa types for a specific country
  const getVisaTypesForCountry = (countryId) => {
    if (!countryId) return [];
    return allVisaTypes.filter((vt) => vt.country_id === countryId);
  };

  return (
    <VisaDataContext.Provider
      value={{ countries, allVisaTypes, getVisaTypesForCountry, loading }}
    >
      {children}
    </VisaDataContext.Provider>
  );
}

export function useVisaData() {
  const context = useContext(VisaDataContext);
  if (!context) {
    throw new Error("useVisaData must be used within VisaDataProvider");
  }
  return context;
}
