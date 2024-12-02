"use client"

import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import { Button, ButtonProps } from "../../components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SubmenuItem {
  label: string;
  link: string;
}

interface LeftbarItemProps extends ButtonProps {
  icon: LucideIcon;
  link: string;
  submenu?: SubmenuItem[];
}

export default function LeftbarItem({
  icon: Icon,
  link,
  children,
  submenu,
}: LeftbarItemProps) {
  const pathname = usePathname();
  const basePath = `/${pathname.split("/")[1]}`;
  const subPath = `/${pathname.split("/")[2]}`;
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleToggleSubmenu = () => {
    if (submenu) {
      setSubmenuOpen(!submenuOpen);
    }
  };

  return ( submenu?.length ? 
    <>
      <Button 
        className={`
          w-full text-md justify-between items-center px-4 py-2 hover:text-blue-500 hover:bg-secondary
          ${basePath === link && "text-blue-500 bg-secondary"}
        `}
        variant="ghost"
        onClick={handleToggleSubmenu}
      >
        <div className="flex items-center gap-2">
          <Icon />
          <span>{children}</span>
        </div>
        {submenuOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>
      {submenu && submenuOpen && (
        <div className="flex flex-col gap-2 ml-4">
          {submenu.map((item) => (
            <Link href={link + item.link} key={item.link}>
              <Button
                className={`w-full gap-2 text-sm justify-start hover:text-blue-500 hover:bg-secondary
                ${subPath === item.link && "text-blue-500 bg-secondary"}`}
                variant="ghost"
              >
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      )}
    </> :
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
  );
}
