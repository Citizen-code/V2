import type { test_questions } from "@prisma/client";
import type { UUID } from "crypto";

export type SingleSelectionType = test_questions & {
  question: {
    image: string | undefined,
    text: string,
  },
  answers: {
    id:UUID,
    text:string,
    is_true:boolean,
  }[]
}

export type SingleSelectionTestType = test_questions & {
  question: {
    image: string | undefined,
    text: string,
  },
  answers: {
    id:UUID,
    text:string,
  }[],
  selected:UUID | undefined,
}


export type MultipleSelectionType = test_questions & {
  question: {
    image: string | undefined,
    text: string,
  },
  answers: {
    id:UUID,
    text:string,
    is_true:boolean,
  }[]
}

export type MultipleSelectionTestType = test_questions & {
  question: {
    image: string | undefined,
    text: string,
  },
  answers: {
    id:UUID,
    text:string,
  }[],
  selected:UUID[],
}