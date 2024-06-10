'use client'
import { cn } from "@/lib/utils";
import TestDesignerSidebar from "@/components/tests/builder/test-designer-sidebar";
import PropertiesTestSidebar from "@/components/tests/builder/properties-test-sidebar";
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import useDesigner from "@/hooks/useDesigner";
import { BiSolidTrash } from 'react-icons/bi'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { test_questions, type_question } from "@prisma/client";
import DesignerComponents from "./questions/designer-components";
import Constructor from "./questions/constructor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function Designer({ types, readonly }: { types: type_question[], readonly: boolean }) {
  const { elements, addElement, removeElement, selectedElement, setSelectedElement } = useDesigner();
  const droppable = useDroppable({ id: 'designer-drop-area', data: { isDesignerDropArea: true } })

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event
      if (!active || !over) return;

      const isDesignerBtnElement = active.data.current?.isDesignerButtonElement;
      const isDroppingOverDesignerDropArea = over.data.current?.isDesignerDropArea;
      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data.current?.type as number;
        const newElement = Constructor(type)
        addElement(elements.length, newElement)
        return;
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data.current?.type as number;
        const newElement = Constructor(type)
        const overId = over.data?.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) throw new Error("Элемент не найден");
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) indexForNewElement = overElementIndex + 1;
        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) throw new Error("Элемент не найден");
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = (activeElementIndex < overElementIndex ? overElementIndex - 1 : overElementIndex);
        if (isDroppingOverDesignerElementBottomHalf) indexForNewElement = indexForNewElement + 1;
        addElement(indexForNewElement, activeElement);
      }
    }
  })

  return (
    <ResizablePanelGroup direction='horizontal' className="w-full h-full min-h-full">
      <ResizablePanel minSize={50} className={cn('p-4 w-full overflow-y-auto')} onClick={() => { if (selectedElement) setSelectedElement(null) }}>
        <div ref={droppable.setNodeRef}
          className={cn('bg-background h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto', droppable.isOver && 'ring-2 ring-primary/20')}>
          {!droppable.isOver && elements.length === 0 && (<p className='text-3xl text-muted-foreground flex flex-grow items-center font-bold'>Разместите здесь</p>)}
          {droppable.isOver && elements.length === 0 && (<div className="p-4 w-full"><div className='h-[120px] rounded-sm bg-primary/20' /></div>)}
          {elements.length > 0 && (<div className="flex flex-col w-full gap-2 p-4">
            {elements.map(element => <DesignerElementWrapper key={element.id} element={element} readonly={readonly} />)}
          </div>)}
        </div>
      </ResizablePanel>
      {!readonly && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={20} minSize={10}>
            <aside className='flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'>
              {!selectedElement && <TestDesignerSidebar types={types} />}
              {selectedElement && <PropertiesTestSidebar />}
            </aside>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>

  );
}

function DesignerElementWrapper({ element, readonly }: { element: test_questions, readonly: boolean }) {
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
  const { removeElement, setSelectedElement } = useDesigner()

  const topHalf = useDroppable({ id: element.id + "-top", data: { type: element.type_id, elementId: element.id, isTopHalfDesignerElement: true } })
  const bottomHalf = useDroppable({ id: element.id + "-bottom", data: { type: element.type_id, elementId: element.id, isBottomHalfDesignerElement: true } })
  const draggable = useDraggable({ id: element.id + "-drag-handler", data: { type: element.type_id, elementId: element.id, isDesignerElement: true } })
  if (draggable.isDragging) return null;

  return readonly ?
    <div className='relative flex flex-col text-foreground rounded-md ring-1 ring-accent ring-inset'>
      <div className={cn('items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none', mouseIsOver && 'opacity-30', topHalf.isOver && 'border-t-4 border-t-foreground', bottomHalf.isOver && 'border-b-4 border-b-foreground')}>
        <DesignerComponents question={element} />
      </div>
    </div>
    : <div ref={draggable.setNodeRef} {...draggable.listeners} {...draggable.attributes} className='relative flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
      onMouseEnter={() => { setMouseIsOver(true) }} onMouseLeave={() => { setMouseIsOver(false) }} onClick={(e) => { e.stopPropagation(); setSelectedElement(element) }}>
      <div ref={topHalf.setNodeRef} className='absolute w-full h-1/2 rounded-t-md' />
      <div ref={bottomHalf.setNodeRef} className='absolute w-full bottom-0 h-1/2 rounded-b-md' />
      {mouseIsOver && (<>
        <div className="absolute right-0 h-full">
          <Button onClick={(e) => { e.stopPropagation(); setSelectedElement(null); removeElement(element.id); }} variant={'outline'} className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500">
            <BiSolidTrash className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <p className='text-muted-foreground text-sm'>Нажмите для открытия параметров или удерживайте для перемещения</p>
        </div>
      </>)}
      <div className={cn('items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none', mouseIsOver && 'opacity-30', topHalf.isOver && 'border-t-4 border-t-foreground', bottomHalf.isOver && 'border-b-4 border-b-foreground')}>
        <DesignerComponents question={element} />
      </div>
    </div>
}
