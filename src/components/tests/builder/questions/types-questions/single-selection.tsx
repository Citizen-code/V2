import type { SingleSelectionTestType, SingleSelectionType } from "@/types/questions";
import { test_questions } from "@prisma/client";
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { PiSealCheckDuotone } from "react-icons/pi";
import { v4 } from "uuid";
import useDesigner from "@/hooks/useDesigner";
import { Toggle } from "@/components/ui/toggle";
import { UUID } from "crypto";

export function DesignerComponent({ question }: { question: test_questions }) {
  const element = question as SingleSelectionType;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верный вариант</div>
    <div className='flex items-center p-1'>
      <Image className='cursor-not-allowed block dark:hidden' src={element.question.image ?? '/im-missing-light.svg' } alt='Отсутствует изображение' width={50} height={50} />
      <Image className='cursor-not-allowed hidden dark:block' src={element.question.image ?? '/im-missing-dark.svg' } alt='Отсутствует изображение' width={50} height={50} />
      <div className='ms-2'>{!element.question.text ? '[Введите значение...]' : element.question.text}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <RadioGroup disabled className={cn('ps-4 pt-2', element.answers.length > 4 && 'grid grid-cols-2')}>
      {element.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <RadioGroupItem value={`${answer.id}`} id={`${answer.id}`} />
          <Label className='cursor-not-allowed' htmlFor={`${answer.id}`}>{!answer.text ? '[Введите значение...]' : answer.text}</Label>
        </div>
      )}
    </RadioGroup>
  </div>
}


const SingleSelectionPropertiesSchema = z.object({
  question: z.object({
    text: z.string().max(200, "Текст вопроса не должен превышать 200 символов.").default(''),
    image: z.string().url().optional(),
  }),
  answers: z.array(z.object({
    id: z.string().uuid(),
    text: z.string().max(50, "Текст ответа не должен превышать 50 символов.").default(''),
    is_true: z.boolean().default(false),
  })).min(2, "Должно быть минимум 2 ответа на вопрос.").refine(obj => obj.findIndex(i => i.is_true) !== -1, "Вопрос должен иметь правильный ответ")
})

type SingleSelectionPropertiesFormSchemaType = z.infer<typeof SingleSelectionPropertiesSchema>;
export function DesignerProperties({ question }: { question: test_questions }) {
  const element = question as SingleSelectionType;
  const { updateElement } = useDesigner();
  //console.log(SingleSelectionPropertiesSchema.parse(element))
  const form = useForm<SingleSelectionPropertiesFormSchemaType>({
    resolver: zodResolver(SingleSelectionPropertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      question: { text: element.question.text, image: element.question.image },
      answers: element.answers,
    }
  })
  
  useEffect(() => form.reset(element), [element, form])

  function applyChanges(values: SingleSelectionPropertiesFormSchemaType) {
    updateElement(element.id, { ...element, question:values.question, answers:values.answers })
  }

  return <Form {...form}>
    <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => e.preventDefault()} className='space-y-3'>
      <FormField control={form.control} name='question.text' render={({ field }) => (
        <FormItem>
          <FormLabel>Текст вопроса</FormLabel>
          <FormControl>
            <Input {...field} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
          </FormControl>
          <FormDescription>
            Введите текст вопроса.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name='question.image' render={({ field }) => (
        <FormItem>
          <FormLabel>Изображение</FormLabel>
          <FormControl>
            <div className='flex justify-between items-center'>
              <Input id='image-input' {...field} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
              <Button variant={"ghost"} size={"icon"}
                onClick={(e) => { 
                  e.preventDefault(); 
                  field.onChange(undefined); 
                  e.currentTarget.blur();
                }}>
                <AiOutlineClose />
              </Button>
            </div>
          </FormControl>
          <FormDescription>Введите url изображения.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <FormField  control={form.control} name='answers' render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Ответы</FormLabel>
            <Button
              variant={"outline"}
              className={cn("gap-2", form.getValues().answers.length >= 8 && 'hidden')}
              onClick={(e) => {
                e.preventDefault();
                form.setValue('answers', [...field.value, { id: v4(), text: '', is_true: false }]);
              }}
            >
              <AiOutlinePlus />
              Добавить
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {form.watch('answers').map((option, index) => (
              <div key={index} className="flex items-center justify-between gap-1">
                <Input
                  placeholder=""
                  value={option.text}
                  onChange={(e) => {
                    field.value[index].text = e.target.value;
                    field.onChange(field.value);
                  }}
                />
                <Toggle
                  onClick={(e) => {
                    e.preventDefault();
                    if (!field.value[index].is_true) {
                      field.value.forEach((el, i) => field.value[i].is_true = false)
                      field.value[index].is_true = true;
                      field.onChange(field.value);
                    }
                    field.onChange(field.value);
                    e.currentTarget.blur();
                  }}>
                  <PiSealCheckDuotone className='h-8 w-8'
                    fill-rule="nonzero"
                    fill={option.is_true ? "green" : "red"}
                  />
                </Toggle>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => {
                    e.preventDefault();
                    const newOptions = [...field.value];
                    newOptions.splice(index, 1);
                    field.onChange(newOptions);
                    e.currentTarget.blur();
                  }}
                >
                  <AiOutlineClose />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )} />
    </form>
  </Form>
}

export function TestComponent({ question, selected, setSelected, result_view }: { question: test_questions, selected: UUID[], setSelected:Dispatch<SetStateAction<any[]>>, result_view: boolean }) {
  const element = question as SingleSelectionType;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верный вариант</div>
    <div className='flex items-center p-1'>
      {element.question.image && (<Image src={element.question.image} alt='Изображение' width={100} height={100} />)}
      <div className='ms-2'>{element.question.text}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <RadioGroup disabled={result_view} className={cn('ps-4 pt-2', element.answers.length > 4 && 'grid grid-cols-2')}>
      {element.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <RadioGroupItem disabled={result_view} className={cn(result_view && (answer.is_true ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'))} onClick={() => setSelected([answer.id])} value={`${answer.id}`} id={`${element.id}-${answer.id}`} />
          <Label className={cn(result_view && (answer.is_true ? 'cursor-not-allowed text-green-400' : 'cursor-not-allowed text-red-400'))} htmlFor={`${element.id}-${answer.id}`}>{answer.text}</Label>
        </div>
      )}
    </RadioGroup>
  </div>
}