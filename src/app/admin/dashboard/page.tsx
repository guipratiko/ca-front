"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Pencil, Trash2, Package } from "lucide-react";
import {
  Article,
  TOKEN_KEY,
  deleteArticle,
  listAdminArticles,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    listAdminArticles(token)
      .then((data) => setArticles(data.articles || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  };

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"?`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      await deleteArticle(token, id);
      setArticles((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand)]">
              CA Cursos
            </p>
            <h1 className="text-lg font-extrabold leading-tight">Artigos do blog</h1>
          </div>
          <Link
            href="/admin/produtos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Package size={16} /> Produtos
          </Link>
          <Link
            href="/admin/artigos/novo"
            className="h-10 px-4 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center gap-2"
          >
            <Plus size={16} /> Novo artigo
          </Link>
          <button
            type="button"
            onClick={logout}
            className="h-10 w-10 rounded-xl border border-[var(--line)] inline-grid place-items-center"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {loading ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}

        {!loading && !articles.length ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
            <p className="font-semibold mb-2">Nenhum artigo ainda</p>
            <Link href="/admin/artigos/novo" className="text-[var(--brand-700)] font-bold">
              Criar o primeiro →
            </Link>
          </div>
        ) : null}

        <div className="grid gap-3">
          {articles.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5 flex flex-wrap gap-3 items-center shadow-sm"
            >
              <div className="text-2xl w-10 text-center">{a.glyph || "📝"}</div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-bold">{a.title}</h2>
                <p className="text-sm text-[var(--muted)] line-clamp-1">{a.excerpt}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {a.category} · {a.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  {a.featured ? " · Destaque" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/artigos/${a.id}`}
                  className="h-9 px-3 rounded-lg border border-[var(--line)] inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  <Pencil size={14} /> Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(a.id, a.title)}
                  className="h-9 px-3 rounded-lg border border-red-200 text-red-600 inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
