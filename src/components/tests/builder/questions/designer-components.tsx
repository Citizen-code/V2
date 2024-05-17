import type { test_questions } from "@prisma/client";
import { DesignerComponent as SingleSelection } from "./types-questions/single-selection";
import { DesignerComponent as MultipleSelection } from "./types-questions/multiple-selection";

export default function DesignerComponents({question} : {question:test_questions}) {
  switch(question.type_id) {
    case 1: return <SingleSelection question={question}/>
    case 2: return <MultipleSelection question={question}/>
    default: return <div>Элемент не предусмотрен</div>
  }
}

