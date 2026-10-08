"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Course, TOKEN_KEY, createCourse, updateCourse } from "@/lib/api";

const COURSE_CATEGORIES = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
  { id: "eventos", label: "Eventos" },
  { id: "entrada", label: "Avulso" },
];

function slugFromTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function asStringList(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list.map((v) => String(v)).filter(Boolean);
}

function listToLines(list?: string[] | null): string {
  return asStringList(list).join("\n");
}

function faqToText(faq?: Array<[string, string] | string[]> | null): string {
  return (faq || [])
    .map((pair) => {
      const q = pair?.[0] || "";
      const a = pair?.[1] || "";
      return `${q} | ${a}`;
    })
    .join("\n");
}

function textToFaq(text: string): Array<[string, string]> {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [q, ...rest] = line.split("|");
      return [q.trim(), rest.join("|").trim()] as [string, string];
    })
    .filter(([q]) => q);
}

function classesToText(
  classes?: Array<{ periodo?: string; dias?: string; horario?: string; data?: string }> | null
): string {
  return (classes || [])
    .map((t) => [t.periodo || "", t.dias || "", t.horario || "", t.data || ""].join(" | "))
    .join("\n");
}

function textToClasses(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [periodo = "", dias = "", horario = "", data = ""] = line.split("|").map((s) => s.trim());
      return { periodo, dias, horario, data };
    });
}

