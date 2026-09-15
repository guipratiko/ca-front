import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CA Tools · Produtos | CA Cursos",
  description:
    "Vitrine CA Tools: kits, ferramentas e itens selecionados para manutenção de celulares.",
  robots: { index: true, follow: true },
};

export default function ProdutosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* CSS do site estático  -  mesmo design system da home */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/assets/css/style.css?v=20260915p" />
      {children}
    </>
  );
}
