"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminTable from "../AdminTable";
import Button from "@/components/ui/Button";

const supabase = createClient();

export default function CountriesTab() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    flag_emoji: "",
    is_active: true,
  });

  // reusable
  const fetchCountries = async () => {
    const { data } = await supabase
      .from("countries")
      .select(
        `
        *,
        visa_types:visa_types(count)
      `,
      )
      .order("name");

    setCountries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("countries")
        .select(
          `
          *,
          visa_types:visa_types(count)
        `,
        )
        .order("name");

      setCountries(data || []);
      setLoading(false);
    };

    load();
  }, []);

  const columns = [
    {
      key: "flag_emoji",
      label: "",
      render: (country) => (
        <span className="text-2xl">{country.flag_emoji}</span>
      ),
    },
    { key: "name", label: "Country" },
    { key: "code", label: "Code" },
    {
      key: "visa_types",
      label: "Visa Types",
      render: (country) => country.visa_types?.[0]?.count || 0,
    },
    {
      key: "is_active",
      label: "Status",
      render: (country) =>
        country.is_active ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-brand-gray">Inactive</span>
        ),
    },
  ];

  function handleEdit(country) {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      code: country.code,
      flag_emoji: country.flag_emoji,
      is_active: country.is_active,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingCountry) {
      const { error } = await supabase
        .from("countries")
        .update(formData)
        .eq("id", editingCountry.id);

      if (error) {
        alert("Error updating country: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("countries").insert([formData]);

      if (error) {
        alert("Error creating country: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingCountry(null);
    setFormData({ name: "", code: "", flag_emoji: "", is_active: true });

    fetchCountries();
  }

  async function handleDelete(countryId) {
    if (
      !confirm(
        "Delete this country? This will also delete all associated visa types.",
      )
    )
      return;

    const { error } = await supabase
      .from("countries")
      .delete()
      .eq("id", countryId);

    if (error) {
      alert("Error deleting country: " + error.message);
      return;
    }

    fetchCountries();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Countries</h2>
          <p className="text-brand-gray mt-1 text-sm">Manage countries</p>
        </div>
        <Button
          type="primary"
          callback={() => {
            setEditingCountry(null);
            setFormData({
              name: "",
              code: "",
              flag_emoji: "",
              is_active: true,
            });
            setShowForm(true);
          }}
        >
          + Add Country
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-black/9 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {editingCountry ? "Edit Country" : "Add New Country"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-brand-black mb-1.5 block text-sm font-semibold">
                  Country Name
                </label>
                <input
                  type="text"
                  className="input-base"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-brand-black mb-1.5 block text-sm font-semibold">
                  Country Code
                </label>
                <input
                  type="text"
                  className="input-base"
                  placeholder="e.g., US, GB, CA"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-brand-black mb-1.5 block text-sm font-semibold">
                Flag Emoji
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="🇺🇸"
                value={formData.flag_emoji}
                onChange={(e) =>
                  setFormData({ ...formData, flag_emoji: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
              <label htmlFor="is_active" className="text-sm">
                Active (visible to users)
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="primary" buttonType="submit">
                {editingCountry ? "Update" : "Create"}
              </Button>
              <Button
                type="outline"
                callback={() => {
                  setShowForm(false);
                  setEditingCountry(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <AdminTable
        data={countries}
        columns={columns}
        loading={loading}
        actions={(country) => (
          <>
            <button
              onClick={() => handleEdit(country)}
              className="text-brand-black rounded px-2 py-1 text-xs hover:bg-neutral-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(country.id)}
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
