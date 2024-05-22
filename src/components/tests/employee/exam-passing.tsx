'use client'
import { Button } from "../../ui/button";
import { useState, useTransition } from "react";
import Confetti from "react-confetti";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import TestComponents from "../builder/questions/test-components";
import type { MultipleSelectionType, SingleSelectionType } from "@/types/questions";
import type { employee_level, result_questions, test_questions, level } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { FaSpinner } from "react-icons/fa";
import { IsNewLevel, PassingQuestion } from "@/actions/tests";

export default function ExamPassing({ test_questions, results, result_id, level_id }: { test_questions: test_questions[], results: result_questions[], result_id: string, level_id:number }) {
  const array = test_questions.filter(i => results.findIndex(r => r.question_id === i.id) === -1);
  const [questions, setQuestions] = useState<test_questions[]>(array)
  const { back } = useRouter()
  const [isFinally, setIsFinally] = useState<boolean>(questions.length === 0)
  const [selected, setSelected] = useState<any[]>([])
  const [loading, startTransition] = useTransition();
  const [index, setIndex] = useState<number>(0)
  const [progress, setProgress] = useState<number>(questions.length === 0 ? 100 : 0)
  //const [answers, setAnswers] = useState<result_questions[]>(results)
  let answers:result_questions[] = results;
  const [newLevel, setNewLevel] = useState<employee_level & {level:level} | undefined>(undefined)

  const GetCurrentQuestion = () => {
    const element = questions[index]
    return <TestComponents key={element.id} question={element} selected={selected} setSelected={setSelected} result_view={false} />
  }
  const CheckAnswer = async () => {
    let is_correct = false;
    const element = questions[index];
    switch (element.type_id) {
      case 1: {
        if (selected.length === 0) break;
        const answer_id = selected[0];
        const question = element as SingleSelectionType
        for (let index = 0; index < question.answers.length; index++) {
          const answer = question.answers[index];
          if (answer.id === answer_id) is_correct = answer.is_true ? true : false
        }
      } break;
      case 2: {
        if (selected.length === 0) break;
        const question = element as MultipleSelectionType
        for (let index = 0; index < question.answers.length; index++) {
          const element = question.answers[index];
          if (element.is_true) {
            if (selected.includes(element.id)) is_correct = true;
            else { is_correct = false; break }
          } else {
            if (selected.includes(element.id)) { is_correct = false; break }
            else is_correct = true;
          }
        }
      } break;
    }
    const result: result_questions = { result_id, question_id: element.id, is_correct, answer: [...selected] };
    console.log('Ответ')
    console.log(result)
    await PassingQuestion(result);
    answers.push(result);
    console.log('Ответы')
    console.log(answers)
    setSelected([])
    await NextQuestion();
  }
  const NextQuestion = async () => {
    const nextIndex = index + 1
    if (nextIndex < questions.length) setIndex(nextIndex)
    else {
      console.log('Ответы')
      console.log(answers)
      const temp = questions.filter(i => answers.findIndex(a => a.question_id === i.id) === -1);
      if (temp.length === 0) {
        setNewLevel(await IsNewLevel(level_id))
        setIsFinally(true)
      }
      else {
        setQuestions(temp)
        setIndex(0)
      }
    }
    setProgress((nextIndex / questions.length) * 100)
  }

  return (
    <div className="flex flex-col flex-grow px-2 py-4">
      <Progress value={progress} />
      <div className="flex flex-grow justify-center items-center">
        <div className="flex flex-col">
          {!isFinally ? <>{GetCurrentQuestion()}
              <div className='flex justify-between p-4 items-center'>
                <Button disabled={loading} onClick={() => { startTransition(NextQuestion) }}>Пропустить</Button>
                <Button disabled={loading} onClick={() => {
                  startTransition(CheckAnswer)
                }}>Проверить {loading && <FaSpinner className="animate-spin px-1" />}</Button>
              </div>
            </> :
            <div>
              {typeof window !== 'undefined' && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />}
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className='max-w-lg'>
                  <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-5">
                    {answers.filter(i => i.is_correct).length/ answers.length * 100 >= 90 ? 'Экзаменационное тестирование пройдено' : 'Экзаменационное тестирование не пройдено'}
                  </h1>
                  <div className='text-center'>{`Вы ответили правильно на ${answers.filter(i => i.is_correct).length / answers.length * 100}% всех вопросов.`}</div>
                  {newLevel && <div className='rounded-md border p-4 m-4'> 
                    <h3 className="font-bold">Вам был присвоен уровень {newLevel.level.name}</h3>
                    <div className='text-sm text-muted-foreground'>Входе успешного прохождения всех доступных экзаменационных тестирований вам был присвоен уровень {newLevel.level.name}</div>
                  </div>}
                  <div className="flex justify-between mt-3">
                    <Button onClick={() => back()} variant={"link"} className="gap-2">
                      <BsArrowLeft />
                      Вернуться назад
                    </Button>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>
  )
}