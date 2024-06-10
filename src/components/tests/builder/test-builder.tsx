'use client'
import type { category, level, test, test_public, test_questions, type_question, type_test } from "@prisma/client";
import { useEffect } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import PreviewButton from "@/components/tests/builder/preview-button";
import DragOverlayWrapper from "@/components/tests/builder/drag-overlay-wrapper";
import useDesigner from "@/hooks/useDesigner";
import Designer from "@/components/tests/builder/designer";
import SaveTestButton from "./save-test-button";
import PublishTestButton from "./publish-test-button";
import TestEdit from "./test-edit";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function TestBuilder({ test, types, levels, categories, type_test }: { levels: level[], categories: category[], type_test: type_test[], types: type_question[], test: (test & { level: level, category: category, type_test: type_test, test_questions: test_questions[], test_public: test_public | null }) }) {
  const { setElements, setSelectedElement } = useDesigner();

  useEffect(() => {
    setElements(test.test_questions);
    setSelectedElement(null);
  }, [test, setElements, setSelectedElement]);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors}>
      <ScrollArea className="border-b-2">
        <div className='flex justify-between p-4 gap-3 items-center'>
          <h2 className='truncate font-medium'>
            <span className='text-muted-foreground mr-2'>Тестирование:</span>
            {test.name}
          </h2>
          <div className='flex items-center gap-2'>
            <PreviewButton />
            {!test.test_public && (
              <>
                <TestEdit levels={levels} categories={categories} type_test={type_test} selectedTest={test} />
                <SaveTestButton id={test.id} />
                <PublishTestButton id={test.id} />
              </>
            )}
          </div>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/builder-bg-light.svg)] dark:bg-[url(/builder-bg-dark.svg)]'>
        <Designer types={types} readonly={test.test_public !== null} />
      </div>
      <DragOverlayWrapper />
    </DndContext>
  );
}