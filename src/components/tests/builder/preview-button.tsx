'use client'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { MdPreview } from 'react-icons/md'
import useDesigner from "@/hooks/useDesigner";
import { useState } from "react";
import Confetti from "react-confetti";
import { BsArrowLeft } from "react-icons/bs";
import TestComponents from "./questions/test-components";
import { MultipleSelectionType, SingleSelectionTestType, SingleSelectionType } from "@/types/questions";

export default function PreviewDialogButton() {
  const { elements } = useDesigner();
  if (elements.length === 0) return null;
  const [selected, setSelected] = useState<any[]>([])
  const [index, setIndex] = useState<number>(0)
  const [isResult, setIsResult] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [isFinally, setIsFinally] = useState<boolean>(false)
  const [answers, setAnswers] = useState<any[]>([])

  const GetCurrentQuestion = () => {
    const element = elements[index]
    return <TestComponents key={element.id} question={element} selected={selected} setSelected={setSelected} result_view={isResult} />
  }

  const CheckAnswer = () => {
    let is_correct = false;
    const element = elements[index];
    switch (element.type_id) {
      case 1: {
        if(selected.length === 0) break;
        const answer_id = selected.pop();
        const question = element as SingleSelectionType
        for (let index = 0; index < question.answers.length; index++) {
          const answer = question.answers[index];
          if (answer.id === answer_id) is_correct = answer.is_true ? true : false
        }
      } break;
      case 2: {
        if(selected.length === 0) break;
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
    setAnswers([...answers, { question_id: element.id, question_type: element.type_id, is_correct, answer: [...selected] }]);
    setSelected([])
    setIsResult(true);
    setIsCorrect(is_correct);
  }

  const NextQuestion = () => {
    setIsResult(false)
    const nextIndex = index + 1
    if (nextIndex < elements.length) setIndex(nextIndex)
    else {
      setIsFinally(true)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {
          setAnswers([]);
          setIsResult(false);
          setIsCorrect(false);
          setIsFinally(false);
          setIndex(0);
        }} variant={"outline"} className="gap-2">
          <MdPreview className="h-6 w-6" />
          Просмотр
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">Предпросмотр тестирования</p>
          <p className="text-sm text-muted-foreground">Это то как будет выглядеть ваше тестирование.</p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/builder-bg-light.svg)] dark:bg-[url(/builder-bg-dark.svg)]">
          <div className="flex flex-col bg-background rounded-2xl p-8">
            {!isFinally ? <>{GetCurrentQuestion()}
              {!isResult && (
                <div className='flex justify-between p-4 items-center'>
                  <Button onClick={() => { NextQuestion() }}>Пропустить</Button>
                  <Button onClick={() => {
                    if (!isResult) CheckAnswer();
                    else NextQuestion();
                  }}>Проверить</Button>
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
                <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} />
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="max-w-md">
                    <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-5">
                      Тест успешно пройден
                    </h1>
                    <div>{`Вы успешно ответили на ${answers.filter(i => i.is_correct).length} из ${elements.length} вопросов.`}</div>
                    <div className="flex justify-between mt-3">
                      <DialogClose asChild>
                        <Button variant={"link"} className="gap-2">
                          <BsArrowLeft />
                          На главный экран
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
