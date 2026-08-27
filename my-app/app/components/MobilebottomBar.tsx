"use client";

import { usePathname, useRouter } from "next/navigation";

import { navItems } from "./navItems";

export default function MobilebottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1F3A5F]/10 bg-white/95 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(19,39,69,0.06)] backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-1">
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
              className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition ${
                isActive ? "bg-[#1F3A5F]/5" : ""
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-[#E96B2E]" : "text-[#6B7C93]"
                }`}
              />
              <span
                className={`truncate text-[10px] font-medium ${
                  isActive ? "text-[#132745]" : "text-[#6B7C93]"
                }`}
              >
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
