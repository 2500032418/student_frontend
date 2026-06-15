import './DataTable.css';

function DataTable({ columns, data, onEdit, onDelete, loading, emptyMessage = 'No data available' }) {
  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="actions-col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="empty-row">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key] ?? '-'}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="actions-col">
                    {onEdit && (
                      <button className="btn btn-sm btn-primary" onClick={() => onEdit(row)}>
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(row)}>
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
