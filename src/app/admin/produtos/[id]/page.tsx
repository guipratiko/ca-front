"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { AdminNav } from "@/components/admin-nav";
import { Product, TOKEN_KEY, getAdminProduct } from "@/lib/api";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    getAdminProduct(token, params.id)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, [params.id, router]);

  return (
    <main className="min-h-screen">
      <AdminNav
        title="Editar produto"
        active="produtos"
        action={
          <Link
            href="/admin/produtos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center text-sm"
          >
            ← Voltar
          </Link>
        }
      />
      <div className="max-w-6xl mx-auto px-5 py-6">
        {error ? <p className="text-red-600">{error}</p> : null}
        {!product && !error ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {product ? <ProductForm product={product} /> : null}
      </div>
    </main>
  );
}
