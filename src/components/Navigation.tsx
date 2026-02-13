import { Heart, Image, Key, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import {useRouter} from "next/router";

export function Navigation() {
  const router = useRouter();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/memories", label: "Memories", icon: Image },
    { href: "/games", label: "Play", icon: Heart },
    { href: "/secrets", label: "Vault", icon: Key },
    { href: "/admin", label: "Admin", icon: Settings, hidden: true }, // Keep hidden or subtle
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:top-0 md:bottom-auto md:p-6 flex justify-center pointer-events-none">
      <nav className="glass-card px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl shadow-primary/10 pointer-events-auto">
        {links.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  "relative px-4 py-2 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-2",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon className={cn("w-5 h-5 relative z-10", isActive && "text-white")} />
                <span className={cn("text-sm font-medium relative z-10 hidden sm:block", isActive && "text-white")}>
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
