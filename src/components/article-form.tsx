"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Save, Upload } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  Article,
  TOKEN_KEY,
  createArticle,
  updateArticle,
  uploadImage,
} from "@/lib/api";

const CATEGORIES = ["Carreira", "Técnico", "Ferramentas", "Negócios", "Geral"];
const GLYPHS = ["📝", "💰", "🔥", "🧰", "🧮", "🔬", "📍", "🛡️", "📄", "🔎", "📱", "💡"];

function slugFromTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [coverImage, setCoverImage] = useState(article?.coverImage || "");
  const [category, setCategory] = useState(article?.category || "Carreira");
  const [author, setAuthor] = useState(article?.author || "Equipe CA Cursos");
  const [glyph, setGlyph] = useState(article?.glyph || "📝");
  const [featured, setFeatured] = useState(!!article?.featured);
  const [readingTime, setReadingTime] = useState(article?.readingTime || 5);
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(article?.status || "DRAFT");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEditing);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugFromTitle(value));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setUploading(true);
    try {
      const url = await uploadImage(token, file);
      setCoverImage(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (saveStatus: "DRAFT" | "PUBLISHED") => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setSaving(true);
    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      coverImage: coverImage || null,
      category,
      author,
      glyph,
      featured,
      readingTime,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      status: saveStatus,
    };
    try {
      if (isEditing && article) await updateArticle(token, article.id, payload);
      else await createArticle(token, payload);
      setStatus(saveStatus);
      router.push("/admin/dashboard");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    sessionStorage.setItem(
      "article_preview",
      JSON.stringify({ title, excerpt, content, coverImage, category, author, glyph, readingTime })
    );
    window.open("/admin/preview", "_blank");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <label className="block text-sm font-semibold mb-1.5">Título</label>
          <input
            className="w-full h-12 rounded-xl border border-[var(--line)] px-3 text-lg font-semibold outline-none focus:border-[var(--brand)]"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex.: Como escolher a fonte de bancada"
            required
          />
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <label className="block text-sm font-semibold mb-1.5">Resumo</label>
          <textarea
            className="w-full min-h-[96px] rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--brand)]"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Texto curto dos cards do blog"
            required
          />
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <label className="block text-sm font-semibold mb-2">Conteúdo</label>
          <p className="text-sm text-[var(--muted)] mb-3">
            O editor mostra o texto como ficará no artigo (títulos, listas, links e imagens).
          </p>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">Publicação</h3>
          <label className="block text-sm font-semibold">Status</label>
          <select
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Destacar na home do blog
          </label>
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("PUBLISHED")}
              className="h-10 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Salvando…" : "Publicar"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("DRAFT")}
              className="h-10 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center justify-center gap-2"
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="h-10 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center justify-center gap-2"
            >
              <Eye size={16} /> Visualizar prévia
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">Metadados</h3>
          <label className="block text-sm font-semibold">Slug</label>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
          <label className="block text-sm font-semibold">Categoria</label>
          <select
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="block text-sm font-semibold">Autor</label>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label className="block text-sm font-semibold">Ícone</label>
          <div className="flex flex-wrap gap-1.5">
            {GLYPHS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGlyph(g)}
                className={`h-9 w-9 rounded-lg border text-lg ${
                  glyph === g ? "border-[var(--brand)] bg-[rgba(255,106,0,.1)]" : "border-[var(--line)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <label className="block text-sm font-semibold">Tempo de leitura (min)</label>
          <input
            type="number"
            min={1}
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={readingTime}
            onChange={(e) => setReadingTime(Number(e.target.value) || 5)}
          />
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">Capa</h3>
          <label className="h-10 rounded-xl border border-dashed border-[var(--line)] flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold hover:bg-black/[.02]">
            <Upload size={16} />
            {uploading ? "Enviando…" : "Enviar imagem"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="" className="w-full rounded-xl border border-[var(--line)]" />
          ) : null}
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3 text-sm"
            placeholder="ou cole a URL"
            value={coverImage || ""}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">SEO</h3>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            placeholder="SEO title"
            value={seoTitle || ""}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
          <textarea
            className="w-full min-h-[80px] rounded-xl border border-[var(--line)] px-3 py-2"
            placeholder="SEO description"
            value={seoDescription || ""}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </div>
      </aside>
    </div>
  );
}
