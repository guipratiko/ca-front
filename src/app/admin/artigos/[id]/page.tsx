"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArticleForm } from "@/components/article-form";
import { AdminNav } from "@/components/admin-nav";
import { Article, TOKEN_KEY, getAdminArticle } from "@/lib/api";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    getAdminArticle(token, params.id)
      .then((data) => setArticle(data.article))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, [params.id, router]);

  return (
    <main className="min-h-screen">
      <AdminNav
        title="Editar artigo"
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
        {error ? <p className="text-red-600">{error}</p> : null}
        {!article && !error ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {article ? <ArticleForm article={article} /> : null}
      </div>
    </main>
  );
}
