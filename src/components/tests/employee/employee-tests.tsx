'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input'
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { category, level, result_questions, test, test_public, test_result, test_visited } from '@prisma/client';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { CreateNewPassing, GetEmployeeTests } from '@/actions/tests';
import { Badge } from '@/components/ui/badge';
import { FaRegEye } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import Loading from '@/app/(main)/loading';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import { VscPass } from "react-icons/vsc";
import { useTransition } from "react";
import { useRouter } from 'next/navigation';

export type SearchSchemaType = z.infer<typeof SearchSchema>;
const SearchSchema = z.object({
  text: z.string().max(200),
  category_id: z.number(),
  level_id: z.number(),
  type_id: z.number(),
})

export default function EmployeeTests({ categories, levels }: { categories: category[], levels: level[] }) {
  const { push } = useRouter()
  const [tests_public, setTestsPublic] = useState<(test_public & { test: test & { category: category | undefined, level: level | undefined, test_result: (test_result & { _count: { result_questions: number }, result_questions: result_questions[] })[], _count: { test_visited: number, test_questions: number, test_result: number } } })[]>([])
  const [loading, startTransition] = useTransition();
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const data = { text: '', category_id: -1, level_id: -1, type_id: 1 }
  const form = useForm<SearchSchemaType>({
    resolver: zodResolver(SearchSchema),
    mode: 'onSubmit',
    defaultValues: { text: '', category_id: -1, level_id: -1, type_id: 1 }
  })
  const load = async () => {
    setLoadingItems(true)
    setTestsPublic(await GetEmployeeTests(data))
    setLoadingItems(false)
  };
  useEffect(() => { load() }, [])
  useEffect(() => form.reset(data), [form])
  async function applyChanges(values: SearchSchemaType) {
    setLoadingItems(true)
    setTestsPublic(await GetEmployeeTests(values))
    setLoadingItems(false)
  }
  return (
    <div className="container pt-4">
      <div className='flex justify-between'>
        <h2 className="text-4xl font-bold col-span-2">Тестирования</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='default'>Параметры отображения</Button>
          </SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle>Параметры отображения</SheetTitle>
              <SheetDescription>
                {`Изменяйте параметры для регулирования списка отображаемых тестирований.`}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(applyChanges)} className='flex flex-col gap-4'>
                  <FormField control={form.control} name='text' render={({ field }) => (
                    <FormItem>
                      <FormLabel>Поиск</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите текст для поиска..." {...field} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name='category_id' render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Категории</FormLabel>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" role="combobox" className={cn("justify-between", field.value === -1 && "text-muted-foreground")}>
                              {field.value === -1 ? "Выберите категорию" : categories.find((category) => category.id === field.value)?.name}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Выберите категорию..." className="h-9" />
                            <CommandEmpty>Ни одной категории не найдено.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {categories?.map((category) => (
                                  <CommandItem value={category.name} key={category.name} onSelect={() => {
                                    if (field.value === category.id) form.setValue('category_id', -1);
                                    else form.setValue('category_id', category.id);
                                    setCategoryOpen(false)
                                  }}>
                                    {category.name}
                                    <CheckIcon className={cn("ml-auto h-4 w-4", category.id === field.value ? "opacity-100" : "opacity-0")} />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField control={form.control} name='level_id' render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Уровень</FormLabel>
                      <Popover open={levelOpen} onOpenChange={setLevelOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" role="combobox" className={cn("justify-between", field.value === -1 && "text-muted-foreground")}>
                              {field.value === -1 ? "Выберите уровень" : levels.find((level) => level.id === field.value)?.name}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Выберите уровень..." className="h-9" />
                            <CommandEmpty>Ни одного уровня не найдено.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {levels?.map((level) => (
                                  <CommandItem value={level.name} key={level.name} onSelect={() => {
                                    if (field.value === level.id) form.setValue('level_id', -1);
                                    else form.setValue('level_id', level.id);
                                    setLevelOpen(false)
                                  }}>
                                    {level.name}
                                    <CheckIcon className={cn("ml-auto h-4 w-4", level.id === field.value ? "opacity-100" : "opacity-0")} />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit" className="mt-2">Применить изменения</Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <Separator className="my-6" />
      {loadingItems && <Loading />}
      {!loadingItems && (<>
        {tests_public.length !== 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests_public.map((el) => {
            const test = el.test;
            return (<Card className='flex flex-col flex-grow'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <span className="truncate font-bold">{test.name}</span>
                  <div className='flex gap-2 flex-row-reverse'>
                    <div className='gap-2 flex'>
                      {test.level && <Badge variant={'secondary'}>{test.level.name}</Badge>}
                    </div>
                    <div className='gap-2 flex'>
                      {test.test_result.findIndex(i => Math.round(i.result_questions.map(u => u.is_correct).length / test._count.test_questions * 100) >= 90) !== -1 ? <Badge variant={'destructive'} className="bg-green-700 hover:bg-green-800">Пройдено</Badge> :
                        <Badge variant={'destructive'}>Не пройдено</Badge>}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="flex justify-between gap-2 text-muted-foreground text-sm pt-1">
                  <span className='flex gap-2'>
                    <span className="flex items-center gap-2">
                      <FaRegEye className="text-muted-foreground" />
                      <span>{test._count.test_visited ?? 0}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <VscPass className="text-muted-foreground" />
                      <span>{test._count.test_result ?? 0}</span>
                    </span>
                  </span>
                  <span className='flex gap-2'>
                    <span className="flex items-center gap-2">
                      <MdOutlineQuestionAnswer className="text-muted-foreground" />
                      <span>{test._count.test_questions ?? 0}</span>
                    </span>
                  </span>
                </CardDescription>
              </CardHeader>
              {test.description && <CardContent className="truncate text-sm text-muted-foreground">{test.description}</CardContent>}
              <CardFooter className='mt-auto'>
                {(test.test_result.findIndex(i => i._count.result_questions !== test._count.test_questions) === -1) ?
                  <Button disabled={loading} className="w-full mt-2 text-md gap-4" onClick={() => startTransition(async () => { push(`/employee/tests/${await CreateNewPassing(el.test_id)}`) })}>
                    Пройти тестирование {loading && <FaSpinner className="animate-spin px-1" />}
                  </Button> :
                  <Button variant={'destructive'} disabled={loading} className="w-full mt-2 text-md gap-4" onClick={() => startTransition(async () => { push(`/employee/tests/${test.test_result.find(i => i._count.result_questions !== test._count.test_questions)?.id}`) })}>
                    Продолжить тестирование {loading && <FaSpinner className="animate-spin px-1" />}
                  </Button>
                }
              </CardFooter>
            </Card>
            )
          })}
        </div>
        )}
        {tests_public.length === 0 && (
          <div className="flex flex-col justify-center items-center flex-grow gap-4 pt-5">
            <h2 className="text-2xl">По вашему запросу не было найдено ни одного тестирования.</h2>
          </div>
        )}
      </>)}
    </div>
  )
}