"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Pencil, Trash2, Video, FileText, Package, Tags } from "lucide-react";
import {
  OpenLesson,
  TOKEN_KEY,
  deleteLesson,
  listAdminLessons,
} from "@/lib/api";

const CAT_LABEL: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
  eventos: "Eventos",
};

export default function AdminLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<OpenLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    listAdminLessons(token)
      .then((data) => setLessons(data.lessons || []))
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
      await deleteLesson(token, id);
      setLessons((list) => list.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand)]">
              CA Cursos
            </p>
            <h1 className="text-lg font-extrabold leading-tight">Vídeo aulas abertas</h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <FileText size={16} /> Artigos
          </Link>
          <Link
            href="/admin/produtos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Package size={16} /> Produtos
          </Link>
          <Link
            href="/admin/categorias"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Tags size={16} /> Categorias
          </Link>
          <Link
            href="/admin/aulas/novo"
            className="h-10 px-4 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center gap-2"
          >
            <Plus size={16} /> Nova aula
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

        {!loading && !lessons.length ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
            <Video className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="font-semibold mb-2">Nenhuma aula ainda</p>
            <Link href="/admin/aulas/novo" className="text-[var(--brand-700)] font-bold">
              Cadastrar a primeira →
            </Link>
          </div>
        ) : null}

        <div className="grid gap-3">
          {lessons.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5 flex flex-wrap gap-3 items-center shadow-sm"
            >
              <div className="w-20 h-14 rounded-xl bg-[var(--bg)] border border-[var(--line)] overflow-hidden grid place-items-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${a.youtubeId}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-bold">{a.title}</h2>
                <p className="text-sm text-[var(--muted)] line-clamp-1">{a.description}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {CAT_LABEL[a.category] || a.category} · {a.duration || "—"} ·{" "}
                  {a.status === "PUBLISHED" ? "Publicada" : "Rascunho"} · ordem {a.sortOrder}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/aulas/${a.id}`}
                  className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-1.5 text-sm"
                >
                  <Pencil size={14} /> Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(a.id, a.title)}
                  className="h-10 px-3 rounded-xl border border-red-200 text-red-700 font-semibold inline-flex items-center gap-1.5 text-sm"
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
