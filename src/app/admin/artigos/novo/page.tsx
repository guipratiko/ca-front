"use client";

import Link from "next/link";
import { ArticleForm } from "@/components/article-form";
import { AdminNav } from "@/components/admin-nav";

export default function NewArticlePage() {
  return (
    <main className="min-h-screen">
      <AdminNav
        title="Novo artigo"
        active="artigos"
        action={
          <Link
            href="/admin/dashboard"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center text-sm"
          >
            ← Voltar
          </Link>
        }
      />
      <div className="max-w-6xl mx-auto px-5 py-6">
        <ArticleForm />
      </div>
    </main>
  );
}
