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
import { employee, employee_level, employee_position, position, level, test, test_public, type_test, category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { CreateTest, EditTest } from "@/actions/tests";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { EditUser } from "@/actions/user";

const testSchema = z.object({
  name: z.string({ required_error: 'Обязательное поле' }).min(4, 'Обязательное поле'),
  description: z.string().optional(),
  level_id: z.number({ required_error: 'Обязательное поле' }),
  category_id: z.number({ required_error: 'Обязательное поле' }),
  type_id: z.number({ required_error: 'Обязательное поле' }),
  author_id: z.string({ required_error: 'Обязательное поле' }),
});

export type testSchemaType = z.infer<typeof testSchema>;

export default function TestEdit({ levels, open, setOpen, selectedTest, load }: { load: () => void, levels: level[], open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, selectedTest: (test & {level:level, category:category, type_test:type_test, test_public:test_public | null, employee:employee, _count:{test_questions:number,test_result:number}}) | undefined }) {
  if (selectedTest === undefined) return null;
  const session = useSession().data;
  if (!session) return null;
  if (session.user?.id === undefined) return null;
  const [levelOpen, setLevelOpen] = useState(false)

  const form = useForm<testSchemaType>({
    resolver: zodResolver(testSchema),
    values: {
      name: selectedTest.name,
      level_id: selectedTest.level_id,
      category_id: selectedTest.category_id,
      author_id: selectedTest.author_id,
      type_id: selectedTest.type_id,
      description: (selectedTest.description === null ? undefined : selectedTest.description),
    }
  });

  async function onSubmit(values: testSchemaType) {
    try {
      await EditTest(values, selectedTest!.id)
      toast({
        title: "Успешно",
        description: "Данные успешно изменены",
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
    <DialogContent className='overflow-y-auto max-h-screen'>
      <DialogHeader>
        <DialogTitle>Изменений данных сотрудника</DialogTitle>
        <DialogDescription>Для сохранения необходимо подтвердить изменение данных.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Наименование тестирования</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание тестирования</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name='level_id' render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Уровень тестирования</FormLabel>
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
        </form>
      </Form>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
          {!form.formState.isSubmitting && <span>Сохранить изменения</span>}
          {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}
