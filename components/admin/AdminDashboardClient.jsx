"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import UsersTab from "./tabs/UsersTab";
import CountriesTab from "./tabs/CountriesTab";
import VisaTypesTab from "./tabs/VisaTypesTab";
import RequirementsTab from "./tabs/RequirementsTab";
import ApplicationsTab from "./tabs/ApplicationsTab";

const supabase = createClient();

const tabs = [
  { id: "users", label: "Users", icon: "👥" },
  { id: "applications", label: "Applications", icon: "📋" },
  { id: "countries", label: "Countries", icon: "🌍" },
  { id: "visa-types", label: "Visa Types", icon: "🛂" },
  { id: "requirements", label: "Requirements", icon: "📝" },
];

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    applications: 0,
    countries: 0,
    visaTypes: 0,
    requirements: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [users, applications, countries, visaTypes, requirements] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("applications")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("countries")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("visa_types")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("requirements")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        users: users.count || 0,
        applications: applications.count || 0,
        countries: countries.count || 0,
        visaTypes: visaTypes.count || 0,
        requirements: requirements.count || 0,
      });
    }

    fetchStats();
  }, []);

  const getStatForTab = (tabId) => {
    const mapping = {
      users: stats.users,
      applications: stats.applications,
      countries: stats.countries,
      "visa-types": stats.visaTypes,
      requirements: stats.requirements,
    };
    return mapping[tabId] || 0;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 min-[1201px]:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-black/6 bg-white transition-transform duration-300 min-[1201px]:static min-[1201px]:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/6 p-6">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-lg min-[1201px]:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-black text-white"
                    : "text-brand-black hover:bg-neutral-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                <span
                  className={`text-xs ${
                    activeTab === tab.id ? "text-white/70" : "text-brand-gray"
                  }`}
                >
                  {getStatForTab(tab.id)}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="bg-brand-background flex-1 overflow-auto">
        <div className="sticky top-0 z-30 flex items-center border-b border-black/6 bg-white p-4 min-[1201px]:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-brand-gray transition-colors hover:text-black min-[1001px]:hidden"
            aria-label="Open Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div className="p-8 max-[640px]:p-4">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "applications" && <ApplicationsTab />}
          {activeTab === "countries" && <CountriesTab />}
          {activeTab === "visa-types" && <VisaTypesTab />}
          {activeTab === "requirements" && <RequirementsTab />}
        </div>
      </main>
    </div>
  );
}
