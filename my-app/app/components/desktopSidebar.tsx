"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import appIcon from "@/app/icon.png";
import { navItems } from "./navItems";

export default function DesktopSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="group/sidebar hidden min-h-screen w-[4.75rem] shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-300 ease-out hover:w-60 lg:flex">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        aria-label="Tiffin Books home"
        className="flex h-16 items-center justify-center overflow-hidden border-b border-gray-200 px-3 group-hover/sidebar:justify-start"
      >
        <Image
          src={appIcon}
          alt="Tiffin Books"
          width={40}
          height={40}
          priority
          className="h-10 w-10 shrink-0 rounded-[10px] group-hover/sidebar:hidden"
        />
        <Image
          src="/logo2.svg"
          alt="Tiffin Books"
          width={168}
          height={50}
          priority
          unoptimized
          className="hidden h-9 w-auto max-w-none select-none group-hover/sidebar:block"
        />
      </button>

      <nav className="flex flex-1 flex-col gap-1 p-2.5 pt-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              title={item.label}
              className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition group-hover/sidebar:justify-start ${
                isActive
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#4A5C73] hover:bg-gray-50 hover:text-[#132745]"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? "text-white" : item.color
                }`}
                strokeWidth={1.75}
              />
              <span className="hidden truncate text-sm font-medium group-hover/sidebar:inline">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
