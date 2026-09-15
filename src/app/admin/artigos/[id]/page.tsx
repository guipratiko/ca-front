"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArticleForm } from "@/components/article-form";
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
      <header className="border-b border-[var(--line)] bg-white">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          <div className="flex-1">
            <Link href="/admin/dashboard" className="text-sm text-[var(--brand-700)] font-semibold">
              ← Voltar
            </Link>
            <h1 className="text-lg font-extrabold">Editar artigo</h1>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-5 py-6">
        {error ? <p className="text-red-600">{error}</p> : null}
        {!article && !error ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {article ? <ArticleForm article={article} /> : null}
      </div>
    </main>
  );
}
