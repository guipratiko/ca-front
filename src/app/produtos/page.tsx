"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatBRL, listPublicProducts, Product } from "@/lib/api";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listPublicProducts()
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0a0a0d_0%,#14161d_40%,#0a0a0d_100%)] text-white">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-4">
          <Link href="/index.html" className="font-extrabold tracking-tight text-lg">
            CA Cursos
          </Link>
          <nav className="ml-auto flex items-center gap-4 text-sm font-semibold text-white/75">
            <Link href="/cursos.html" className="hover:text-white">
              Cursos
            </Link>
            <Link href="/produtos" className="text-[var(--brand)]">
              Produtos
            </Link>
            <Link href="/blog.html" className="hover:text-white">
              Blog
            </Link>
            <Link href="/contato.html" className="hover:text-white">
              Contato
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 py-14">
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-[var(--brand)] mb-3">
          Vitrine
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Produtos para a bancada
        </h1>
        <p className="text-white/65 max-w-2xl mb-10">
          Kits, ferramentas e itens selecionados para quem está começando ou evoluindo na
          manutenção de celulares.
        </p>

        {loading ? <p className="text-white/60">Carregando produtos…</p> : null}
        {error ? <p className="text-red-300">{error}</p> : null}

        {!loading && !products.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
            Em breve novos produtos por aqui.
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-white/5 border-b border-white/10">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/30 text-sm">
                    Sem imagem
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
                    {p.category}
                  </span>
                  {p.featured ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-[rgba(255,106,0,.15)] text-[var(--brand)]">
                      Destaque
                    </span>
                  ) : null}
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">{p.name}</h2>
                <p className="text-sm text-white/65 line-clamp-3 flex-1">{p.description}</p>
                <div className="flex items-baseline gap-2">
                  <strong className="text-2xl font-extrabold">{formatBRL(p.price)}</strong>
                  {p.compareAt && p.compareAt > p.price ? (
                    <s className="text-sm text-white/40">{formatBRL(p.compareAt)}</s>
                  ) : null}
                </div>
                <a
                  href={p.buttonUrl || "/contato.html"}
                  target={p.buttonUrl ? "_blank" : undefined}
                  rel={p.buttonUrl ? "noopener noreferrer" : undefined}
                  className="h-11 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-700)] text-white font-bold inline-flex items-center justify-center transition"
                >
                  {p.buttonLabel || "Quero este produto"}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
