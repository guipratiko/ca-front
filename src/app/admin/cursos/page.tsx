"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import {
  Course,
  TOKEN_KEY,
  deleteCourse,
  formatBRL,
  listAdminCourses,
} from "@/lib/api";

const CAT_LABEL: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
  eventos: "Eventos",
  entrada: "Avulso",
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    listAdminCourses(token)
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [router]);

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"?`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      await deleteCourse(token, id);
      setCourses((list) => list.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  return (
    <main className="min-h-screen">
      <AdminNav
        title="Catálogo de cursos"
        active="cursos"
        action={
          <Link
            href="/admin/cursos/novo"
            className="h-10 px-4 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center gap-2"
          >
            <Plus size={16} /> Novo curso
          </Link>
        }
      />

      <div className="max-w-6xl mx-auto px-5 py-8">
        {loading ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}

        {!loading && !courses.length ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
            <GraduationCap className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="font-semibold mb-2">Nenhum curso ainda</p>
            <Link href="/admin/cursos/novo" className="text-[var(--brand-700)] font-bold">
              Cadastrar o primeiro →
            </Link>
          </div>
        ) : null}

        <div className="grid gap-3">
          {courses.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5 flex flex-wrap gap-3 items-center shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg)] border border-[var(--line)] grid place-items-center text-2xl shrink-0">
                {c.glyph || "📱"}
              </div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-bold">{c.title}</h2>
                <p className="text-sm text-[var(--muted)] line-clamp-1">{c.summary}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {CAT_LABEL[c.category] || c.category} · {formatBRL(c.price)} ·{" "}
                  {c.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  {c.featured ? " · Destaque" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/cursos/${c.id}`}
                  className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-1.5 text-sm"
                >
                  <Pencil size={14} /> Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(c.id, c.title)}
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
