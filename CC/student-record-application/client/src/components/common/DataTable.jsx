export default function DataTable({ columns, data, loading, emptyMessage = 'No records found', rowKey = '_id' }) {
  if (loading) {
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>{columns.map((c) => <th key={c.key} className="th">{c.label}</th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} className="td">
                    <div className="skeleton h-4 w-24 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead><tr>{columns.map((c) => <th key={c.key} className="th">{c.label}</th>)}</tr></thead>
          <tbody className="bg-white">
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📭</span>
                  <p className="text-slate-500 text-sm font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>{columns.map((c) => <th key={c.key} className="th">{c.label}</th>)}</tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-50">
          {data.map((row) => (
            <tr key={row[rowKey] || row.id} className="tr-hover">
              {columns.map((col) => (
                <td key={col.key} className="td">
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
