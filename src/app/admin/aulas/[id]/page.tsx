"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LessonForm } from "@/components/lesson-form";
import { AdminNav } from "@/components/admin-nav";
import { OpenLesson, TOKEN_KEY, getAdminLesson } from "@/lib/api";

export default function EditLessonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<OpenLesson | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    getAdminLesson(token, params.id)
      .then((data) => setLesson(data.lesson))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, [params.id, router]);

  return (
    <main className="min-h-screen">
      <AdminNav
        title="Editar vídeo aula"
        active="aulas"
        action={
          <Link
            href="/admin/aulas"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center text-sm"
          >
            ← Voltar
          </Link>
        }
      />
      <div className="max-w-6xl mx-auto px-5 py-6">
        {error ? <p className="text-red-600">{error}</p> : null}
        {!lesson && !error ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {lesson ? <LessonForm lesson={lesson} /> : null}
      </div>
    </main>
  );
}
