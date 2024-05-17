import type { MultipleSelectionType, SingleSelectionType } from "@/types/questions";
import type { test_questions } from "@prisma/client";
import { v4 } from "uuid";

export default function Constructor(type_id:number):test_questions {
  switch(type_id) {
    case 1: return {id:v4(),type_id:type_id, question:{}, answers:[{id:v4(), text:'', is_true:false}, {id:v4(), text:'', is_true:true}], test_id:''} as SingleSelectionType
    case 2: return {id:v4(),type_id:type_id, question:{}, answers:[{id:v4(), text:'', is_true:false}, {id:v4(), text:'', is_true:true}], test_id:''} as MultipleSelectionType
    default: throw new Error('Тип не предусмотрен')
  }
}
