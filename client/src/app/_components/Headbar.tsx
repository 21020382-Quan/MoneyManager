import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Headbar() {
  return (
    <div className='p-4 flex justify-between items-center border shadow-sm'>
      <div className='flex items-center gap-4'>
        <Image src={'/logo.png'} alt='logo' width='50' height='50' />
        <span>MoneyManager</span>
      </div>
      <div className='flex items-center gap-4'>
        <Link href='/login'>
          <Button>Login</Button>
        </Link>
        <Link href='/register'>
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  )
}