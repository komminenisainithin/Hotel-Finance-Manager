"use client";

import { usePathname, useRouter } from "next/navigation";

import { navItems } from "./navItems";

export default function DesktopSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="group hidden min-h-screen w-20 shrink-0 flex-col border-r border-gray-300 bg-white transition-all duration-300 hover:w-64 lg:flex">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className={`flex w-full cursor-pointer items-center gap-3 p-4 text-left hover:bg-gray-100 ${
              isActive ? "bg-gray-100" : ""
            }`}
          >
            <Icon
              className={`h-10 w-10 shrink-0 rounded-full p-2 ${item.bgColor} ${item.color}`}
            />
            <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
