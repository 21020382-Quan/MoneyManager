'use client';

import {
  ArrowLeftRight,
  LayoutDashboard,
  Target,
  Wallet,
  Menu,
  ChevronLeft,
  ChevronRight,
  PenToolIcon,
} from 'lucide-react';
import LeftbarItem from './LeftbarItem';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Leftbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
      icon: PenToolIcon,
      link: '/tools',
      title: 'Tools',
      submenu: [
        {
          label: 'Fuel price',
          link: '/fuelPrice',
        },
        {
          label: 'Gold price',
          link: '/goldPrice',
        },
        {
          label: 'Crypto price',
          link: '/cryptoPrice',
        },
        {
          label: 'Foreign currency price',
          link: '/foreignCurrencyPrice',
        },
        {
          label: 'Electricity price',
          link: '/electricityPrice',
        },
      ],
    },
  ];

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen border-r p-3 bg-white dark:bg-black flex flex-col justify-between z-50 
          transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}
      >
        {/* Header Section */}
        <div className="h-20 border-b flex items-center gap-2 px-3">
          <Image src={'/logo.png'} alt="logo" width={40} height={40} />
          <div className="text-blue-500 font-bold text-lg">MoneyManager</div>
        </div>

        {/* Sidebar Items */}
        <div className="flex flex-col gap-4 w-full h-full pt-4">
          {items.map((item, index) => (
            <LeftbarItem
              key={index}
              icon={item.icon}
              link={item.link}
              submenu={item.submenu || []} // Ensure submenu is always an array
              className="hover:bg-secondary px-4 py-2 rounded-lg"
            >
              {item.title}
            </LeftbarItem>
          ))}
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-center px-3">
          <UserButton />
          <ThemeToggle />
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <Button
        onClick={toggleSidebar}
        className={`absolute top-8 z-50 rounded-r-full shadow-md transition-all duration-300 lg:hidden w-2
          ${isSidebarOpen ? 'left-64' : 'left-0'}`}
        variant="outline"
      >
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </>
  );
}
