'use client'

import { ArrowLeftRight, LayoutDashboard, Target, Wallet } from "lucide-react"
import LeftbarItem from "./LeftbarItem"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { useState } from "react"
import { Calendar } from "@nextui-org/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Leftbar() {
  const items = [
    {
      icon: LayoutDashboard,
      link: '/dashboard',
      title: 'Dashboard',
    },
    {
      icon: Wallet,
      link: '/budgets',
      title: 'Budgets',
    },
    {
      icon: ArrowLeftRight,
      link: '/transactions',
      title: 'Transactions',
    },
    {
      icon: Target,
      link: '/plan',
      title: 'Plan',
    },
  ]

  return (
    <div className='w-60 h-screen fixed left-0 top-0 border-r p-3 flex flex-col justify-around'>
      <div className='h-20 border-b flex flex-row gap-2 items-center'>
        <Image src={'/logo.png'} alt='logo' width='50' height='50' />
        <div className='text-blue-500 font-bold text-xl'>MoneyManager</div>
      </div>
      <div className='flex flex-col gap-2 w-full h-full pt-3'>
        {items.map((item, index) => (
          <LeftbarItem key={index} icon={item.icon} link={item.link}>
            {item.title}
          </LeftbarItem>
        ))}
      </div>
      <div className='pl-2 flex justify-between'>
        <UserButton />
        <ThemeToggle />
      </div>
    </div>
  )
}