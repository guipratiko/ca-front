"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Save,
  Upload,
  Layout,
  FileText,
  GraduationCap,
  Package,
  Video,
  Tags,
} from "lucide-react";
import {
  HomeHeroSettings,
  ProductsBannerSettings,
  TOKEN_KEY,
  getAdminSettings,
  productsWhatsAppUrl,
  updateHomeHero,
  updateProductsBanner,
  uploadImage,
} from "@/lib/api";

const emptyProof = [
  { label: "", detail: "" },
  { label: "", detail: "" },
  { label: "", detail: "" },
  { label: "", detail: "" },
];

export default function AdminContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingHero, setSavingHero] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [hero, setHero] = useState<HomeHeroSettings | null>(null);
  const [banner, setBanner] = useState<ProductsBannerSettings | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    getAdminSettings(token)
      .then((data) => {
        setHero({
          ...data.homeHero,
          proof: data.homeHero.proof?.length ? data.homeHero.proof : emptyProof,
        });
        setBanner(data.productsBanner);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  };

  const field = "h-11 px-3 rounded-xl border border-[var(--line)] bg-white w-full";
  const area = "min-h-[90px] px-3 py-2 rounded-xl border border-[var(--line)] bg-white w-full";

  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setSavingHero(true);
    try {
      const proof = hero.proof.filter((p) => p.label.trim() && p.detail.trim());
      if (!proof.length) {
        alert("Preencha pelo menos um item de prova.");
        return;
      }
      const { homeHero } = await updateHomeHero(token, { ...hero, proof });
      setHero(homeHero);
      alert("Hero da home salvo.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSavingHero(false);
    }
  };

  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setSavingBanner(true);
    try {
      const { productsBanner } = await updateProductsBanner(token, banner);
      setBanner(productsBanner);
      alert("Banner de produtos salvo.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSavingBanner(false);
    }
  };

  const onUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !banner) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setUploading(true);
    try {
      const url = await uploadImage(token, file);
      setBanner({ ...banner, imageUrl: url });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand)]">
              CA Cursos
            </p>
            <h1 className="text-lg font-extrabold leading-tight">Conteúdo do site</h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <FileText size={16} /> Artigos
          </Link>
          <Link
            href="/admin/cursos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <GraduationCap size={16} /> Cursos
          </Link>
          <Link
            href="/admin/produtos"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Package size={16} /> Produtos
          </Link>
          <Link
            href="/admin/aulas"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Video size={16} /> Aulas
          </Link>
          <Link
            href="/admin/categorias"
            className="h-10 px-3 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm"
          >
            <Tags size={16} /> Categorias
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

      <div className="max-w-6xl mx-auto px-5 py-8 grid gap-10">
        {loading ? <p className="text-[var(--muted)]">Carregando…</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}

        {hero ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Layout size={18} className="text-[var(--brand)]" />
              <h2 className="text-lg font-extrabold">Hero da página Início</h2>
            </div>
            <form onSubmit={saveHero} className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Eyebrow</span>
                <input
                  className={field}
                  value={hero.eyebrow}
                  onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                  required
                />
              </label>

              <div className="grid sm:grid-cols-3 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Título (antes)</span>
                  <input
                    className={field}
                    value={hero.titleBefore}
                    onChange={(e) => setHero({ ...hero, titleBefore: e.target.value })}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Destaque</span>
                  <input
                    className={field}
                    value={hero.titleHighlight}
                    onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Título (depois)</span>
                  <input
                    className={field}
                    value={hero.titleAfter}
                    onChange={(e) => setHero({ ...hero, titleAfter: e.target.value })}
                  />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Parágrafo</span>
                <textarea
                  className={area}
                  value={hero.lead}
                  onChange={(e) => setHero({ ...hero, lead: e.target.value })}
                  required
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Botão principal · texto</span>
                  <input
                    className={field}
                    value={hero.primaryCtaLabel}
                    onChange={(e) => setHero({ ...hero, primaryCtaLabel: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Botão principal · link</span>
                  <input
                    className={field}
                    value={hero.primaryCtaHref}
                    onChange={(e) => setHero({ ...hero, primaryCtaHref: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Botão secundário · texto</span>
                  <input
                    className={field}
                    value={hero.secondaryCtaLabel}
                    onChange={(e) => setHero({ ...hero, secondaryCtaLabel: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Botão secundário · link</span>
                  <input
                    className={field}
                    value={hero.secondaryCtaHref}
                    onChange={(e) => setHero({ ...hero, secondaryCtaHref: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <p className="text-sm font-semibold">Itens de prova (4)</p>
                {hero.proof.map((item, idx) => (
                  <div key={idx} className="grid sm:grid-cols-2 gap-3">
                    <input
                      className={field}
                      placeholder="Título (ex: Presencial)"
                      value={item.label}
                      onChange={(e) => {
                        const proof = [...hero.proof];
                        proof[idx] = { ...proof[idx], label: e.target.value };
                        setHero({ ...hero, proof });
                      }}
                    />
                    <input
                      className={field}
                      placeholder="Detalhe (ex: bancada individual)"
                      value={item.detail}
                      onChange={(e) => {
                        const proof = [...hero.proof];
                        proof[idx] = { ...proof[idx], detail: e.target.value };
                        setHero({ ...hero, proof });
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={savingHero}
                className="h-11 px-5 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60 w-fit"
              >
                <Save size={16} />
                {savingHero ? "Salvando…" : "Salvar hero da home"}
              </button>
            </form>
          </section>
        ) : null}

        {banner ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Package size={18} className="text-[var(--brand)]" />
              <h2 className="text-lg font-extrabold">Banner da página Produtos</h2>
            </div>
            <form onSubmit={saveBanner} className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-semibold">Imagem de fundo do banner</span>
                {banner.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.imageUrl}
                    alt=""
                    className="w-full max-w-xl h-40 object-cover rounded-xl border border-[var(--line)]"
                  />
                ) : (
                  <p className="text-sm text-[var(--muted)]">Sem imagem (usa o gradiente padrão).</p>
                )}
                <div className="flex flex-wrap gap-2 items-center">
                  <label className="h-10 px-4 rounded-xl border border-[var(--line)] font-semibold inline-flex items-center gap-2 text-sm cursor-pointer">
                    <Upload size={16} />
                    {uploading ? "Enviando…" : "Enviar imagem"}
                    <input type="file" accept="image/*" className="hidden" onChange={onUploadBanner} />
                  </label>
                  {banner.imageUrl ? (
                    <button
                      type="button"
                      className="h-10 px-4 rounded-xl border border-red-200 text-red-700 font-semibold text-sm"
                      onClick={() => setBanner({ ...banner, imageUrl: "" })}
                    >
                      Remover imagem
                    </button>
                  ) : null}
                </div>
                <input
                  className={field}
                  placeholder="Ou cole a URL da imagem"
                  value={banner.imageUrl || ""}
                  onChange={(e) => setBanner({ ...banner, imageUrl: e.target.value })}
                />
              </div>

              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Eyebrow</span>
                <input
                  className={field}
                  value={banner.eyebrow}
                  onChange={(e) => setBanner({ ...banner, eyebrow: e.target.value })}
                  required
                />
              </label>

              <div className="grid sm:grid-cols-3 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Título (antes)</span>
                  <input
                    className={field}
                    value={banner.titleBefore}
                    onChange={(e) => setBanner({ ...banner, titleBefore: e.target.value })}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Destaque</span>
                  <input
                    className={field}
                    value={banner.titleHighlight}
                    onChange={(e) => setBanner({ ...banner, titleHighlight: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Título (depois)</span>
                  <input
                    className={field}
                    value={banner.titleAfter || ""}
                    onChange={(e) => setBanner({ ...banner, titleAfter: e.target.value })}
                  />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Parágrafo</span>
                <textarea
                  className={area}
                  value={banner.lead}
                  onChange={(e) => setBanner({ ...banner, lead: e.target.value })}
                  required
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Botão principal · texto</span>
                  <input
                    className={field}
                    value={banner.primaryCtaLabel}
                    onChange={(e) => setBanner({ ...banner, primaryCtaLabel: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold">Botão principal · link</span>
                  <input
                    className={field}
                    value={banner.primaryCtaHref}
                    onChange={(e) => setBanner({ ...banner, primaryCtaHref: e.target.value })}
                    required
                  />
                </label>
                <label className="grid gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold">Botão secundário · texto (WhatsApp)</span>
                  <input
                    className={field}
                    value={banner.secondaryCtaLabel}
                    onChange={(e) => setBanner({ ...banner, secondaryCtaLabel: e.target.value })}
                    required
                  />
                  <span className="text-xs text-[var(--muted)]">
                    O link do WhatsApp continua sendo o da vitrine ({productsWhatsAppUrl().slice(0, 40)}…).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={savingBanner}
                className="h-11 px-5 rounded-xl bg-[var(--brand)] text-white font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60 w-fit"
              >
                <Save size={16} />
                {savingBanner ? "Salvando…" : "Salvar banner de produtos"}
              </button>
            </form>
          </section>
        ) : null}
      </div>
    </main>
  );
}
