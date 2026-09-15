"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload } from "lucide-react";
import {
  Product,
  TOKEN_KEY,
  createProduct,
  updateProduct,
  uploadImage,
} from "@/lib/api";

const CATEGORIES = ["Ferramentas", "Kits", "Peças", "Equipamentos", "Geral"];

function slugFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [compareAt, setCompareAt] = useState(
    product?.compareAt != null ? String(product.compareAt) : ""
  );
  const [image, setImage] = useState(product?.image || "");
  const [category, setCategory] = useState(product?.category || "Ferramentas");
  const [featured, setFeatured] = useState(!!product?.featured);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(product?.status || "DRAFT");
  const [buttonLabel, setButtonLabel] = useState(product?.buttonLabel || "Quero este produto");
  const [buttonUrl, setButtonUrl] = useState(product?.buttonUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEditing);

  const onName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugFromName(value));
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setUploading(true);
    try {
      setImage(await uploadImage(token, file));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  const save = async (nextStatus: "DRAFT" | "PUBLISHED") => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push("/admin/login");
      return;
    }
    const priceNum = Number(String(price).replace(",", "."));
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      alert("Informe um preço válido");
      return;
    }
    setSaving(true);
    const payload = {
      name,
      slug: slug || undefined,
      description,
      price: priceNum,
      compareAt: compareAt ? Number(String(compareAt).replace(",", ".")) : null,
      image: image || null,
      category,
      featured,
      status: nextStatus,
      buttonLabel,
      buttonUrl: buttonUrl || null,
    };
    try {
      if (isEditing && product) await updateProduct(token, product.id, payload);
      else await createProduct(token, payload);
      router.push("/admin/produtos");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <label className="block text-sm font-semibold">Nome</label>
          <input
            className="w-full h-12 rounded-xl border border-[var(--line)] px-3 text-lg font-semibold outline-none focus:border-[var(--brand)]"
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Ex.: Kit básico de ferramentas"
            required
          />
          <label className="block text-sm font-semibold">Descrição</label>
          <textarea
            className="w-full min-h-[160px] rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--brand)]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes do produto, o que acompanha, para quem é indicado..."
            required
          />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">Publicação</h3>
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
            Destacar na vitrine
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("PUBLISHED")}
            className="w-full h-10 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Salvando…" : "Publicar"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("DRAFT")}
            className="w-full h-10 rounded-xl border border-[var(--line)] font-semibold"
          >
            Salvar rascunho
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">Preço e link</h3>
          <label className="block text-sm font-semibold">Preço (R$)</label>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="199.90"
          />
          <label className="block text-sm font-semibold">De (opcional)</label>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={compareAt}
            onChange={(e) => setCompareAt(e.target.value)}
            placeholder="249.90"
          />
          <label className="block text-sm font-semibold">Texto do botão</label>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
          />
          <label className="block text-sm font-semibold">URL do botão (WhatsApp/pagamento)</label>
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            placeholder="https://wa.me/..."
          />
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
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-bold">Imagem</h3>
          <label className="h-10 rounded-xl border border-dashed border-[var(--line)] flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold">
            <Upload size={16} />
            {uploading ? "Enviando…" : "Enviar imagem"}
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full rounded-xl border border-[var(--line)]" />
          ) : null}
          <input
            className="w-full h-10 rounded-xl border border-[var(--line)] px-3 text-sm"
            placeholder="ou cole a URL"
            value={image || ""}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
      </aside>
    </div>
  );
}
