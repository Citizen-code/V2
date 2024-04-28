import type { SingleSelectionType } from "@/types/questions";
import type { test_questions } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { PiSealCheckDuotone } from "react-icons/pi";
import { v4 } from "uuid";
import useDesigner from "@/hooks/useDesigner";


export default function DesignerProperties({question} : {question:test_questions}) {
  switch(question.type_id) {
    case 1: return <SingleSelection question={question}/>
    default: return <div>Элемент не предусмотрен</div>
  }
}

const SingleSelectionPropertiesSchema = z.object({
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

type SingleSelectionPropertiesFormSchemaType = z.infer<typeof SingleSelectionPropertiesSchema>;
function SingleSelection({ question }: { question: test_questions }) {
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
                <PiSealCheckDuotone className='h-8 w-8'
                  onClick={() => {
                    if (!field.value[index].is_true) {
                      field.value.forEach((el, i) => field.value[i].is_true = false)
                      field.value[index].is_true = true;
                      field.onChange(field.value);
                    }
                  }}
                  fill-rule="nonzero"
                  fill={option.is_true ? "green" : "red"}
                />
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
