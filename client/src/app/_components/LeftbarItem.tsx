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
    ...props
} : LeftbarItemProps) {
    const pathname = usePathname();
    return (
        <Link href={link}>
            <Button className={`
                w-full gap-2 justify-start hover:text-blue-500 hover:bg-blue-100
                ${pathname === link && 'text-blue-500'}`} 
                variant='ghost' 
                {...props}>
                <Icon />
                <span>{children}</span>
            </Button>
        </Link>
    )
}