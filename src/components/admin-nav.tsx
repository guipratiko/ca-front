"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  GraduationCap,
  Layout,
  LogOut,
  Package,
  Tags,
  Video,
} from "lucide-react";
import { TOKEN_KEY } from "@/lib/api";

export type AdminNavActive =
  | "artigos"
  | "conteudo"
  | "cursos"
  | "produtos"
  | "aulas"
  | "categorias";

const NAV_ITEMS: Array<{
  id: AdminNavActive;
  href: string;
  label: string;
  icon: typeof FileText;
}> = [
  { id: "artigos", href: "/admin/dashboard", label: "Artigos", icon: FileText },
  { id: "conteudo", href: "/admin/conteudo", label: "Conteúdo", icon: Layout },
  { id: "cursos", href: "/admin/cursos", label: "Cursos", icon: GraduationCap },
  { id: "produtos", href: "/admin/produtos", label: "Produtos", icon: Package },
  { id: "aulas", href: "/admin/aulas", label: "Aulas", icon: Video },
  { id: "categorias", href: "/admin/categorias", label: "Categorias", icon: Tags },
];

export function AdminNav({
  title,
  active,
  action,
}: {
  title: string;
  active: AdminNavActive;
  action?: ReactNode;
}) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-3 space-y-3">
        {/* Linha 1: marca + menu (larguras iguais) + sair */}
        <div className="flex items-center gap-2">
          <p className="w-[88px] shrink-0 text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand)]">
            CA Cursos
          </p>
          <nav className="grid grid-cols-6 gap-2 flex-1 min-w-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`h-10 w-full rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 text-sm whitespace-nowrap ${
                    isActive
                      ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                      : "border-[var(--line)]"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="h-10 w-10 shrink-0 rounded-xl border border-[var(--line)] inline-grid place-items-center"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Linha 2: título + ação */}
        <div className="flex items-center gap-3 min-h-10">
          <h1 className="text-lg font-extrabold leading-tight flex-1 min-w-0 truncate">
            {title}
          </h1>
          {action ? <div className="shrink-0 h-10 flex items-center">{action}</div> : null}
        </div>
      </div>
    </header>
  );
}
