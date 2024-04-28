import { Button } from "@/components/ui/button"
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

export function TestParams() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Параметры отображения</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Параметры отображения</DrawerTitle>
            <DrawerDescription>Установка параметров отображения списка тестирований.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              1
            </div>
          </div>
          <DrawerFooter>
            <Button>Применить</Button>
            <DrawerClose asChild>
              <Button variant="outline">Закрыть</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
