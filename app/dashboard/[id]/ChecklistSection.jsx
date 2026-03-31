export default function ChecklistSection({
  sectionItems,
  label,
  status,
  onToggle,
}) {
  return (
    <div className="mb-20">
      <p className="text-brand-black mb-5 text-sm font-semibold">{label}</p>
      <div className="card-shadow overflow-hidden rounded-xl bg-white">
        {sectionItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onToggle(item)}
            className={`flex items-start gap-3 px-5 py-4 transition-colors ${index !== sectionItems.length - 1 ? "border-b border-neutral-100" : ""} ${status === "preparing" ? "cursor-pointer hover:bg-neutral-50" : "cursor-default opacity-60"} `}
          >
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${item.is_checked ? "bg-brand-black border-brand-black" : "border-neutral-300 bg-white"}`}
            >
              {item.is_checked && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p
                className={`mb-1 text-sm leading-snug font-semibold ${item.is_checked ? "text-neutral-400 line-through" : "text-neutral-800"}`}
              >
                {item.requirements.name}
              </p>
              <p className="text-xs leading-relaxed text-neutral-500">
                {item.requirements.description}
              </p>
              {!item.requirements.is_mandatory && (
                <span className="mt-1.5 inline-block rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">
                  Optional
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
