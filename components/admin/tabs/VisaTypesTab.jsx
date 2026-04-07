"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminTable from "../AdminTable";
import Button from "@/components/ui/Button";

const supabase = createClient();

export default function VisaTypesTab() {
  const [visaTypes, setVisaTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVisa, setEditingVisa] = useState(null);
  const [formData, setFormData] = useState({
    country_id: "",
    name: "",
    slug: "",
    description: "",
    processing_days: "",
    is_active: true,
  });

  const fetchData = async () => {
    const [visaData, countryData] = await Promise.all([
      supabase
        .from("visa_types")
        .select(
          `
          *,
          countries(name, flag_emoji),
          requirements:requirements(count)
        `,
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("countries")
        .select("*")
        .eq("is_active", true)
        .order("name"),
    ]);

    setVisaTypes(visaData.data || []);
    setCountries(countryData.data || []);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [visaData, countryData] = await Promise.all([
        supabase
          .from("visa_types")
          .select(
            `
            *,
            countries(name, flag_emoji),
            requirements:requirements(count)
          `,
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("countries")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);

      setVisaTypes(visaData.data || []);
      setCountries(countryData.data || []);
      setLoading(false);
    };

    load();
  }, []);

  const columns = [
    {
      key: "country",
      label: "Country",
      render: (visa) =>
        `${visa.countries?.flag_emoji || ""} ${visa.countries?.name || "—"}`,
    },
    { key: "name", label: "Visa Type" },
    {
      key: "processing_days",
      label: "Processing",
      render: (visa) => `${visa.processing_days || "—"} days`,
    },
    {
      key: "requirements",
      label: "Requirements",
      render: (visa) => visa.requirements?.[0]?.count || 0,
    },
    {
      key: "is_active",
      label: "Status",
      render: (visa) =>
        visa.is_active ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-brand-gray">Inactive</span>
        ),
    },
  ];

  function handleEdit(visa) {
    setEditingVisa(visa);
    setFormData({
      country_id: visa.country_id,
      name: visa.name,
      slug: visa.slug,
      description: visa.description || "",
      processing_days: visa.processing_days || "",
      is_active: visa.is_active,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      processing_days: formData.processing_days
        ? parseInt(formData.processing_days)
        : null,
    };

    if (editingVisa) {
      const { error } = await supabase
        .from("visa_types")
        .update(dataToSubmit)
        .eq("id", editingVisa.id);

      if (error) {
        alert("Error updating visa type: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("visa_types")
        .insert([dataToSubmit]);

      if (error) {
        alert("Error creating visa type: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingVisa(null);
    setFormData({
      country_id: "",
      name: "",
      slug: "",
      description: "",
      processing_days: "",
      is_active: true,
    });

    fetchData();
  }

  async function handleDelete(visaId) {
    if (
      !confirm(
        "Delete this visa type? This will also delete all associated requirements.",
      )
    )
      return;

    const { error } = await supabase
      .from("visa_types")
      .delete()
      .eq("id", visaId);

    if (error) {
      alert("Error deleting visa type: " + error.message);
      return;
    }

    fetchData();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Visa Types</h2>
          <p className="text-brand-gray mt-1 text-sm">Visa categories</p>
        </div>
        <Button
          type="primary"
          callback={() => {
            setEditingVisa(null);
            setFormData({
              country_id: "",
              name: "",
              slug: "",
              description: "",
              processing_days: "",
              is_active: true,
            });
            setShowForm(true);
          }}
        >
          + Add Visa Type
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-black/9 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {editingVisa ? "Edit Visa Type" : "Add New Visa Type"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-brand-black mb-1.5 block text-sm font-semibold">
                Country
              </label>
              <select
                className="input-base"
                value={formData.country_id}
                onChange={(e) =>
                  setFormData({ ...formData, country_id: e.target.value })
                }
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flag_emoji} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="input-base"
                placeholder="Visa Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                className="input-base"
                placeholder="Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                required
              />
            </div>

            <textarea
              className="input-base"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <input
              type="number"
              className="input-base"
              placeholder="Processing days"
              value={formData.processing_days}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  processing_days: e.target.value,
                })
              }
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.checked,
                  })
                }
              />
              <label className="text-sm">Active (visible to users)</label>
            </div>

            <div className="flex gap-2">
              <Button type="primary" buttonType="submit">
                {editingVisa ? "Update" : "Create"}
              </Button>
              <Button
                type="outline"
                callback={() => {
                  setShowForm(false);
                  setEditingVisa(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <AdminTable
        data={visaTypes}
        columns={columns}
        loading={loading}
        actions={(visa) => (
          <>
            <button
              onClick={() => handleEdit(visa)}
              className="text-brand-black rounded px-2 py-1 text-xs hover:bg-neutral-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(visa.id)}
              className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        )}
      />
    </div>
  );
}
