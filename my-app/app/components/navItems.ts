import {
  BadgeDollarSign,
  HomeIcon,
  ShoppingCart,
  TrendingUp,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    shortLabel: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    label: "Sales",
    shortLabel: "Sales",
    href: "/sales",
    icon: TrendingUp,
    color: "text-teal-600",
    bgColor: "bg-teal-600/10",
  },
  {
    label: "Purchases",
    shortLabel: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
  {
    label: "Expenses",
    shortLabel: "Expenses",
    href: "/expenses",
    icon: BadgeDollarSign,
    color: "text-red-600",
    bgColor: "bg-red-600/10",
  },
  {
    label: "Profile",
    shortLabel: "Profile",
    href: "/profile",
    icon: UserIcon,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
];
