"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/appointments", label: "Appointments", icon: "📅" },
    { href: "/dashboard/hospitals", label: "Hospitals", icon: "🏥" },
    { href: "/dashboard/medicines", label: "Medicines", icon: "💊" },
    { href: "/dashboard/ambulance", label: "Ambulance", icon: "🚑" },
    { href: "/dashboard/chatbot", label: "Health Advisor", icon: "🤖" },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-50 to-gray-100 dark:from-[#0a0e1f] dark:via-[#0e1529] dark:to-[#121933] text-gray-900 dark:text-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-200 dark:border-blue-900/20 shadow-xl">
      {/* Ambient Background Effects for Dark Mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="p-6 relative z-10 border-b border-gray-200 dark:border-blue-900/20">
        <h1 className="text-2xl font-bold text-gray-900 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400 dark:bg-clip-text dark:text-transparent">HealthCare+</h1>
        <p className="text-gray-600 dark:text-blue-300/70 text-sm">Your Health Companion</p>
      </div>

      <nav className="mt-6 relative z-10 pb-6">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              aria-current={pathname === item.href ? "page" : undefined}
              className={`mx-3 px-4 py-3 cursor-pointer transition-all flex items-center gap-3 rounded-xl mb-1 ${
                pathname === item.href
                  // Active state
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg dark:from-blue-600/80 dark:to-purple-600/80 dark:text-white dark:shadow-lg dark:shadow-blue-500/20 dark:border dark:border-blue-400/30"
                  // Hover state
                  : "text-gray-700 hover:bg-gray-200/60 dark:text-blue-100/80 dark:hover:text-white dark:hover:bg-white/5 dark:hover:shadow-md dark:hover:shadow-blue-500/10 dark:hover:border dark:hover:border-blue-400/20"
              }`}
            >
              <span className="shrink-0 text-xl">{item.icon}</span>
              <span className="truncate font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}