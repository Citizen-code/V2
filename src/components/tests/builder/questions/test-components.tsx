import type { test_questions } from "@prisma/client";
import { TestComponent as SingleSelection } from "./types-questions/single-selection";
import { TestComponent as MultipleSelection } from "./types-questions/multiple-selection";
import { Dispatch, SetStateAction } from "react";

export default function TestComponents({question, selected, setSelected, result_view} : {question:test_questions, selected:any[], setSelected:Dispatch<SetStateAction<any[]>>, result_view: boolean}) {
  switch(question.type_id) {
    case 1: return <SingleSelection question={question} selected={selected} setSelected={setSelected} result_view={result_view}/>
    case 2: return <MultipleSelection question={question} selected={selected} setSelected={setSelected} result_view={result_view}/>
    default: return <div>Элемент не предусмотрен</div>
  }
}

