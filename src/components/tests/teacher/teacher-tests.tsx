'use client'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CreateTestButton from "@/components/tests/teacher/create-test-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { category, level, test, test_public, test_questions, test_result, type_test } from "@prisma/client";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { VscPass } from "react-icons/vsc";
import Link from "next/link";
import { GetTeacherTests } from "@/actions/tests";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import Loading from "@/app/(main)/loading";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";

export type SearchSchemaType = z.infer<typeof SearchSchema>;
const SearchSchema = z.object({
  text: z.string().max(200),
  category_id: z.number(),
  level_id: z.number(),
  type_id: z.number(),
  draft_view: z.boolean(),
  public_view: z.boolean(),
})

export default function TeacherTests({type, categories, levels }: { type:boolean, categories: category[], levels: level[] }) {
  const [tests, setTests] = useState<(test & { category: category | undefined, level: level | undefined, test_public: test_public | null, _count:{test_questions: number, test_result: number} })[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const data = { text: '', category_id: -1, level_id: -1, type_id: type?1:2, draft_view:true, public_view:true }
  const form = useForm<SearchSchemaType>({
    resolver: zodResolver(SearchSchema),
    mode: 'onSubmit',
    defaultValues: { text: '', category_id: -1, level_id: -1, type_id: type?1:2, draft_view:true, public_view:true }
  })
  const load = async () => {
    setLoadingItems(true)
    setTests(await GetTeacherTests(data))
    setLoadingItems(false)
  };
  useEffect(() => { load() }, [])
  useEffect(() => form.reset(data), [form])
  async function applyChanges(values: SearchSchemaType) {
    setLoadingItems(true)
    setTests(await GetTeacherTests(values))
    setLoadingItems(false)
  }
  return (
    <div className="pt-4 w-full pr-10 pl-10">
      <div className='flex justify-between'>
        <h2 className="text-3xl font-bold col-span-2">{`Ваши созданные ${type ? 'тестирования' : 'экзаменационные тестирования'}`}</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='default'>Параметры отображения</Button>
          </SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle>Параметры отображения</SheetTitle>
              <SheetDescription>
                {`Изменяйте параметры для регулирования списка отображаемых ${type ? 'тестирований' : 'экзаменационных тестирований'}.`}
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
                      <FormLabel>Категория</FormLabel>
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
                  <FormField control={form.control} name='public_view' render={({ field }) => (
                    <FormItem className="flex justify-between items-center">
                      <FormLabel>Отображать опубликованные</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name='draft_view' render={({ field }) => (
                    <FormItem className="flex justify-between items-center">
                      <FormLabel>Отображать не опубликованные</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit"  className="mt-2">Применить изменения</Button>
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
        {tests.length !== 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateTestButton variant={false} levels={levels} categories={categories} type_id={type?1:2} />
          {tests.map((test) => <TestCard key={test.id} test={test} />)}
        </div>)}
        {tests.length === 0 && (
          <div className="flex flex-col justify-center items-center flex-grow gap-4 pt-5">
            <h2 className="text-2xl">По вашему запросу не было найдено ни одного тестирования.</h2>
            <CreateTestButton variant={true} levels={levels} categories={categories} type_id={type?1:2} />
          </div>
        )}
      </>)}
    </div>
  );
}


function TestCard({ test }: { test: test & { level: level | undefined, test_public: test_public | null, _count:{ test_questions: number, test_result: number} }}) {
  return (
    <Card className='flex flex-col flex-grow'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{test.name}</span>
          <div className='gap-2 flex'>
            {test.test_public && <Badge>Опубликован</Badge>}
            {!test.test_public && <Badge variant={"destructive"}>Черновик</Badge>}
            {test.level && <Badge variant={'secondary'}>{test.level.name}</Badge>}
          </div>
        </CardTitle>
        <CardDescription className="flex justify-between gap-2 text-muted-foreground text-sm pt-1">
          <span className='flex gap-2'>
            {test.test_public &&
              <span className="flex items-center gap-2">
                <VscPass className="text-muted-foreground" />
                <span>{test._count.test_result ?? 0}</span>
              </span>
            }
          </span>
          <span className='flex gap-2'>
            <span className="flex items-center gap-2">
              <MdOutlineQuestionAnswer className="text-muted-foreground" />
              <span>{test._count.test_questions ?? 0}</span>
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      {(test.test_public && test.description) && <CardContent className="truncate text-sm text-muted-foreground">{test.description}</CardContent>}
      {!test.test_public && <CardContent className="truncate text-sm text-muted-foreground">{test.description || "Нет описания"}</CardContent>}
      <CardFooter className=' mt-auto'>
        {test.test_public &&
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/teacher/tests/${test.id}`}>Просмотреть тест<BiRightArrowAlt /></Link>
          </Button>
        }
        {!test.test_public &&
          <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
            <Link href={`/teacher/builder/tests/${test.id}`}>Изменить тест <FaEdit /></Link>
          </Button>
        }
      </CardFooter>
    </Card>
  );
}
