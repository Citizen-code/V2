import SidebarButtonElement from "./sidebar-button-element";
import type { type_test } from "@prisma/client";

export default function TestDesignerSidebar({types}:{types:type_test[]}) {
  return (
    <div>
      <div>Вопросы</div>
      {types.map((el) => 
        <SidebarButtonElement key={el.id} type_id={el.id} />  
      )}
    </div>
  );
}
