"use client"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";
import Loading from "@/app/(main)/loading";
import { GetLevelsEmployee } from "@/actions/user";

export function LevelsTable() {
  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'level_id', header: '№', enableSorting: true, enableResizing: true },
    { accessorKey: 'level.name', header: 'Тестирование' },
    { accessorFn: (row => row.date.toLocaleString().slice(0, 10)), header: 'Дата назначения' },
  ]
  const [data, setDate] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false)

  const load = async () => {
    setLoadingItems(true)
    setDate(await GetLevelsEmployee())
    setLoadingItems(false)
  }

  useEffect(() => { load() }, [])
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), })

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loadingItems &&
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loading />
                </TableCell>
              </TableRow>}
            {!loadingItems && <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Нет результатов.
                  </TableCell>
                </TableRow>
              )}
            </>}
          </TableBody>
        </Table>
      </div>
    </>
  )
}