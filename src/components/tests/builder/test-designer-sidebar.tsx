import { Separator } from "@/components/ui/separator";
import SidebarButtonElement from "./sidebar-button-element";
import type { type_question } from "@prisma/client";

export default function TestDesignerSidebar({types}:{types:type_question[]}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg">Вопросы</div>
      <Separator/>
      <div>Выбор верного ответа</div>
      <div className="flex gap-3 flex-wrap justify-center">
        {types.map((el) => 
          <SidebarButtonElement key={el.id} type_id={el.id} />  
        )}
      </div>
    </div>
  );
}
