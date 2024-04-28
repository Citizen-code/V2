import useDesigner from "@/hooks/useDesigner";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from 'react-icons/ai'
import DesignerProperties from "../questions/designer-properties";

export default function PropertiesTestSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();
  if (!selectedElement) return null
  return (
    <div className='flex flex-col p-2'>
      <div className="flex justify-between items-center">
        <p className="test-sm text-foreground/70">Свойства вопроса</p>
        <Button size={'icon'} variant={'ghost'} onClick={() => setSelectedElement(null)}><AiOutlineClose/></Button>
      </div>
      <DesignerProperties question={selectedElement} />
    </div>
  );
}
