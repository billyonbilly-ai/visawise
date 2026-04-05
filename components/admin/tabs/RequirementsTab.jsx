"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AdminTable from "../AdminTable";
import Button from "@/components/ui/Button";

const supabase = createClient();

export default function RequirementsTab() {
  const [requirements, setRequirements] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [formData, setFormData] = useState({
    visa_type_id: "",
    name: "",
    description: "",
    is_mandatory: true,
    condition: "",
    sort_order: 0,
  });

  // reusable
  const fetchData = async () => {
    const [reqData, visaData] = await Promise.all([
      supabase
        .from("requirements")
        .select(
          `
          *,
          visa_types(name, countries(name, flag_emoji))
        `,
        )
        .order("sort_order"),
      supabase
        .from("visa_types")
        .select("*, countries(name, flag_emoji)")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ]);

    setRequirements(reqData.data || []);
    setVisaTypes(visaData.data || []);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [reqData, visaData] = await Promise.all([
        supabase
          .from("requirements")
          .select(
            `
            *,
            visa_types!requirements_visa_type_id_fkey(
  name,
  countries!visa_types_country_id_fkey(name, flag_emoji)
)
          `,
          )
          .order("sort_order"),
        supabase
          .from("visa_types")
          .select("*, countries(name, flag_emoji)")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
      ]);

      setRequirements(reqData.data || []);
      setVisaTypes(visaData.data || []);
      setLoading(false);
    };

    load();
  }, []);

  const columns = [
    {
      key: "visa_type",
      label: "Visa Type",
      render: (req) =>
        `${req.visa_types?.countries?.flag_emoji || ""} ${
          req.visa_types?.countries?.name || ""
        } - ${req.visa_types?.name || "—"}`,
    },
    { key: "name", label: "Requirement" },
    {
      key: "is_mandatory",
      label: "Type",
      render: (req) =>
        req.is_mandatory ? (
          <span className="text-red-600">Mandatory</span>
        ) : (
          <span className="text-blue-600">Optional</span>
        ),
    },
    {
      key: "condition",
      label: "Condition",
      render: (req) => req.condition || "—",
    },
    { key: "sort_order", label: "Order" },
  ];

  function handleEdit(req) {
    setEditingReq(req);
    setFormData({
      visa_type_id: req.visa_type_id,
      name: req.name,
      description: req.description || "",
      is_mandatory: req.is_mandatory,
      condition: req.condition || "",
      sort_order: req.sort_order || 0,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      sort_order: parseInt(formData.sort_order) || 0,
    };

    if (editingReq) {
      const { error } = await supabase
        .from("requirements")
        .update(dataToSubmit)
        .eq("id", editingReq.id);

      if (error) {
        alert("Error updating requirement: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("requirements")
        .insert([dataToSubmit]);

      if (error) {
        alert("Error creating requirement: " + error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingReq(null);
    setFormData({
      visa_type_id: "",
      name: "",
      description: "",
      is_mandatory: true,
      condition: "",
      sort_order: 0,
    });

    fetchData();
  }

  async function handleDelete(reqId) {
    if (!confirm("Delete this requirement?")) return;

    const { error } = await supabase
      .from("requirements")
      .delete()
      .eq("id", reqId);

    if (error) {
      alert("Error deleting requirement: " + error.message);
      return;
    }

    fetchData();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Requirements</h2>
          <p className="text-brand-gray mt-1 text-sm">
            Manage visa requirements
          </p>
        </div>
        <Button
          type="primary"
          callback={() => {
            setEditingReq(null);
            setFormData({
              visa_type_id: "",
              name: "",
              description: "",
              is_mandatory: true,
              condition: "",
              sort_order: 0,
            });
            setShowForm(true);
          }}
        >
          + Add Requirement
        </Button>
      </div>

      {showForm && (
        <div className="card-shadow mb-6 rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {editingReq ? "Edit Requirement" : "Add New Requirement"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              className="input-base"
              value={formData.visa_type_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  visa_type_id: e.target.value,
                })
              }
              required
            >
              <option value="">Select visa type</option>
              {visaTypes.map((visa) => (
                <option key={visa.id} value={visa.id}>
                  {visa.countries?.flag_emoji} {visa.countries?.name} -{" "}
                  {visa.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="input-base"
              placeholder="Requirement name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <textarea
              className="input-base"
              placeholder="Requirement description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="input-base"
                placeholder="Condition (e.g self_employed"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="input-base"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_mandatory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_mandatory: e.target.checked,
                  })
                }
              />
              <label className="text-sm">Mandatory</label>
            </div>

            <div className="flex gap-2">
              <Button type="primary" buttonType="submit">
                {editingReq ? "Update" : "Create"}
              </Button>
              <Button
                type="outline"
                callback={() => {
                  setShowForm(false);
                  setEditingReq(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <AdminTable
        data={requirements}
        columns={columns}
        loading={loading}
        actions={(req) => (
          <>
            <button
              onClick={() => handleEdit(req)}
              className="text-brand-black rounded px-2 py-1 text-xs hover:bg-neutral-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(req.id)}
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
