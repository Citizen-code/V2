import { FaRegCircleDot } from "react-icons/fa6"
import { MdOutlineDoNotDisturbAlt } from "react-icons/md"
import { RiCheckboxMultipleLine } from 'react-icons/ri'

type DesignerButton = { icon: React.ElementType, label: string }

export default function DesignerButtons(type_id:number):DesignerButton {
  switch(type_id) {
    case 1: return { icon: FaRegCircleDot, label: "Одиночный выбор"}
    case 2: return { icon: RiCheckboxMultipleLine, label: "Множественный выбор"}
    default: return { icon: MdOutlineDoNotDisturbAlt, label: "Тип элемента не предусмотрен" }
  }
}