function modulesToText(
  modules?: Array<{ titulo?: string; aulas?: Array<[string, string] | string[]> }> | null
): string {
  const lines: string[] = [];
  for (const mod of modules || []) {
    if (mod.titulo) lines.push(`# ${mod.titulo}`);
    for (const aula of mod.aulas || []) {
      lines.push(String(aula?.[0] || "").trim());
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

function textToModules(text: string) {
  const modules: Array<{ titulo: string; aulas: Array<[string, string]> }> = [];
  let current: { titulo: string; aulas: Array<[string, string]> } | null = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      if (current) modules.push(current);
      current = { titulo: line.replace(/^#\s*/, ""), aulas: [] };
      continue;
    }
    if (!current) current = { titulo: "Conteúdo", aulas: [] };
    current.aulas.push([line, ""]);
  }
  if (current) modules.push(current);
  return modules;
}

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const isEditing = !!course;

  const [title, setTitle] = useState(course?.title || "");
  const [slug, setSlug] = useState(course?.slug || "");
  const [category, setCategory] = useState(course?.category || "iniciante");
  const [level, setLevel] = useState(course?.level || "Iniciante");
  const [glyph, setGlyph] = useState(course?.glyph || "📱");
  const [badge, setBadge] = useState(course?.badge || "");
  const [featured, setFeatured] = useState(!!course?.featured);
  const [hours, setHours] = useState(String(course?.hours ?? 0));
  const [format, setFormat] = useState(course?.format || "");
  const [access, setAccess] = useState(course?.access || "");
  const [price, setPrice] = useState(String(course?.price ?? ""));
  const [compareAt, setCompareAt] = useState(
    course?.compareAt != null ? String(course.compareAt) : ""
  );
  const [installments, setInstallments] = useState(course?.installments || "");
  const [boleto, setBoleto] = useState(course?.boleto || "");
  const [deposit, setDeposit] = useState(course?.deposit || "");
  const [priceNote, setPriceNote] = useState(course?.priceNote || "");
  const [link, setLink] = useState(course?.link || "");
  const [summary, setSummary] = useState(course?.summary || "");
  const [forWho, setForWho] = useState(listToLines(course?.forWho));
  const [learns, setLearns] = useState(listToLines(course?.learns));
  const [benefits, setBenefits] = useState(listToLines(course?.benefits));
  const [classesText, setClassesText] = useState(
    classesToText(Array.isArray(course?.classes) ? course?.classes : [])
  );
  const [modulesText, setModulesText] = useState(
    modulesToText(Array.isArray(course?.modules) ? course?.modules : [])
  );
  const [faqText, setFaqText] = useState(
    faqToText(Array.isArray(course?.faq) ? course?.faq : [])
  );
  const [sortOrder, setSortOrder] = useState(String(course?.sortOrder ?? 0));
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(course?.status || "DRAFT");
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
    const priceNum = Number(String(price).replace(",", "."));
    if (!title.trim() || !summary.trim() || !Number.isFinite(priceNum)) {
      alert("Preencha título, resumo e preço.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        category,
        level: level.trim() || "Iniciante",
        glyph: glyph.trim() || "📱",
        badge: badge.trim() || null,
        featured,
        hours: Number(hours) || 0,
        format: format.trim(),
        access: access.trim() || null,
        price: priceNum,
        compareAt: compareAt.trim()
          ? Number(String(compareAt).replace(",", "."))
          : null,
        installments: installments.trim() || null,
        boleto: boleto.trim() || null,
        deposit: deposit.trim() || null,
        priceNote: priceNote.trim() || null,
        link: link.trim() || null,
        summary: summary.trim(),
        forWho: linesToList(forWho),
        learns: linesToList(learns),
        benefits: linesToList(benefits),
        classes: textToClasses(classesText),
        modules: textToModules(modulesText),
        faq: textToFaq(faqText),
        sortOrder: Number(sortOrder) || 0,
        status,
      };
      if (isEditing && course) {
        await updateCourse(token, course.id, payload);
      } else {
        await createCourse(token, payload);
      }
      router.push("/admin/cursos");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const field = "h-11 px-3 rounded-xl border border-[var(--line)] bg-white";
  const area = "min-h-[110px] px-3 py-2 rounded-xl border border-[var(--line)] bg-white";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 max-w-3xl">
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Título</span>
        <input className={field} value={title} onChange={(e) => onTitle(e.target.value)} required />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Slug</span>
          <input
            className={`${field} font-mono text-sm`}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Categoria</span>
          <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
            {COURSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Nível</span>
          <input className={field} value={level} onChange={(e) => setLevel(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Ícone (emoji)</span>
          <input className={field} value={glyph} onChange={(e) => setGlyph(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Badge</span>
          <input className={field} value={badge} onChange={(e) => setBadge(e.target.value)} />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Resumo</span>
        <textarea className={area} value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Formato</span>
          <input className={field} value={format} onChange={(e) => setFormat(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Acesso</span>
          <input className={field} value={access} onChange={(e) => setAccess(e.target.value)} />
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Preço (R$)</span>
          <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Preço de (opcional)</span>
          <input className={field} value={compareAt} onChange={(e) => setCompareAt(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Horas</span>
          <input type="number" className={field} value={hours} onChange={(e) => setHours(e.target.value)} />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Parcelas</span>
          <input className={field} value={installments} onChange={(e) => setInstallments(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Boleto</span>
          <input className={field} value={boleto} onChange={(e) => setBoleto(e.target.value)} />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Reserva / sinal</span>
          <input className={field} value={deposit} onChange={(e) => setDeposit(e.target.value)} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Nota de preço</span>
          <input className={field} value={priceNote} onChange={(e) => setPriceNote(e.target.value)} />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Link de matrícula (Hotmart etc.)</span>
        <input className={field} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
      </label>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Status</span>
          <select
            className={field}
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">Ordem</span>
          <input type="number" className={field} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </label>
        <label className="flex items-center gap-2 pt-7">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <span className="text-sm font-semibold">Destaque na home</span>
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Para quem (1 item por linha)</span>
        <textarea className={area} value={forWho} onChange={(e) => setForWho(e.target.value)} />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">O que aprende (1 item por linha)</span>
        <textarea className={area} value={learns} onChange={(e) => setLearns(e.target.value)} />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Benefícios (1 item por linha)</span>
        <textarea className={area} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Turmas (periodo | dias | horario | data)</span>
        <textarea
          className={area}
          value={classesText}
          onChange={(e) => setClassesText(e.target.value)}
          placeholder="Integral | Segunda a sexta, 5 dias | 08:45 às 17:45 | 17/08/2026"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">Módulos (# título, depois 1 aula por linha)</span>
        <textarea
          className={`${area} min-h-[140px]`}
          value={modulesText}
          onChange={(e) => setModulesText(e.target.value)}
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">FAQ (pergunta | resposta)</span>
        <textarea
          className={`${area} min-h-[140px]`}
          value={faqText}
          onChange={(e) => setFaqText(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="h-11 px-5 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Save size={16} />
        {saving ? "Salvando…" : isEditing ? "Salvar alterações" : "Criar curso"}
      </button>
    </form>
  );
}
