"use client";

import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { category, level } from "@prisma/client";
import { CreateTest } from "@/actions/tests";

const testSchema = z.object({
  name: z.string({ required_error: 'Обязательное поле' }).min(4, 'Обязательное поле'),
  description: z.string().optional(),
  level_id: z.number({ required_error: 'Обязательное поле' }),
  category_id: z.number({ required_error: 'Обязательное поле' }),
  type_id: z.number({ required_error: 'Обязательное поле' }),
  author_id: z.string().default(''),
});

export type testSchemaType = z.infer<typeof testSchema>;

export default function CreateTestButton({ levels, categories, variant, type_id }: { levels: level[] | undefined, categories: category[] | undefined, variant: boolean, type_id:number }) {
  const router = useRouter();
  const form = useForm<testSchemaType>({
    resolver: zodResolver(testSchema),
  });

  form.setValue('type_id', type_id)

  async function onSubmit(values: testSchemaType) {
    try {
      const testId = (await CreateTest({ values })).id
      toast({
        title: "Успешно",
        description: "Тест создан успешно",
      });
      router.push(`/teacher/builder/tests/${testId}`);
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Что-то пошло не так, пожалуйста попробуйте позже",
        variant: "destructive",
      });
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
          {!variant ? (
            <Button id="new-test-create"
              variant={"outline"}
              className="group border border-primary/20 h-full min-h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4">
              <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
              <p className="font-bold text-xl text-muted-foreground group-hover:text-primary text-wrap">{`Создайте новое ${type_id === 1? 'тестирование': 'экзаменационное тестирование'}`}</p>
            </Button>
          ) :
          (<Button id="new-test-create" className="text-lg" variant={'destructive'} >{`Создать новое ${type_id === 1? 'тестирование': 'экзаменационное тестирование'}`}</Button>)}
      </DialogTrigger>
      <DialogContent className='overflow-y-scroll max-h-screen'>
        <DialogHeader>
          <DialogTitle>{`Создание ${type_id === 1? 'тестирования': 'экзаменационное тестирования'}`}</DialogTitle>
          <DialogDescription>Создайте новый тест для заполнения его вопросами.</DialogDescription>
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
            <FormField control={form.control} name='level_id' render={() => (
              <FormItem>
                <FormLabel>Уровень тестирования</FormLabel>
                <FormControl>
                  <Select defaultValue={`field.value`} onValueChange={(e) => form.setValue('level_id', parseInt(e))}>
                    <SelectTrigger><SelectValue placeholder='Выберите уровень...' /></SelectTrigger>
                    <SelectContent> {levels?.map(i => (
                      <SelectItem value={`${i.id}`}>{i.name}</SelectItem>
                    ))}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='category_id' render={() => (
              <FormItem>
                <FormLabel>Категория тестирования</FormLabel>
                <FormControl>
                  <Select defaultValue={`field.value`} onValueChange={(e) => form.setValue('category_id', parseInt(e))}>
                    <SelectTrigger><SelectValue placeholder='Выберите категорию...' /></SelectTrigger>
                    <SelectContent> {categories?.map(i => (
                      <SelectItem value={`${i.id}`}>{i.name}</SelectItem>
                    ))}</SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
            {!form.formState.isSubmitting && <span>Сохранить</span>}
            {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
