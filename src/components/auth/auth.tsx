'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const credentialSchema = z.object({
  login: z.string({ required_error: 'Обязательное поле' }).min(3, "Поле должно содержать минимум 3 символа"),
  password: z.string({ required_error: 'Обязательное поле' }).min(3, "Поле должно содержать минимум 3 символа"),
});

export type credentialSchemaType = z.infer<typeof credentialSchema>;

export default function Auth() {
  const { push } = useRouter()


  async function onSubmit(values: credentialSchemaType) {
    const result = await signIn('credentials', { login: values.login, password: values.password, redirect: false })
    if (result?.ok) {
      toast({
        title: "Успешно",
        description: "Авторизация успешно выполнена",
      });
      push('/')
    } else if (result?.error) {
      toast({
        title: "Ошибка",
        description: "Что-то пошло не так, пожалуйста проверьте данные",
        variant: "destructive",
      });
    }
  }

  const form = useForm<credentialSchemaType>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      login: '',
      password: '',
    }
  });
  return (
    <div className="flex min-h-screen justify-center items-center flex-grow">
      <Card>
        <CardHeader>
          <CardTitle>Авторизация</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CardContent>
              <FormField
                control={form.control}
                name='login'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='justify-center'>
              <Button size={'lg'} type='submit'>Войти в приложение</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}