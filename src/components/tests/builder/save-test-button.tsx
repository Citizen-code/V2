import useDesigner from "@/hooks/useDesigner";
import { Button } from "../../ui/button";
import { HiSaveAs } from 'react-icons/hi'
import { FaSpinner } from "react-icons/fa";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast";
import { UpdateTest } from "@/actions/tests";

export default function SaveTestButton({ id }: { id: string }) {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition();

  const updateTestContext = async () => {
    try {
      await UpdateTest({ id, elements })
      toast({ title: "Успешно",  description: "Ваш тест был сохранен" });
    } catch (error) {
      toast({ title: "Ошибка", description: "Что то пошло не так", variant: "destructive" });
    }
  }

  return (
    <Button variant={"outline"} className="gap-2" disabled={loading} onClick={() => startTransition(updateTestContext)}>
      <HiSaveAs className="h-4 w-4" />
      Сохранение
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}
