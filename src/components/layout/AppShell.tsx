/** Shell da aplicação: sidebar, topo com busca global, drawer e barra inferior. */
import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/format';
import { BOTTOM_NAV, NAV_GROUPS } from '@/navigation';
import { IconMenu, IconSearch, IconX } from '@/components/ui/icons';

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="OBSERVA — página inicial">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm ring-1 ring-white/20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="2.2" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="11" cy="11" r="2" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-[0.14em] text-white">OBSERVA</span>
        {!compact ? (
          <span className="block text-[10px] font-medium tracking-wide text-brand-200">Casimiro de Abreu · RJ</span>
        ) : null}
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Seções do OBSERVA" className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-brand-300/80">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition',
                        isActive
                          ? 'bg-brand-500/15 text-white ring-1 ring-inset ring-brand-400/40'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={17} className={cn('shrink-0', isActive ? 'text-brand-300' : 'text-slate-400')} />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function GlobalSearchForm({ onDone, autoFocus = false }: { onDone?: () => void; autoFocus?: boolean }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = term.trim();
    if (!clean) return;
    navigate(`/busca?q=${encodeURIComponent(clean)}`);
    setTerm('');
    onDone?.();
  };

  return (
    <form onSubmit={submit} role="search" className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <IconSearch size={16} />
      </span>
      <input
        type="search"
        value={term}
        autoFocus={autoFocus}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Buscar em todo o OBSERVA: contratos, obras, escolas…"
        aria-label="Pesquisa global"
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </form>
  );
}

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      {/* Sidebar fixa (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-ink-900 lg:flex">
        <div className="border-b border-white/10 px-4 py-4">
          <Logo />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
          <NavList />
        </div>
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-[10px] leading-relaxed text-slate-400">
            Protótipo demonstrativo. Todos os dados exibidos são fictícios e nenhuma fonte pública está conectada.
          </p>
          <p className="mt-1.5 text-[10px] font-semibold text-brand-300">v0.1 · entrega inicial</p>
        </div>
      </aside>

      {/* Drawer (mobile) */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col bg-ink-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <Logo compact />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Fechar menu"
              >
                <IconX size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <p className="text-[10px] leading-relaxed text-slate-400">
                Dados fictícios de demonstração · nenhuma integração ativa.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        {/* Aviso permanente de dados fictícios */}
        <div className="bg-amber-400/95 px-3 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-amber-950 sm:text-[11px]">
          Protótipo com dados fictícios · não representa a administração municipal
        </div>

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-3 sm:px-4 lg:h-16">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Abrir menu de seções"
            >
              <IconMenu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="OBSERVA — início">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="2.4" />
                  <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[13px] font-bold tracking-[0.12em] text-ink-900">OBSERVA</span>
            </Link>

            <div className="hidden max-w-md flex-1 lg:block">
              <GlobalSearchForm />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/fontes"
                className="hidden rounded-lg border border-slate-300 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700 sm:block"
              >
                Fontes &amp; metodologia
              </Link>
              <span className="hidden rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-bold tracking-wide text-amber-800 ring-1 ring-inset ring-amber-300 sm:block">
                DADOS FICTÍCIOS
              </span>
            </div>
          </div>

          {/* Busca no celular */}
          <div className="px-3 pb-2.5 lg:hidden">
            <GlobalSearchForm />
          </div>
        </header>

        <main id="conteudo" className="mx-auto w-full max-w-6xl px-3 pb-24 pt-4 sm:px-4 sm:pt-5 lg:pb-10">
          <Outlet />
        </main>

        <footer className="mx-auto w-full max-w-6xl px-3 pb-24 text-[11px] leading-relaxed text-slate-500 sm:px-4 lg:pb-8">
          <div className="border-t border-slate-200 pt-3">
            <p>
              <strong className="font-semibold text-slate-700">OBSERVA</strong> · plataforma cívica de transparência e
              fiscalização pública de Casimiro de Abreu/RJ — versão demonstrativa.
            </p>
            <p className="mt-1">
              Todos os dados são fictícios e gerados para teste de interface. Nenhuma base oficial está conectada. Este
              projeto não produz conclusões de irregularidade: ele apenas organiza informação para verificação humana.
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link to="/fontes" className="font-medium text-brand-700 hover:underline">
                Fontes e metodologia
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/relatorios" className="font-medium text-brand-700 hover:underline">
                Relatórios
              </Link>
              <span aria-hidden="true">·</span>
              <span>Dados demonstrativos · v0.1</span>
            </p>
          </div>
        </footer>
      </div>

      {/* Barra inferior (mobile) */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition',
                      isActive ? 'text-brand-700' : 'text-slate-500',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          'flex size-8 items-center justify-center rounded-lg',
                          isActive && 'bg-brand-50',
                        )}
                      >
                        <Icon size={19} />
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex w-full flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-slate-500"
              aria-label="Abrir todas as seções"
            >
              <span className="flex size-8 items-center justify-center rounded-lg">
                <IconMenu size={19} />
              </span>
              Menu
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
