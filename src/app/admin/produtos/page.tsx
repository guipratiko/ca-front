"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Pencil, Trash2, Package, FileText } from "lucide-react";
import {
  Product,
  TOKEN_KEY,
  deleteProduct,
  formatBRL,
  listAdminProducts,
} from "@/lib/api";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    listAdminProducts(token)
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  };

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      await deleteProduct(token, id);
      setProducts((list) => list.filter((p) => p.id !== id));
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
              CA Cursos
            </p>
            <h1 className="text-lg font-extrabold leading-tight">Produtos</h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <FileText size={16} /> Artigos
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="h-10 px-4 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center gap-2"
          >
            <Plus size={16} /> Novo produto
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

      <div className="max-w-6xl mx-auto px-5 py-8">
        {loading ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}

        {!loading && !products.length ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
            <Package className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="font-semibold mb-2">Nenhum produto ainda</p>
            <Link href="/admin/produtos/novo" className="text-[var(--brand-700)] font-bold">
              Cadastrar o primeiro →
            </Link>
          </div>
        ) : null}

        <div className="grid gap-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5 flex flex-wrap gap-3 items-center shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--bg)] border border-[var(--line)] overflow-hidden grid place-items-center">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Package size={20} className="text-[var(--muted)]" />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-sm text-[var(--muted)] line-clamp-1">{p.description}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {formatBRL(p.price)} · {p.category} ·{" "}
                  {p.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  {p.featured ? " · Destaque" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/produtos/${p.id}`}
                  className="h-9 px-3 rounded-lg border border-[var(--line)] inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  <Pencil size={14} /> Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(p.id, p.name)}
                  className="h-9 px-3 rounded-lg border border-red-200 text-red-600 inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
