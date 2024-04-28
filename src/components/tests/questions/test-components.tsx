import type { SingleSelectionTestType, SingleSelectionType } from "@/types/questions";
import type { test_questions } from "@prisma/client";
import Image from 'next/image'
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function TestComponents({question} : {question:test_questions}) {
  switch(question.type_id) {
    case 1: return <TestComponent question={question}/>
    default: return <div>Элемент не предусмотрен</div>
  }
}

function TestComponent({ question }: { question: test_questions }) {
  const element = question as SingleSelectionTestType;
  return <div className='p-2 pb-4'>
    <div className='text-2xl italic'>Выберите верный вариант</div>
    <div className='flex items-center p-1'>
      {element.question.image && (<Image src={element.question.image} alt='Изображение' width={100} height={100} />)}
      <div className='ms-2'>{element.question.text}</div>
    </div>
    <Separator className='mt-2 mb-2' />
    <RadioGroup className={cn('ps-4 pt-2', element.answers.length > 4 && 'grid grid-cols-2')}>
      {element.answers.map(answer =>
        <div key={`${element.id}-${answer.id}`} className='flex items-center space-x-2'>
          <RadioGroupItem onClick={() => element.selected = answer.id} value={`${answer.id}`} id={`${element.id}-${answer.id}`} />
          <Label htmlFor={`${element.id}-${answer.id}`}>{answer.text}</Label>
        </div>
      )}
    </RadioGroup>
  </div>
}