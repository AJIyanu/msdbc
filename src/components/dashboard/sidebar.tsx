"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  SettingsIcon,
  HandCoins,
  PiggyBankIcon,
  WalletIcon,
  SchoolIcon,
  GiftIcon,
  LeafIcon,
  CloudDrizzleIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  MegaphoneIcon,
  CalendarDaysIcon,
  ChartNoAxesCombinedIcon,
  CalendarIcon,
  BookUserIcon,
  Clock,
  Star,
  FileBarChart,
} from "lucide-react";
import Link from "next/link";

export const iconMap: Record<string, React.JSX.Element> = {
  HomeIcon: <HomeIcon className="mr-2 h-4 w-4" />,
  users: <UsersIcon className="mr-2 h-4 w-4" />,
  settings: <SettingsIcon className="mr-2 h-4 w-4" />,
  "piggy-bank": <PiggyBankIcon className="mr-2 h-4 w-4" />,
  "hand-coins": <HandCoins className="mr-2 h-4 w-4" />,
  wallet: <WalletIcon className="mr-2 h-4 w-4" />,
  school: <SchoolIcon className="mr-2 h-4 w-4" />,
  gift: <GiftIcon className="mr-2 h-4 w-4" />,
  leaf: <LeafIcon className="mr-2 h-4 w-4" />,
  "cloud-drizzle": <CloudDrizzleIcon className="mr-2 h-4 w-4" />,
  "user-plus": <UserPlusIcon className="mr-2 h-4 w-4" />,
  "shield-check": <ShieldCheckIcon className="mr-2 h-4 w-4" />,
  megaphone: <MegaphoneIcon className="mr-2 h-4 w-4" />,
  "calendar-days": <CalendarDaysIcon className="mr-2 h-4 w-4" />,
  "chart-no-axes-combined": (
    <ChartNoAxesCombinedIcon className="mr-2 h-4 w-4" />
  ),
  calendar: <CalendarIcon className="mr-2 h-4 w-4" />,
  clock: <Clock className="mr-2 h-4 w-4" />,
  star: <Star className="mr-2 h-4 w-4" />,
  book: <BookUserIcon className="mr-2 h-4 w-4" />,
  "file-bar-chart": <FileBarChart className="mr-2 h-4 w-4" />,
};

interface DashboardSidebarProps {
  menuConfig: MenuConfig;
}

export function DashboardSidebar({ menuConfig }: DashboardSidebarProps) {
  // const router = useRouter();
  const [menuState, setMenuState] = useState(menuConfig);

  const pathname = usePathname();

  const setActiveItemFromPath = (path: string) => {
    const updatedState = menuConfig.map((group) => ({
      ...group,
      menuItems: group.menuItems.map((item) => ({
        ...item,
        isActive: path === item.link, //|| path.startsWith(item.link + "/"),
      })),
    }));

    setMenuState(updatedState);
  };

  useEffect(() => {
    console.log("Pathname changed:", pathname);
    setActiveItemFromPath(pathname);
  }, [pathname]);

  // const handleMenuClick = (groupIndex: number, itemIndex: number) => {
  //   const selectedItem = menuState[groupIndex].menuItems[itemIndex];
  //   console.log("Selected item:", selectedItem);
  //   // router.push(selectedItem.link);
  // };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Image src="/msdbclogo.webp" alt="msdbclogo" width={60} height={60} />
          <span className="font-semibold leading-4">
            MSDBC <br /> Digital Record
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Separator className="mx-3" />

        {menuState.map((group, groupIndex) => (
          <SidebarGroup key={group.groupName}>
            {group.groupName && (
              <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.menuItems.map((item, itemIndex) => (
                  <SidebarMenuItem key={item.menu}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      // onClick={() => handleMenuClick(groupIndex, itemIndex)}
                    >
                      <Link href={item.link}>
                        <button className="w-full flex items-center text-left">
                          {iconMap[item.icon] ?? null}
                          <span>{item.menu}</span>
                        </button>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {/* <Separator className="mx-3" /> */}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
