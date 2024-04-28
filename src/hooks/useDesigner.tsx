'use client'
import { useContext } from "react"
import { DesignerContext } from "@/context/designer-context"

export default function useDesigner() {
    const context = useContext(DesignerContext);
    if(!context) throw new Error('useDesigner должен быть использован в DesignerContext')
    
    return context;
}