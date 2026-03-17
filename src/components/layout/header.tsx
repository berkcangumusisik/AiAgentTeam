"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  className?: string;
}

const segmentTranslations: Record<string, string> = {
  agents: "Ajanlar",
  teams: "Takımlar",
  tasks: "Görevler",
  runs: "Çalıştırmalar",
  monitor: "İzleme",
  settings: "Ayarlar",
  new: "Yeni",
  providers: "Sağlayıcılar",
};

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const translated =
      segmentTranslations[segment.toLowerCase()] ??
      segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label: translated,
      href: currentPath,
    });
  }

  return breadcrumbs;
}

export function Header({ onMobileMenuToggle, className }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-4 border-b bg-background px-6",
        className
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onMobileMenuToggle}
        aria-label="Menüyü aç"
      >
        <Menu className="size-4" />
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="İçerik haritası">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && (
              <Separator orientation="vertical" className="mx-1 h-4" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <ThemeToggle />
    </header>
  );
}
