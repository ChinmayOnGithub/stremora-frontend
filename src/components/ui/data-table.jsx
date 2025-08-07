import React from "react";
import { useTable } from "react-table";

/**
 * DataTable
 * Props:
 *  - columns: Array of { Header, accessor, Cell?, id? }
 *  - data: rows array
 *  - loading: boolean
 */
export function DataTable({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="rounded-md border bg-card text-foreground overflow-x-auto">
      <table {...getTableProps()} className="min-w-full divide-y divide-border">
        <thead className="bg-muted text-muted-foreground">
          {headerGroups.map((hg) => (
            <tr key={hg.id} {...hg.getHeaderGroupProps()}>
              {hg.headers.map((col) => (
                <th
                  key={col.id}
                  {...col.getHeaderProps()}
                  className="px-4 py-2 text-left text-xs font-semibold uppercase"
                >
                  {col.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="divide-y divide-border bg-card"
        >
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                No data found.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  key={row.id}
                  {...row.getRowProps()}
                  className="hover:bg-muted transition-colors"
                >
                  {row.cells.map((cell) => (
                    <td
                      key={cell.column.id}
                      {...cell.getCellProps()}
                      className="px-4 py-2 text-sm"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
