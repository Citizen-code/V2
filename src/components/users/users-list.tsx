'use client'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { GetUsersList, GetPagesUsersList, DeleteUser } from "@/actions/user";
import { employee, employee_level, employee_position, position, level } from "@prisma/client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import UserEdit from "./user-edit";
import { Separator } from "../ui/separator";
import UserAdd from "./user-add";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { toast } from "../ui/use-toast";
import Loading from "@/app/(main)/loading";

export default function UsersList({ levels, positions }: { levels: level[], positions: position[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState(false)
  const [alert, setAlert] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<(employee & { employee_level: (employee_level & { level: level })[], employee_position: (employee_position & { position: position })[] }) | undefined>(undefined);
  const columns: ColumnDef<(employee & { employee_level: (employee_level & { level: level })[], employee_position: (employee_position & { position: position })[] }), any>[] = [
    { accessorKey: 'id', header: '№' },
    { accessorKey: 'surname', header: 'Фамилия' },
    { accessorKey: 'name', header: 'Имя' },
    { accessorKey: 'patronymic', header: 'Отчество' },
    { accessorFn: (row => { const employee_level = row.employee_level.sort().pop(); return employee_level?.level.name ?? 'Отсутствует' }), header: 'Уровень' },
    {
      id: 'position',
      header: 'Должность',
      cell: ({ row }) => {
        return (<>
          {row.original.employee_position.length === 1 && row.original.employee_position[0].position.name}
          {row.original.employee_position.length > 1 && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Открыть список должностей</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Список должностей</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {row.original.employee_position.map(i => <DropdownMenuLabel>{i.position.name}</DropdownMenuLabel>)}
            </DropdownMenuContent>
          </DropdownMenu>}
        </>)
      },
    },
    {
      id: "actions",
      header: 'Действия',
      cell: ({ row }) => {
        const id = row.original

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
              <DropdownMenuItem onClick={() => {
                setSelectedUser(id)
                setOpen(true)
              }}>Изменить данные о сотруднике</DropdownMenuItem>
              <DropdownMenuItem>Отключить сотрудника</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedUser(id)
                setAlert(true)
              }}>Удалить данные о сотруднике</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const [data, setData] = useState<(employee & { employee_level: (employee_level & { level: level })[], employee_position: (employee_position & { position: position })[] })[]>([]);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), })
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [allPage, setAllPage] = useState<number>(1);

  const load = async () => {
    setLoadingItems(true)
    setAllPage(await GetPagesUsersList())
    setData(await GetUsersList(page))
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
      await DeleteUser(id)
      toast({
        title: "Успешно",
        description: "Сотрудник успешно удален",
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
      <h2 className="text-4xl font-bold col-span-2">Сотрудники</h2>
      <UserAdd levels={levels} positions={positions} load={load} />
    </div>
    <Separator className="my-6" />
    <UserEdit levels={levels} open={open} setOpen={setOpen} selectedUser={selectedUser} positions={positions} load={load} />
    {selectedUser !== undefined &&
      <AlertDialog open={alert} onOpenChange={setAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы точно хотите уверены?</AlertDialogTitle>
            <AlertDialogDescription>Это действие не возможно удалить. Это приведет к необратимому удалению данных сотрудника.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-between flex-grow">
            <AlertDialogCancel asChild>
              <Button variant={'outline'} onClick={() => {
                setSelectedUser(undefined)
              }}>Отменить</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => {
                Delete(selectedUser.id)
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