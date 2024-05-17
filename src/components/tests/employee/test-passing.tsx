'use client'
import { Button } from "../../ui/button";
import { useState, useTransition } from "react";
import Confetti from "react-confetti";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import TestComponents from "../builder/questions/test-components";
import type { MultipleSelectionType, SingleSelectionType } from "@/types/questions";
import type { result_questions, test_questions } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { FaSpinner } from "react-icons/fa";
import { CreateNewPassing, PassingQuestion } from "@/actions/tests";

export default function TestPassing({ test_questions, results, result_id, test_id }: { test_questions: test_questions[], results: result_questions[], result_id: string, test_id: string }) {
  const array = test_questions.filter(i => results.findIndex(r => r.question_id === i.id) === -1);
  const [questions, setQuestions] = useState<test_questions[]>(array)
  const { back, push } = useRouter()
  const [isFinally, setIsFinally] = useState<boolean>(questions.length === 0)
  const [selected, setSelected] = useState<any[]>([])
  const [loading, startTransition] = useTransition();
  const [index, setIndex] = useState<number>(0)
  const [progress, setProgress] = useState<number>(questions.length === 0 ? 100 : 0)
  const [isResult, setIsResult] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [answers, setAnswers] = useState<result_questions[]>(results)
  const GetCurrentQuestion = () => {
    const element = questions[index]
    return <TestComponents key={element.id} question={element} selected={selected} setSelected={setSelected} result_view={isResult} />
  }
  const CheckAnswer = async () => {
    let is_correct = false;
    const element = questions[index];
    switch (element.type_id) {
      case 1: {
        if (selected.length === 0) break;
        const answer_id = selected.pop();
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
    await PassingQuestion(result);
    setAnswers([...answers, result]);
    setSelected([])
    setIsResult(true);
    setIsCorrect(is_correct);
  }
  const NextQuestion = () => {
    setIsResult(false)
    const nextIndex = index + 1
    if (nextIndex < questions.length) setIndex(nextIndex)
    else {
      const temp = questions.filter(i => answers.findIndex(a => a.question_id === i.id) === -1);
      if (temp.length === 0) setIsFinally(true)
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
            {!isResult && (
              <div className='flex justify-between p-4 items-center'>
                <Button onClick={() => { NextQuestion() }}>Пропустить</Button>
                <Button disabled={loading} onClick={() => {
                  if (!isResult) startTransition(CheckAnswer)
                  else NextQuestion();
                }}>Проверить {loading && <FaSpinner className="animate-spin px-1" />}</Button>
              </div>
            )}
            {isResult && (
              <div className='flex justify-between p-4 items-center'>
                {isCorrect ? <h2 className='font-bold text-2xl text-green-500'>Отлично</h2> :
                  <h2 className='font-bold text-2xl text-red-500'>Неверно</h2>}
                <Button onClick={() => {
                  if (!isResult) CheckAnswer();
                  else NextQuestion();
                }}>Далее</Button>
              </div>
            )}</> :
            <div>
              {typeof window !== 'undefined' && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />}
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="max-w-md">
                  <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-5">
                    Тестирование пройдено
                  </h1>
                  <div>{`Вы правильно ответили на ${answers.filter(i => i.is_correct).length} из ${answers.length} вопросов.`}</div>
                  <div className="flex justify-between mt-3">
                    <Button onClick={() => back()} variant={"link"} className="gap-2">
                      <BsArrowLeft />
                      Вернуться назад
                    </Button>
                    <Button onClick={() => startTransition(async () => { redirect(`/employee/tests/${await CreateNewPassing(test_id)}`) })} variant={"link"} className="gap-2">
                      Пройти заново
                      <BsArrowRight />
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