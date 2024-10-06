import { LucideIcon } from "lucide-react"
import { Button, ButtonProps } from "../../components/ui/button"
import Link from "next/link"

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
    return (
        <Link href={link}>
            <Button className='w-full gap-2 justify-start' variant='ghost' {...props}>
                <Icon />
                <span>{children}</span>
            </Button>
        </Link>
    )
}