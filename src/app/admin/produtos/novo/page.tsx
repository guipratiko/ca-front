"use client";

import Link from "next/link";
import { ProductForm } from "@/components/product-form";
import { AdminNav } from "@/components/admin-nav";

export default function NewProductPage() {
  return (
    <main className="min-h-screen">
      <AdminNav
        title="Novo produto"
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
        <ProductForm />
      </div>
    </main>
  );
}
