"use client";

import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { employee, employee_level, employee_position, position, level } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { CreateTest } from "@/actions/tests";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { PlusIcon } from "lucide-react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import { AddUser, EditUser } from "@/actions/user";

const userSchema = z.object({
  surname: z.string({ required_error: 'Обязательное поле' }).min(3, "Поле должно содержать минимум 3 символа"),
  name: z.string({ required_error: 'Обязательное поле' }).min(3, "Поле должно содержать минимум 3 символа"),
  patronymic: z.string({ required_error: 'Обязательное поле' }).min(3, "Поле должно содержать минимум 3 символа"),
  image: z.string().url().nullable().optional(),
  employee_level: z.array(z.object({
    level_id: z.number(),
    date: z.date(),
  })),
  employee_position: z.array(z.object({
    position_id: z.number(),
  })).min(1, "Должна быть минимум одна должность"),
});

export type userSchemaType = z.infer<typeof userSchema>;

export default function UserAdd({ levels, positions, load }: { load:() => void,levels: level[], positions: position[]}) {
  const [levelSelectOpen, setLevelSelectOpen] = useState(false)
  const [positionSelectOpen, setPositionSelectOpen] = useState(false)
  const [open, setOpen] = useState(false);

  const form = useForm<userSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues:{
      surname:"",
      name:"",
      patronymic:"",
      image:null,
      employee_level:[],
      employee_position:[]
    }
  });

  async function onSubmit(values: userSchemaType) {
    try {
      await AddUser(values)
      toast({
        title: "Успешно",
        description: "Сотрудник успешно добавлен",
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

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button>Добавить нового сотрудника</Button>
    </DialogTrigger>
    <DialogContent className='overflow-y-auto max-h-screen'>
      <DialogHeader>
        <DialogTitle>Добавление нового сотрудника</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name='surname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия сотрудника</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя сотрудника</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='patronymic'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Отчество сотрудника</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name='employee_level' render={({ field }) => (
            <FormItem>
              <Collapsible>
                <div className="flex items-center justify-between">
                  <FormLabel>Уровни сотрудника</FormLabel>
                  <CollapsibleTrigger asChild>
                    <Button variant={'ghost'} size={'sm'}>
                      <CaretSortIcon className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <FormControl>
                    <div className="border border-input rounded-md">
                      <ScrollArea>
                        <div className="px-4 p-2">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium leading-none">Текущие уровни</h4>
                            <Popover open={levelSelectOpen} onOpenChange={setLevelSelectOpen}>
                              <PopoverTrigger asChild>
                                <Button variant='ghost' size={'sm'} role="combobox">
                                  <AiOutlinePlus />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Поиск..." className="h-9" />
                                  <CommandEmpty>Ни одного доступного уровня не найдено.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandList>
                                      {levels.filter(i => field.value.findIndex(el => el.level_id === i.id) === -1)?.map((i) => (
                                        <CommandItem value={i.name} key={i.name} onSelect={() => {
                                          form.setValue('employee_level', [...field.value, { level_id: i.id, date: new Date() }])
                                          setLevelSelectOpen(false);
                                        }}>
                                          {i.name}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          {field.value.map(i => <>
                            <div className="flex items-center justify-between">
                              <div className='text-sm'>{`${levels.find(level => level.id === i.level_id)?.name} - ${i.date.toLocaleDateString()}`}</div>
                              <Button variant={'ghost'} size={'sm'} onClick={() => {
                                form.setValue('employee_level', [...field.value.filter(el => i.level_id !== el.level_id)])
                              }}><AiOutlineClose /></Button>
                            </div>
                            <Separator className="my-2" />
                          </>)}
                        </div>
                      </ScrollArea>
                    </div>
                  </FormControl>
                </CollapsibleContent>
              </Collapsible>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name='employee_position' render={({ field }) => (
            <FormItem>
              <Collapsible>
                <div className="flex items-center justify-between">
                  <FormLabel>Должности сотрудника</FormLabel>
                  <CollapsibleTrigger asChild>
                    <Button variant={'ghost'} size={'sm'}>
                      <CaretSortIcon className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <FormControl>
                    <div className="border border-input rounded-md">
                      <ScrollArea>
                        <div className="px-4 p-2">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium leading-none">Текущие должности</h4>
                            <Popover open={positionSelectOpen} onOpenChange={setPositionSelectOpen}>
                              <PopoverTrigger asChild>
                                <Button variant='ghost' size={'sm'} role="combobox">
                                  <AiOutlinePlus />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Поиск..." className="h-9" />
                                  <CommandEmpty>Ни одной должности не найдено.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandList>
                                      {positions.filter(i => field.value.findIndex(el => el.position_id === i.id) === -1)?.map((i) => (
                                        <CommandItem value={i.name} key={i.name} onSelect={() => {
                                          form.setValue('employee_position', [...field.value, { position_id: i.id }])
                                          setPositionSelectOpen(false);
                                        }}>
                                          {i.name}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          {field.value.map(i => <>
                            <div className="flex items-center justify-between">
                              <div className='text-sm'>{`${positions.find(position => position.id === i.position_id)?.name}`}</div>
                              <Button variant={'ghost'} size={'sm'} onClick={() => {
                                form.setValue('employee_position', [...field.value.filter(el => i.position_id !== el.position_id)])
                              }}><AiOutlineClose /></Button>
                            </div>
                            <Separator className="my-2" />
                          </>)}
                        </div>
                      </ScrollArea>
                    </div>
                  </FormControl>
                </CollapsibleContent>
              </Collapsible>
              <FormMessage />
            </FormItem>
          )} />
        </form>
      </Form>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
          {!form.formState.isSubmitting && <span>Добавить сотрудника</span>}
          {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}
