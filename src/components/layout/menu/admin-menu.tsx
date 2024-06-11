'use client'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import Link from "next/link";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Тестирования",
    href: "/admin/tests",
    description:
      "Информация о тестированиях.",
  },
  {
    title: "Сотрудники",
    href: "/admin/users",
    description:
      "Информация о сотрудниках.",
  },
]

export default function AdminMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Информация</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid min-w-[300px] gap-3 p-4">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/admin/database" passHref legacyBehavior>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              База данных
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" passHref legacyBehavior>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              О приложении
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ className, title, children, href }:{className?:any, title?:any, children?:any, href?:string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={{
          pathname:href
        }} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}