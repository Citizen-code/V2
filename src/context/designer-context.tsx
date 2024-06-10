'use client'
import type { test_questions } from "@prisma/client"
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react"

type DesignerContextType = {
  elements: test_questions[],
  setElements: Dispatch<SetStateAction<test_questions[]>>,
  addElement: (index: number, element: test_questions) => void,
  removeElement: (id: string) => void,

  selectedElement: test_questions | null,
  setSelectedElement: Dispatch<SetStateAction<test_questions | null>>,

  updateElement: (id: string, element: test_questions) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerContextProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<test_questions[]>([])
  const [selectedElement, setSelectedElement] = useState<test_questions | null>(null)

  const addElement = (index: number, element: test_questions) => {
    setElements((prev) => {
      console.log(index)
      const newElement = [...prev];
      newElement.splice(index, 0, element)
      return newElement
    })
  }
  const removeElement = (id: string) => setElements((prev) => prev.filter((element) => element.id !== id))
  const updateElement = (id: string, element: test_questions) => {
    setElements((prev) => {
      const newElement = [...prev];
      const index = newElement.findIndex((el) => el.id === id)
      newElement[index] = element
      return newElement
    })
  }

  return (<DesignerContext.Provider value={{ elements, setElements, addElement, removeElement, selectedElement, setSelectedElement, updateElement }}>
    {children}
  </DesignerContext.Provider>)
}