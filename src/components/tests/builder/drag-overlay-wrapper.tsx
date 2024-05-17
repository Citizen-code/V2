'use client'
import { SidebarButtonElementDragOverlay } from "@/components/tests/builder/sidebar-button-element";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { useState } from "react";
import useDesigner from "@/hooks/useDesigner";
import DesignerComponents from "./questions/designer-components";

export default function DragOverlayWrapper() {
  const { elements } = useDesigner()
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)

  useDndMonitor({
    onDragStart: (event) => setDraggedItem(event.active),
    onDragCancel: () => setDraggedItem(null),
    onDragEnd: () => setDraggedItem(null),
  })

  if (!draggedItem) return null
  let node = <div>Элемент не обнаружен</div>
  const isSidebarButtonElement = draggedItem?.data?.current?.isDesignerButtonElement

  if (isSidebarButtonElement) {
    const type = draggedItem?.data?.current?.type as number
    node = <SidebarButtonElementDragOverlay type_id={type} />
  }

  const isDesignerElement = draggedItem?.data?.current?.isDesignerElement
  if (isDesignerElement) {
    const elementId = draggedItem?.data?.current?.elementId
    const element = elements.find((el) => el.id === elementId)
    if (!element) node = <div>Элемент не найден!</div>
    else {
      node = (
        <div className='flex bg-accent border rounded-md w-full py-2 px-4 opacity-80 pointer-events-none'>
          <DesignerComponents question={element} />
        </div>
      )
    }
  }
  return (<DragOverlay>{node}</DragOverlay>)
}