import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";
import { MdOutlinePublish } from 'react-icons/md'
import { FaSpinner } from "react-icons/fa";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import useDesigner from "@/hooks/useDesigner";
import { PublishTest, UpdateTest } from "@/actions/tests";
import { MultipleSelectionType, SingleSelectionType } from "@/types/questions";

export default function PublishTestButton({ id }: { id: string }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { elements } = useDesigner()
  if (elements.length === 0) return null;
  if (elements.findIndex(i => {
    switch (i.type_id) {
      case 1: {
        const question = i as SingleSelectionType
        return question.question.text === '' || question.answers.findIndex((y:any) =>  y.text === '') !== -1
      }
      case 2: {
        const question = i as MultipleSelectionType
        return question.question.text === '' || question.answers.findIndex((y:any) => y.text === '') !== -1
      }
      default:
        return true
    }
  }) !== -1) return null;

  async function publishForm() {
    try {
      await UpdateTest({ id, elements })
      await PublishTest({ id });
      toast({ title: "Успешно", description: "Ваш тест успешно опубликован" });
      router.refresh();
    } catch (error) {
      toast({ title: "Ошибка", description: "Что-то пошло не так" });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          Публикация
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы действительно уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие не может быть отменено. После публикации вы не сможете его изменить. <br />
            <br />
            <span className="font-medium">
              Публикация теста сделает его общедоступным и позволит собирать статистику.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={(e) => { e.preventDefault(); startTransition(publishForm); }}>
            Продолжить {loading && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
