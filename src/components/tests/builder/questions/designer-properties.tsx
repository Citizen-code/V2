import type { test_questions } from "@prisma/client";
import { DesignerProperties as SingleSelection } from "./types-questions/single-selection";
import { DesignerProperties as MultipleSelection } from "./types-questions/multiple-selection";

export default function DesignerProperties({question} : {question:test_questions}) {
  switch(question.type_id) {
    case 1: return <SingleSelection question={question}/>
    case 2: return <MultipleSelection question={question}/>
    default: return <div>Элемент не предусмотрен</div>
  }
}
