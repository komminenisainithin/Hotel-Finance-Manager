"use client";

import { usePathname, useRouter } from "next/navigation";

import { navItems } from "./navItems";

export default function MobilebottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className="flex cursor-pointer flex-col items-center gap-1"
          >
            <Icon
              className={`h-6 w-6 rounded-full p-1 ${item.bgColor} ${item.color} ${
                isActive ? "ring-2 ring-offset-1 ring-current" : ""
              }`}
            />
            <span
              className={`text-xs ${isActive ? "font-medium text-gray-900" : "text-gray-500"}`}
            >
              {item.shortLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
