import React from "react";
import Icon from "./Icon";

const Table = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = "No data available",
  className = "",
  onRowClick,
  ...props
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="spinner"></div>
              <span className="text-gray-500 dark:text-gray-400">
                Loading...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Icon name="posts" className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No data
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table 
          className={`table ${className}`} 
          role="table"
          aria-label="Data table"
          {...props}
        >
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`${column.headerClassName || ""} ${
                    column.sortable
                      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      : ""
                  }`}
                  onClick={column.sortable ? column.onSort : undefined}
                  role="columnheader"
                  aria-sort={column.sortable ? "none" : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <Icon name="sort" className="w-4 h-4 text-gray-400" />
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
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    : ""
                } ${row.className || ""}`}
                onClick={
                  onRowClick ? () => onRowClick(row, rowIndex) : undefined
                }
                role="row"
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowClick(row, rowIndex);
                  }
                } : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className={column.cellClassName || ""}
                    role="cell"
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Table sub-components
export const TableHeader = ({ children, className = "" }) => (
  <thead className={className}>{children}</thead>
);

export const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow = ({ children, className = "", onClick }) => (
  <tr
    className={`${
      onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = "", colSpan }) => (
  <td className={className} colSpan={colSpan}>
    {children}
  </td>
);

export const TableHead = ({ children, className = "", onClick, sortable }) => (
  <th
    className={`${
      sortable ? "cursor-pointer hover:bg-gray-100" : ""
    } ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-1">
      <span>{children}</span>
      {sortable && (
        <Icon name="sort" className="w-4 h-4 text-gray-400" />
      )}
    </div>
  </th>
);

export default Table;
