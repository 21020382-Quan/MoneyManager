'use client'

import { ArrowLeftRight, LayoutDashboard, LogOut, Settings, Target, Wallet } from "lucide-react"
import LeftbarItem from "./LeftbarItem"

export default function Leftbar() {
    return (
        <div className='w-[300px] max-w-xs h-screen fixed left-0 top-0 border-r p-3'>
            <div className='h-[100px] border-b flex flex-row gap-2 items-center'>
                <div>Logo</div>
                <div>MoneyManager</div>
            </div>
            <div className='flex flex-col gap-2 w-full h-full pt-3'>
                <LeftbarItem icon={LayoutDashboard} link='/'>Dashboard</LeftbarItem>
                <LeftbarItem icon={ArrowLeftRight} link='/transactions'>Transactions</LeftbarItem>
                <LeftbarItem icon={Target} link='/plan'>Plan</LeftbarItem>
                <LeftbarItem icon={Wallet} link='/budget'>Budget</LeftbarItem>
                <LeftbarItem icon={Settings} link='/settings'>Settings</LeftbarItem>
                {/* <LeftbarItem icon={LogOut}>Log out</LeftbarItem> */}
            </div>
        </div>
    )
}