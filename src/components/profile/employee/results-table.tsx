"use client"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ResultsTable({ data }: { data: any[] }) {
  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'id', header: '№', enableSorting: true, enableResizing: true },
    { accessorKey: 'test.name', header: 'Тестирование' },
    { accessorKey: 'test.category.name', header: 'Категория' },
    { accessorKey: 'test.level.name', header: 'Уровень' },
    { accessorKey: 'test._count.test_questions', header: 'Кол. вопросов' },
    { accessorFn: (row => { const el = row.test.employee; return `${el.surname} ${el.name[0]}.${el.patronymic[0]}.` }), header: 'Автор' },
    { accessorFn: (row => row.date.toLocaleString().slice(0, 10)), header: 'Дата начала' },
    {
      accessorFn: (row => {
        if (row.test._count.test_questions !== row._count.result_questions) return 'Тестирование не окончено'
        else return Math.round(((row.result_questions.filter((i: any) => i.is_correct).length / row.test._count.test_questions) * 100))
      }), header: 'Результат',
      cell: (props) => {
        const value = props.getValue();
        if(value === 'Тестирование не окончено') return <Badge variant={'destructive'}>{value}</Badge>
        if(value <= 49) return <Badge variant={'destructive'}>{value}%</Badge>
        if(value <= 89) return <Badge variant={'destructive'} className="bg-yellow-700  hover:bg-yellow-800">{value}%</Badge>
        else return <Badge variant={'destructive'} className="bg-green-700  hover:bg-green-800">{value}%</Badge>
      }
    },

  ]
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), })

  return (
    <>
      <div className="py-2 flex flex-col-reverse">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Столбцы <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.columnDef.header?.toString() ?? column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                  Нет результатов.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}