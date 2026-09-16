"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import {
  OpenLesson,
  TOKEN_KEY,
  createLesson,
  updateLesson,
} from "@/lib/api";

const LESSON_CATEGORIES = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
  { id: "eventos", label: "Eventos" },
];

function slugFromTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateInput(value?: string | null): string {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export function LessonForm({ lesson }: { lesson?: OpenLesson }) {
  const router = useRouter();
  const isEditing = !!lesson;

  const [title, setTitle] = useState(lesson?.title || "");
  const [slug, setSlug] = useState(lesson?.slug || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [youtubeId, setYoutubeId] = useState(lesson?.youtubeId || "");
  const [category, setCategory] = useState(lesson?.category || "iniciante");
  const [duration, setDuration] = useState(lesson?.duration || "");
  const [views, setViews] = useState(lesson?.views || "");
  const [sortOrder, setSortOrder] = useState(String(lesson?.sortOrder ?? 0));
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(lesson?.status || "DRAFT");
  const [publishedAt, setPublishedAt] = useState(toDateInput(lesson?.publishedAt));
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const onTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugFromTitle(value));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    if (!title.trim() || !youtubeId.trim() || !description.trim()) {
      alert("Preencha título, YouTube e descrição.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        youtubeId: youtubeId.trim(),
        category,
        duration: duration.trim(),
        views: views.trim(),
        sortOrder: Number(sortOrder) || 0,
        status,
        publishedAt: publishedAt ? `${publishedAt}T12:00:00.000Z` : null,
      };
      if (isEditing && lesson) {
        await updateLesson(token, lesson.id, payload);
      } else {
        await createLesson(token, payload);
      }
      router.push("/admin/aulas");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5 max-w-2xl">
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Título</span>
        <input
          className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          required
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Slug (id público)</span>
        <input
          className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white font-mono text-sm"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="aula-01"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">YouTube (ID ou URL)</span>
        <input
          className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          placeholder="ScMzIvxBSi4 ou https://youtu.be/..."
          required
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Descrição</span>
        <textarea
          className="min-h-[110px] px-3 py-2 rounded-xl border border-[var(--line)] bg-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Categoria</span>
          <select
            className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {LESSON_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Status</span>
          <select
            className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicada</option>
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Duração</span>
          <input
            className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="18:42"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Views</span>
          <input
            className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            placeholder="42 mil"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Ordem</span>
          <input
            type="number"
            className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Data de publicação</span>
        <input
          type="date"
          className="h-11 px-3 rounded-xl border border-[var(--line)] bg-white"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="h-11 px-5 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Save size={16} />
        {saving ? "Salvando…" : isEditing ? "Salvar alterações" : "Criar aula"}
      </button>
    </form>
  );
}
