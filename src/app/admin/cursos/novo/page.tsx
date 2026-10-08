"use client";

import Link from "next/link";
import { CourseForm } from "@/components/course-form";
import { AdminNav } from "@/components/admin-nav";

export default function NewCoursePage() {
  return (
    <main className="min-h-screen">
      <AdminNav
        title="Novo curso"
        active="cursos"
        action={
          <Link
            href="/admin/cursos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center text-sm"
          >
            ← Voltar
          </Link>
        }
      />
      <div className="max-w-6xl mx-auto px-5 py-6">
        <CourseForm />
      </div>
    </main>
  );
}
