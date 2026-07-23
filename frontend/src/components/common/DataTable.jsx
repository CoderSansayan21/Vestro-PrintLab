import StatusBadge from './StatusBadge.jsx';

function getCellValue(row, column) {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }

  return row?.[column.accessor || column.key];
}

function DataTable({
  columns = [],
  data = [],
  actions,
  emptyMessage = 'No records available.',
  getRowKey,
  className = '',
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-vestro-border bg-vestro-card/90 shadow-vestro-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-vestro-border text-left text-sm">
          <thead className="bg-vestro-secondary/95 text-xs font-black uppercase tracking-[0.16em] text-vestro-gold-light">
            <tr>
              {columns.map((column) => (
                <th key={column.key || column.header} scope="col" className="whitespace-nowrap px-4 py-4">
                  {column.header}
                </th>
              ))}
              {actions && <th scope="col" className="whitespace-nowrap px-4 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-vestro-border text-vestro-muted">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-sm text-vestro-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey ? getRowKey(row) : row.id || rowIndex}
                  className="transition hover:bg-vestro-gold/5"
                >
                  {columns.map((column) => {
                    const value = getCellValue(row, column);

                    return (
                      <td key={column.key || column.header} className="whitespace-nowrap px-4 py-4 align-middle">
                        {column.type === 'status' ? (
                          <StatusBadge variant={column.variant?.(value, row) || 'neutral'}>{value}</StatusBadge>
                        ) : column.render ? (
                          column.render(value, row)
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="whitespace-nowrap px-4 py-4 text-right align-middle">
                      <div className="inline-flex items-center gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
