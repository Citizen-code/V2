'use client'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { GetUsersList, GetPagesUsersList, DeleteUser } from "@/actions/user";
import { employee, employee_level, employee_position, position, level, category, test, type_test, test_public } from "@prisma/client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserEdit from "./test-edit";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { toast } from "@/components/ui/use-toast";
import Loading from "@/app/(main)/loading";
import TestEdit from "./test-edit";
import { DeleteTest, GetPagesTestsList, GetTestsList } from "@/actions/tests";

export default function TestsList({ levels, categories }: { levels: level[], categories: category[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState(false)
  const [alert, setAlert] = useState<boolean>(false);
  const [selectedTest, setSelectedTest] = useState<(test & {level:level, category:category, type_test:type_test, test_public:test_public | null, employee:employee, _count:{test_questions:number,test_result:number}}) | undefined>(undefined);
  const columns: ColumnDef<(test & {level:level, category:category, type_test:type_test, test_public:test_public | null, employee:employee, _count:{test_questions:number,test_result:number}}), any>[] = [
    { accessorKey: 'id', header: '№' },
    { accessorKey: 'name', header: 'Наименование' },
    { accessorKey: 'category.name', header: 'Категория' },
    { accessorKey: 'level.name', header: 'Уровень' },
    { accessorKey: 'type_test.name', header: 'Тип' },
    { accessorKey: '_count.test_questions', header: 'Кол. вопросов' },
    { accessorKey: '_count.test_result', header: 'Кол. прохождений' },
    { accessorFn: (row => { 
      return row.test_public === null ? "Черновик" : row.test_public?.date.toLocaleDateString()
    }), header: 'Опубликовано' },
    { accessorFn: (row => { const el = row.employee; return `${el.surname} ${el.name[0]}.${el.patronymic[0]}.` }), header: 'Автор' },
    {
      id: "actions",
      header: 'Действия',
      cell: ({ row }) => {
        const data = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Открыть действия</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Подробнее о тестировании</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => {
                setSelectedTest(data)
                setOpen(true)
              }}>Изменить данные о тестировании</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedTest(data)
                setAlert(true)
              }}>Удалить тестирование</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const [data, setData] = useState<(test & {level:level, category:category, type_test:type_test, test_public:test_public | null, employee:employee, _count:{test_questions:number,test_result:number}})[]>([]);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [allPage, setAllPage] = useState<number>(1);

  const load = async () => {
    setLoadingItems(true)
    setAllPage(await GetPagesTestsList({}))
    setData(await GetTestsList({page}))
    setLoadingItems(false)
  }

  useEffect(() => {
    load();
  }, [page, search])

  const getPages = () => {
    const list: number[] = [];
    if (allPage > 3) {
      for (let index = page <= 3 ? 2 : page - 2; index < (page < allPage - 3 ? page + 3 : allPage); index++) {
        list.push(index);
      }
    } else {
      if (allPage >= 2) {
        for (let index = 2; index < allPage; index++) {
          list.push(index);
        }
      }
    }
    return list;
  }

  async function Delete(id: string) {
    try {
      await DeleteTest(id)
      toast({
        title: "Успешно",
        description: "Тестирование успешно удалено",
      });
      setOpen(false)
      load();
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Что-то пошло не так, пожалуйста попробуйте позже",
        variant: "destructive",
      });
    }
  }

  return <div className="container pt-4">
    <div className='flex justify-between'>
      <h2 className="text-4xl font-bold col-span-2">Тестирования</h2>
      {/* <UserAdd levels={levels} positions={positions} load={load} /> */}
    </div>
    <Separator className="my-6" />
    <TestEdit levels={levels} open={open} setOpen={setOpen} selectedTest={selectedTest} load={load} />
    {selectedTest !== undefined &&
      <AlertDialog open={alert} onOpenChange={setAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы точно хотите уверены?</AlertDialogTitle>
            <AlertDialogDescription>Это действие не возможно удалить. Это приведет к необратимому удалению данных тестирования.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-between flex-grow">
            <AlertDialogCancel asChild>
              <Button variant={'outline'} onClick={() => {
                setSelectedTest(undefined)
              }}>Отменить</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => {
                Delete(selectedTest.id)
              }}>Продолжить</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}
    <div className="p-2 flex">
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
    {loadingItems && <Loading />}
    {!loadingItems && <>
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
      {allPage !== 1 && data.length !== 0 && <Pagination className="p-1">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive={page === 1} role='button' onClick={() => setPage(1)}>{1}</PaginationLink>
          </PaginationItem>
          {page > 3 && <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>}
          {getPages().map(i =>
            <PaginationItem>
              <PaginationLink isActive={page === i} role='button' onClick={() => setPage(i)}>{i}</PaginationLink>
            </PaginationItem>
          )}
          {page < allPage - 3 && <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>}
          <PaginationItem>
            <PaginationLink isActive={page === allPage} role='button' onClick={() => setPage(allPage)}>{allPage}</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>}
    </>}
  </div >
}

function enableHiding(): boolean | undefined {
  throw new Error("Function not implemented.");
}
