"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CourseForm } from "@/components/course-form";
import { AdminNav } from "@/components/admin-nav";
import { Course, TOKEN_KEY, getAdminCourse } from "@/lib/api";

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    getAdminCourse(token, params.id)
      .then((data) => setCourse(data.course))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, [params.id, router]);

  return (
    <main className="min-h-screen">
      <AdminNav
        title="Editar curso"
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
        {error ? <p className="text-red-600">{error}</p> : null}
        {!course && !error ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {course ? <CourseForm course={course} /> : null}
      </div>
    </main>
  );
}
