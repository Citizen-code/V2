"use client"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { GetCountPagesEmployeeResults, GetEmployeeResultsTest } from '@/actions/tests'
import Loading from "@/app/(main)/loading";
import { Input } from "@/components/ui/input";
import Pages from "@/utility/pages";

export function ResultsTable({ test }: { test: string }) {
  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'max.result.id', header: '№', enableSorting: true, enableResizing: true },
    { accessorFn: (row => { const el = row.employee; return `${el.surname} ${el.name[0]}.${el.patronymic[0]}.` }), header: 'Сотрудник' },
    { accessorFn: (row => row.max.result.date.toLocaleString().slice(0, 10)), header: 'Дата прохождения' },
    { accessorFn: (row => row.max.result.result_questions.filter((i: any) => i.is_correct).length), header: 'Кол. правильных ответов' },
    {
      accessorKey: 'max.percent', header: 'Результат',
      cell: (props) => {
        const value = props.getValue();
        if (value === 'Не завершено') return <Badge variant={'destructive'}>{value}</Badge>
        if (value <= 49) return <Badge variant={'destructive'}>{value}%</Badge>
        if (value <= 89) return <Badge variant={'destructive'} className="bg-yellow-700  hover:bg-yellow-800">{value}%</Badge>
        else return <Badge variant={'destructive'} className="bg-green-700  hover:bg-green-800">{value}%</Badge>
      }
    },

  ]
  const [data, setDate] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false)
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [allPage, setAllPage] = useState<number>(1);

  const load = async () => {
    setLoadingItems(true)
    let all = await GetCountPagesEmployeeResults(test, search);
    setAllPage(all)
    let temp = page
    if(all < temp) {
      temp = all;
      setPage(all)
    }
    setDate(await GetEmployeeResultsTest(test, search, temp))
    setLoadingItems(false)
  }

  useEffect(() => { load() }, [search, page])
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), })

  return (
    <>
      <div className="py-2 flex">
        <Input placeholder="Поиск..." className="max-w-sm" value={search} onChange={e => setSearch(e.currentTarget.value)} />
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
      {allPage !== 1 && data.length !== 0 && <Pages page={page} allPage={allPage} setPage={setPage}/>}
    </>
  )
}