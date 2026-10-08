"use client";

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
  action?: React.ReactNode;
}) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand)]">
            CA Cursos
          </p>
          <h1 className="text-lg font-extrabold leading-tight">{title}</h1>
        </div>

        <nav className="flex items-center gap-2 flex-wrap">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`h-10 px-3 rounded-xl border font-semibold inline-flex items-center gap-2 text-sm ${
                  isActive
                    ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "border-[var(--line)]"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
          {action}
          <button
            type="button"
            onClick={logout}
            className="h-10 w-10 rounded-xl border border-[var(--line)] inline-grid place-items-center"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
}
