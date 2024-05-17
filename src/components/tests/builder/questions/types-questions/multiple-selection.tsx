import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { PiSealCheckDuotone } from "react-icons/pi";
import type { MultipleSelectionType, MultipleSelectionTestType } from "@/types/questions";
import type { test_questions } from "@prisma/client";
import type { UUID } from "crypto";
import useDesigner from "@/hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { v4 } from "uuid";

export function DesignerComponent({ question }: { question: test_questions }) {
  const element = question as MultipleSelectionType;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верные варианты</div>
    <div className='flex items-center p-1'>
      <Image className='cursor-not-allowed block dark:hidden' src={element.question.image ?? '/im-missing-light.svg'} alt='Отсутствует изображение' width={50} height={50} />
      <Image className='cursor-not-allowed hidden dark:block' src={element.question.image ?? '/im-missing-dark.svg'} alt='Отсутствует изображение' width={50} height={50} />
      <div className='ms-2'>{!element.question.text ? '[Введите значение...]' : element.question.text}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <div className={cn('flex flex-col ps-4 pt-2 gap-1', element.answers.length > 4 && 'grid grid-cols-2')}>
      {element.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <Checkbox value={`${answer.id}`} id={`${answer.id}`} />
          <Label className='cursor-not-allowed' htmlFor={`${answer.id}`}>{!answer.text ? '[Введите значение...]' : answer.text}</Label>
        </div>
      )}
    </div>
  </div>
}


const MultipleSelectionPropertiesSchema = z.object({
  question: z.object({
    text: z.string().max(200),
    image: z.string().url().optional(),
  }),
  answers: z.array(z.object({
    id: z.string().uuid(),
    text: z.string(),
    is_true: z.boolean().default(false),
  })).min(2).refine(obj => obj.findIndex(i => i.is_true) !== -1)
})

type MultipleSelectionPropertiesFormSchemaType = z.infer<typeof MultipleSelectionPropertiesSchema>;
export function DesignerProperties({ question }: { question: test_questions }) {
  const element = question as MultipleSelectionTestType;
  const { updateElement } = useDesigner();
  //console.log(SingleSelectionPropertiesSchema.parse(element))
  const form = useForm<MultipleSelectionPropertiesFormSchemaType>({
    resolver: zodResolver(MultipleSelectionPropertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      question: { text: element.question.text, image: element.question.image },
      answers: element.answers,
    }
  })

  useEffect(() => form.reset(element), [element, form])

  function applyChanges(values: MultipleSelectionPropertiesFormSchemaType) {
    updateElement(element.id, { ...element, question: values.question, answers: values.answers })
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
      <FormField control={form.control} name='answers' render={({ field }) => (
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
                    let newOptions = [...field.value];
                    newOptions[index].is_true = !newOptions[index].is_true;
                    field.onChange(newOptions);
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

export function TestComponent({ question, selected, setSelected, result_view }: { question: test_questions, selected: UUID[], setSelected:Dispatch<SetStateAction<any[]>>, result_view:boolean }) {
  const element = question as MultipleSelectionType;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верный вариант</div>
    <div className='flex items-center p-1'>
      {element.question.image && (<Image src={element.question.image} alt='Изображение' width={100} height={100} />)}
      <div className='ms-2'>{element.question.text}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <div className={cn('flex flex-col ps-4 pt-2 gap-1', element.answers.length > 4 && 'grid grid-cols-2')}>
      {element.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <Checkbox className={cn(result_view && (answer.is_true ? 'data-[state=checked]:bg-green-400 border-green-400' : 'data-[state=checked]:bg-red-400 border-red-400'))} disabled={result_view} onClick={() => {
            if(selected.includes(answer.id)) setSelected(selected.filter(i => i !== answer.id))
            else setSelected([...selected, answer.id])
          }} value={`${answer.id}`} id={`${element.id}-${answer.id}`} />
          <Label htmlFor={`${element.id}-${answer.id}`} className={cn(result_view && (answer.is_true ? 'text-green-400' : 'text-red-400'))}>{answer.text}</Label>
        </div>
      )}
    </div>
  </div>
}