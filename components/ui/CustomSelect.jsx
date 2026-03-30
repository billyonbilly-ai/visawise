"use client";
import { useState, useRef, useEffect } from "react";

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  renderOption,
  renderSelected,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option) {
    if (disabled) return;
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className={`relative ${disabled ? "pointer-events-none opacity-40" : ""}`}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex h-10.5 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-sm transition-all duration-200 outline-none ${
          open
            ? "border-brand-green ring-brand-green/20 ring-1"
            : "border-neutral-300 hover:border-neutral-400"
        } ${disabled ? "bg-neutral-50" : ""}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {selected ? (
            renderSelected ? (
              renderSelected(selected)
            ) : (
              <span className="text-neutral-800">{selected.label}</span>
            )
          ) : (
            <span className="flex items-center text-neutral-400">
              {placeholder}
            </span>
          )}
        </div>

        <span
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${
            open ? "text-brand-green rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-md">
          <div className="max-h-50 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex cursor-pointer items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-neutral-200/65 ${
                  value === option.value ? "bg-brand-green/5" : ""
                } `}
              >
                <div className="flex-1">
                  {renderOption ? (
                    renderOption(option)
                  ) : (
                    <span
                      className={`text-sm ${
                        value === option.value
                          ? "text-brand-green font-semibold"
                          : "text-neutral-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  )}
                </div>
                {/* Checkmark removed as requested */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
