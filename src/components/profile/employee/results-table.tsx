"use client"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ResultsTable({ data }: {data: any[]}) {
  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'id', header: '№' },
    { accessorKey: 'test.name', header: 'Тестирование' },
    { accessorKey: 'test.category.name', header: 'Категория' },
    { accessorKey: 'test.level.name', header: 'Уровень' },
    { accessorKey: 'test._count.test_questions', header: 'Кол. вопросов' },
    { accessorFn:(row => {const el = row.test.employee; return `${el.surname} ${el.name[0]}.${el.patronymic[0]}.`}), header: 'Автор' },
    { accessorFn:(row => row.date.toLocaleString().slice(0,10)), header: 'Дата начала' },
    { accessorKey: '_count.result_questions', header: 'Кол. отвеченных' },
    { accessorFn:(row => {
      if(row.test._count.test_questions !== row._count.result_questions) return 'Тестирование не окончено'
      else {
        let corrected = 0;
        for (let index = 0; index < row.result_questions.length; index++) {
          const element = row.result_questions[index];
        }
        return (row.result_questions.length / 100) * corrected
      }
    }), header: 'Результат' },

  ]
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), })

  return (
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}