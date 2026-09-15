"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Pencil, Trash2, Package, FileText, Tags } from "lucide-react";
import {
  Category,
  TOKEN_KEY,
  createCategory,
  deleteCategory,
  listAdminCategories,
  updateCategory,
} from "@/lib/api";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const data = await listAdminCategories(token);
      setCategories(data.categories || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  };

  const onCreate = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !name.trim()) return;
    setSaving(true);
    try {
      await createCategory(token, { name: name.trim() });
      setName("");
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar");
    } finally {
      setSaving(false);
    }
  };

  const onSaveEdit = async (id: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !editName.trim()) return;
    setSaving(true);
    try {
      await updateCategory(token, id, { name: editName.trim() });
      setEditingId(null);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const onToggleActive = async (c: Category) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      await updateCategory(token, c.id, { active: !c.active });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  };

  const onDelete = async (c: Category) => {
    if (
      !confirm(
        `Excluir a categoria "${c.name}"?${
          c._count?.products ? `\n${c._count.products} produto(s) ficarão sem vínculo.` : ""
        }`
      )
    ) {
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      await deleteCategory(token, c.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand)]">
              CA Tools
            </p>
            <h1 className="text-lg font-extrabold leading-tight">Categorias</h1>
          </div>
          <Link
            href="/admin/produtos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Package size={16} /> Produtos
          </Link>
          <Link
            href="/admin/dashboard"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <FileText size={16} /> Artigos
          </Link>
          <button
            type="button"
            onClick={logout}
            className="h-10 w-10 rounded-xl border border-[var(--line)] inline-grid place-items-center"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm space-y-3">
          <h2 className="font-bold flex items-center gap-2">
            <Tags size={18} /> Nova categoria
          </h2>
          <div className="flex gap-2">
            <input
              className="flex-1 h-11 rounded-xl border border-[var(--line)] px-3 outline-none focus:border-[var(--brand)]"
              placeholder="Ex.: Ferramentas, Kits, Peças…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCreate();
              }}
            />
            <button
              type="button"
              disabled={saving || !name.trim()}
              onClick={onCreate}
              className="h-11 px-4 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Plus size={16} /> Criar
            </button>
          </div>
        </div>

        {loading ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}

        <div className="grid gap-3">
          {categories.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 flex flex-wrap gap-3 items-center shadow-sm"
            >
              <div className="flex-1 min-w-[200px]">
                {editingId === c.id ? (
                  <input
                    className="w-full h-10 rounded-xl border border-[var(--line)] px-3"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <h2 className="font-bold">{c.name}</h2>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      slug: {c.slug} · {c._count?.products ?? 0} produto(s) ·{" "}
                      {c.active ? "Ativa" : "Inativa"}
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {editingId === c.id ? (
                  <>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => onSaveEdit(c.id)}
                      className="h-9 px-3 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="h-9 px-3 rounded-lg border border-[var(--line)] text-sm font-semibold"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditName(c.name);
                      }}
                      className="h-9 px-3 rounded-lg border border-[var(--line)] inline-flex items-center gap-1.5 text-sm font-semibold"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleActive(c)}
                      className="h-9 px-3 rounded-lg border border-[var(--line)] text-sm font-semibold"
                    >
                      {c.active ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c)}
                      className="h-9 px-3 rounded-lg border border-red-200 text-red-600 inline-flex items-center gap-1.5 text-sm font-semibold"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
          {!loading && !categories.length ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center text-[var(--muted)]">
              Nenhuma categoria ainda. Crie a primeira acima.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
