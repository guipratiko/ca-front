"use client";

import Link from "next/link";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3">
          <div className="flex-1">
            <Link href="/admin/produtos" className="text-sm text-[var(--brand-700)] font-semibold">
              ← Voltar
            </Link>
            <h1 className="text-lg font-extrabold">Novo produto</h1>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-5 py-6">
        <ProductForm />
      </div>
    </main>
  );
}
