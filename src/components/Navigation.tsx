"use client";

import { Heart, Image, Key, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/memories", label: "Memories", icon: Image },
    { href: "/games", label: "Play", icon: Heart },
    { href: "/secrets", label: "Vault", icon: Key },
    { href: "/admin", label: "Admin", icon: Settings, hidden: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:top-0 md:bottom-auto md:p-6 flex justify-center pointer-events-none">
      <nav className="romantic-card px-3 py-3 rounded-full flex items-center gap-2 shadow-2xl pointer-events-auto backdrop-blur-xl border-2 border-white/60">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-2",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-primary hover:bg-pink-50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 romantic-gradient rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                <link.icon className={cn("w-5 h-5 relative z-10", isActive && "drop-shadow-md")} />
                <span className={cn("text-sm font-semibold relative z-10 hidden sm:block", isActive && "drop-shadow-md")}>
                  {link.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
