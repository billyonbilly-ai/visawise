export default function AdminTable({ data, columns, loading, actions }) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-black/9 bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-black/9 bg-white">
        <div className="text-brand-gray">No data found</div>
      </div>
    );
  }

  return (
    <div className="card-shadow overflow-hidden rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-brand-black px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="text-brand-black px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/6">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-neutral-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="text-brand-black px-4 py-3 text-sm"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key] || "—"}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
