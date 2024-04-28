import { Button } from "../../ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import DesignerButtons from "../questions/designer-buttons";

export default function SidebarButtonElement({type_id}:{type_id:number}) {
  const { label, icon:Icon } = DesignerButtons(type_id)
  const draggable = useDraggable({ id:`designer-button-${type_id}`, data:{ type: type_id, isDesignerButtonElement:true }})
  return (
    <Button ref={draggable.setNodeRef} variant={'outline'} className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab", draggable.isDragging && "ring-2 ring-primary")} {...draggable.listeners} {...draggable.attributes}>
      <Icon className='h-8 w-8 text-primary cursor-grab'/>
      <p className='text-xs'>{label}</p>
    </Button>
  );
}

export function SidebarButtonElementDragOverlay({type_id}:{type_id:number}) {
    const { label, icon:Icon } = DesignerButtons(type_id)
    return (
      <Button variant={'outline'} className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab">
        <Icon className='h-8 w-8 text-primary cursor-grab'/>
        <p className='text-xs'>{label}</p>
      </Button>
    );
}
