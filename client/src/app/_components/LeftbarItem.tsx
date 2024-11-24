'use client'

import { LucideIcon } from "lucide-react"
import { Button, ButtonProps } from "../../components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LeftbarItemProps extends ButtonProps {
  icon: LucideIcon
  link: string
}

export default function LeftbarItem({
  icon: Icon,
  link,
  children,
} : LeftbarItemProps) {
  const pathname = usePathname();
  const basePath = `/${pathname.split('/')[1]}`;
  return (
    <Link href={link}>
      <Button className={`
        w-full gap-2 text-md justify-start hover:text-blue-500 hover:bg-secondary
        ${basePath === link && 'text-blue-500 bg-secondary'}`}
        variant='ghost' 
      >
        <Icon />
        <span>{children}</span>
      </Button>
    </Link>
  )
}