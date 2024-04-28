import { FaRegCircleDot } from "react-icons/fa6"
import { MdOutlineDoNotDisturbAlt } from "react-icons/md"

type DesignerButton = { icon: React.ElementType, label: string }

export default function DesignerButtons(type_id:number):DesignerButton {
  switch(type_id) {
    case 1: return { icon: FaRegCircleDot, label: "Одиночный выбор"}
    default: return { icon: MdOutlineDoNotDisturbAlt, label: "Тип элемента не предусмотрен" }
  }
}
