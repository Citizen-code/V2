import type { SingleSelectionType } from "@/types/questions";
import type { test_questions } from "@prisma/client";
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from 'next/image'

export default function DesignerComponents({question} : {question:test_questions}) {
  switch(question.type_id) {
    case 1: return <SingleSelection question={question}/>
    default: return <div>Элемент не предусмотрен</div>
  }
}

function SingleSelection({ question }: { question: test_questions }) {
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
