"use client";

import Link from "next/link";
import { LessonForm } from "@/components/lesson-form";
import { AdminNav } from "@/components/admin-nav";

export default function NewLessonPage() {
  return (
    <main className="min-h-screen">
      <AdminNav
        title="Nova vídeo aula"
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
        <LessonForm />
      </div>
    </main>
  );
}
