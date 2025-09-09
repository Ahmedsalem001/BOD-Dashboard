import React, { memo } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { EmptyState } from './EmptyState'

const Table = memo(({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = "No data available",
  className = "",
  onRowClick,
  ...props
}) => {
  if (loading) return <LoadingSpinner />

  if (!data?.length) return <EmptyState message={emptyMessage} />

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`table ${className}`} {...props}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`${column.headerClassName || ""} ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" : ""
                  }`}
                  onClick={column.sortable ? column.onSort : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`${
                  onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150" : ""
                } ${row.className || ""}`}
                onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td key={column.key || colIndex} className={column.cellClassName || ""}>
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

})

Table.displayName = 'Table'

export default Table
