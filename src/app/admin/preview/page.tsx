"use client";

import { useEffect, useState } from "react";

type Preview = {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  author?: string;
  glyph?: string;
  readingTime?: number;
};

export default function PreviewPage() {
  const [data, setData] = useState<Preview | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("article_preview");
      setData(raw ? JSON.parse(raw) : null);
    } catch {
      setData(null);
    }
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen grid place-items-center p-8">
        <p className="text-[var(--muted)]">Nenhuma prévia encontrada. Abra pelo formulário do artigo.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-5 py-12">
        <p className="text-xs font-bold tracking-[0.14em] uppercase text-[var(--brand)] mb-3">
          {data.glyph || "📝"} {data.category || "Blog"} · prévia
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">{data.title}</h1>
        <p className="text-lg text-[var(--muted)] mb-6">{data.excerpt}</p>
        <p className="text-sm text-[var(--muted)] mb-8">
          {data.author || "Equipe CA Cursos"}
          {data.readingTime ? ` · ${data.readingTime} min` : ""}
        </p>
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImage} alt="" className="w-full rounded-2xl mb-8" />
        ) : null}
        <div
          className="prose-editor-content"
          dangerouslySetInnerHTML={{ __html: data.content || "" }}
        />
      </article>
    </main>
  );
}
