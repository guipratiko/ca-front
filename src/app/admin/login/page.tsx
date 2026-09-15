"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, TOKEN_KEY } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@cacursos.com.br");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) router.replace("/admin/dashboard");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminLogin(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,106,0,.18),transparent),linear-gradient(180deg,#0a0a0d,#171922)]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/30"
      >
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-[var(--brand)] mb-3">
          CA Cursos
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Admin do blog</h1>
        <p className="text-sm text-[var(--muted)] mb-7">
          Entre para criar, editar e publicar artigos.
        </p>

        <label className="block text-sm font-semibold mb-1.5">E-mail</label>
        <input
          className="w-full h-11 rounded-xl border border-[var(--line)] px-3 mb-4 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(255,106,0,.2)]"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm font-semibold mb-1.5">Senha</label>
        <input
          className="w-full h-11 rounded-xl border border-[var(--line)] px-3 mb-4 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(255,106,0,.2)]"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error ? (
          <p className="text-sm text-red-600 mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-700)] text-white font-bold transition disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
