"use client";

import { useEffect, useState } from "react";
import { productsWhatsAppUrl } from "@/lib/api";

const THEME_KEY = "ca-theme";

function MoonIcon() {
  return (
    <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function SiteChrome({
  children,
  active = "produtos",
  brand = "cacursos",
}: {
  children: React.ReactNode;
  active?: "inicio" | "cursos" | "produtos" | "aulas" | "blog" | "sobre" | "contato";
  brand?: "cacursos" | "catools";
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const year = new Date().getFullYear();
  const isTools = brand === "catools";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    try {
      if (localStorage.getItem(THEME_KEY) === "dark") root.setAttribute("data-theme", "dark");
      else root.setAttribute("data-theme", "light");
    } catch {
      root.setAttribute("data-theme", "light");
    }

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const nav = [
    { id: "inicio", href: "/index.html", label: "Início" },
    { id: "cursos", href: "/cursos.html", label: "Cursos" },
    { id: "produtos", href: "/produtos", label: "Produtos" },
    { id: "aulas", href: "/aulas.html", label: "Aulas grátis" },
    { id: "blog", href: "/blog.html", label: "Blog" },
    { id: "sobre", href: "/sobre.html", label: "Sobre" },
    { id: "contato", href: "/contato.html", label: "Contato" },
  ] as const;

  const logo = isTools ? (
    <a className="logo logo--tools" href="/produtos" aria-label="CA Tools, vitrine de produtos">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo__img logo__img--tools" src="/assets/img/logo-ca-tools.png" alt="CA Tools" />
    </a>
  ) : (
    <a className="logo" href="/index.html" aria-label="CA Cursos, página inicial">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo__img logo__img--dark" src="/assets/img/logo-ca-cursos.png" alt="CA Cursos" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo__img logo__img--light" src="/assets/img/logo-ca-cursos-light.png" alt="" aria-hidden="true" />
    </a>
  );

  return (
    <div className={`ca-site${isTools ? " ca-site--tools" : ""}`}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header__inner">
          {logo}
          <nav className="nav">
            {nav.map((item) => (
              <a key={item.id} href={item.href} className={active === item.id ? "is-active" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header__actions">
            <a className="btn btn--ghost btn--sm" href="/aulas.html">
              Assistir grátis
            </a>
            <a className="btn btn--primary btn--sm" href={isTools ? "/produtos" : "/cursos.html"}>
              {isTools ? "Ver produtos" : "Ver cursos"}
            </a>
            <button className="theme-toggle" type="button" aria-label="Alternar tema" title="Alternar tema" onClick={toggleTheme}>
              <MoonIcon />
              <SunIcon />
            </button>
            <button
              className={`burger${menuOpen ? " is-open" : ""}`}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className={`mobile-nav${menuOpen ? " is-open" : ""}`}>
        {nav.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={active === item.id ? "is-active" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a className="btn btn--primary" href={isTools ? "/produtos" : "/cursos.html"}>
          {isTools ? "Ver produtos" : "Ver cursos"}
        </a>
      </nav>

      <main id="conteudo">{children}</main>

      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              {isTools ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="logo__img logo__img--tools logo__img--tools-footer" src="/assets/img/logo-ca-tools.png" alt="CA Tools" />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="logo__img logo__img--dark" src="/assets/img/logo-ca-cursos.png" alt="CA Cursos" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="logo__img logo__img--light" src="/assets/img/logo-ca-cursos-light.png" alt="" aria-hidden="true" />
                </>
              )}
              <p>
                {isTools
                  ? "Linha de produtos e ferramentas CA Tools para a bancada de manutenção de celulares."
                  : "Escola especializada em formação profissional na área de manutenção de celulares."}
              </p>
            </div>
            <div>
              <h5>Navegação</h5>
              <a href="/cursos.html">Cursos</a>
              <a href="/produtos">Produtos</a>
              <a href="/blog.html">Blog</a>
              <a href="/contato.html">Contato</a>
            </div>
            <div>
              <h5>WhatsApp</h5>
              <p style={{ fontSize: ".9rem", marginBottom: 14 }}>Rua 2, 115, Goiânia, 74013-020, GO, BR.</p>
              <a
                className="btn btn--wa"
                href={isTools ? productsWhatsAppUrl() : "https://wa.me/5562984002318"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {year} {isTools ? "CA Tools" : "CA Cursos"}. Todos os direitos reservados.</span>
            <span>
              <a href="https://www.cacursos.com.br/">cacursos.com.br</a>
            </span>
          </div>
        </div>
      </footer>

      <a
        className="wa-float"
        href={
          isTools
            ? productsWhatsAppUrl()
            : "https://wa.me/5562984002318?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20CA%20Cursos%20e%20quero%20falar%20sobre%20produtos."
        }
        aria-label="Falar no WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.6.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      </a>
    </div>
  );
}
