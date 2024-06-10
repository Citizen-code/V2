'use client'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function QuestionsTestButton({id}:{id:string}){
  const {push} = useRouter()
  return <Button onClick={() => push(`/teacher/builder/tests/${id}`)}>Просмотреть содержание тестирования</Button>
}