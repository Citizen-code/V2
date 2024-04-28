'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { category, level, test, test_public, test_visited } from '@prisma/client';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { GetEmployeeTests } from '@/actions/tests';
import { Badge } from '@/components/ui/badge';
import { FaRegEye } from 'react-icons/fa';
import Link from "next/link";


export type SearchSchemaType = z.infer<typeof SearchSchema>;
const SearchSchema = z.object({
  text: z.string().max(200),
  category_id: z.number().optional(),
})

export default function TestSearch({ categories }: { categories: category[] }) {
  const [tests_public, setTestsPublic] = useState<(test_public & { test: test & { category: category | undefined, level: level | undefined, test_visited: test_visited[] } })[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const data = { text: '', category_id: undefined }
  const form = useForm<SearchSchemaType>({
    resolver: zodResolver(SearchSchema),
    mode: 'onBlur',
    defaultValues: {
      text: '',
      category_id: undefined
    }
  })
  useEffect(() => { const start = async () => setTestsPublic(await GetEmployeeTests(data)); start() }, [])
  useEffect(() => form.reset(data), [form])
  async function applyChanges(values: SearchSchemaType) {
    setTestsPublic(await GetEmployeeTests(values))
  }
  return <div className='flex gap-6'>
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>{`Количество совпадений: ${tests_public.length}`}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <FormField control={form.control} name='text' render={({ field }) => (
              <FormItem>
                <FormLabel>Поиск</FormLabel>
                <FormControl>
                  <Input {...field} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
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
                      <Button variant="outline" role="combobox" className={cn("justify-between", !field.value && "text-muted-foreground")}>
                        {field.value ? categories.find((category) => category.id === field.value)?.name : "Выберите категорию"}
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
                              if (field.value === category.id) form.setValue('category_id', undefined);
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
          </CardContent>
          <CardFooter>
            <Button onClick={(e) => { form.reset({ text: '', category_id: undefined }); e.currentTarget.blur(); }}>Сбросить фильтры</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests_public.map((el) => {
        const test = el.test;
        return (<Card className='flex flex-col flex-grow'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <span className="truncate font-bold">{test.name}</span>
              <div className='gap-2 flex'>
                {test.level && <Badge variant={'secondary'}>{test.level.name}</Badge>}
              </div>
            </CardTitle>
            <CardDescription className="flex justify-between gap-2 text-muted-foreground text-sm pt-1">
              <span className='flex gap-2'>
                <span className="flex items-center gap-2">
                  <FaRegEye className="text-muted-foreground" />
                  <span>{test.test_visited?.length ?? 0}</span>
                </span>
              </span>
            </CardDescription>
          </CardHeader>
          {test.description && <CardContent className="truncate text-sm text-muted-foreground">{test.description}</CardContent>}
          <CardFooter className='mt-auto'>
            <Button asChild className="w-full mt-2 text-md gap-4">
              <Link href={`/tests/${test.id}`}>Пройти тестирование</Link>
            </Button>
          </CardFooter>
        </Card>
        )
      })}
    </div>
  </div>
}
