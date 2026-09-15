import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  ExternalLink,
  FileText,
  Globe2,
  KeyRound,
  Link2,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mis enlaces | Compacto" },
      { name: "description", content: "Crea, organiza y analiza tus enlaces cortos con Compacto." },
      { property: "og:title", content: "Mis enlaces | Compacto" },
      { property: "og:description", content: "Crea, organiza y analiza tus enlaces cortos con Compacto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinksPage,
});

type LinkItem = {
  id: number;
  name: string;
  destination: string;
  short: string;
  tag: string;
  clicks: number;
  status: "Activo" | "Expira pronto" | "Expirado";
};

const initialLinks: LinkItem[] = [
  { id: 1, name: "Lanzamiento de producto", destination: "https://compacto.io/producto/nueva-version", short: "compacto.link/lanzamiento", tag: "Producto", clicks: 2841, status: "Activo" },
  { id: 2, name: "Newsletter de septiembre", destination: "https://compacto.io/blog/newsletter-septiembre", short: "compacto.link/news-sep", tag: "Email", clicks: 1376, status: "Activo" },
  { id: 3, name: "Campaña LinkedIn", destination: "https://compacto.io/recursos/guia-enlaces", short: "compacto.link/linkedin-q3", tag: "Social", clicks: 928, status: "Expira pronto" },
  { id: 4, name: "Documentación API", destination: "https://docs.compacto.io/api/v2/overview", short: "compacto.link/api-docs", tag: "Docs", clicks: 642, status: "Activo" },
  { id: 5, name: "Webinar analítica", destination: "https://compacto.io/eventos/analitica-2026", short: "compacto.link/webinar", tag: "Evento", clicks: 519, status: "Activo" },
  { id: 6, name: "Promoción de verano", destination: "https://compacto.io/precios?promo=summer", short: "compacto.link/verano", tag: "Campaña", clicks: 4108, status: "Expirado" },
  { id: 7, name: "Perfil de soporte", destination: "https://compacto.io/ayuda/contacto", short: "compacto.link/soporte", tag: "Soporte", clicks: 385, status: "Activo" },
  { id: 8, name: "Encuesta de satisfacción", destination: "https://forms.compacto.io/satisfaccion", short: "compacto.link/encuesta", tag: "Feedback", clicks: 214, status: "Expira pronto" },
];

const navItems = ["Panel", "Enlaces", "Campañas", "Dominios", "Conversiones"];

function Logo() {
  return (
    <a href="#main" className="flex items-center gap-2 font-logo text-xl font-bold text-foreground" aria-label="Compacto, inicio">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand-gradient text-primary-foreground shadow-action">
        <Link2 aria-hidden="true" className="h-[18px] w-[18px]" />
      </span>
      compacto<span className="text-primary">°</span>
    </a>
  );
}

function ActionButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return <Button variant="ghost" size="icon" aria-label={label} title={label} onClick={onClick} className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary">{children}</Button>;
}

function LinksPage() {
  const [links, setLinks] = useState(initialLinks);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "contrast">("light");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("contrast", theme === "contrast");
  }, [theme]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return links.filter((item) => [item.name, item.destination, item.short, item.tag].some((value) => value.toLowerCase().includes(term)));
  }, [links, query]);

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const copyLink = async (item: LinkItem) => {
    await navigator.clipboard?.writeText(`https://${item.short}`);
    announce("Enlace copiado al portapapeles");
  };

  const deleteLink = (id: number) => {
    setLinks((current) => current.filter((item) => item.id !== id));
    announce("Enlace eliminado");
  };

  const duplicateLink = (item: LinkItem) => {
    setLinks((current) => [{ ...item, id: Date.now(), name: `${item.name} (copia)`, clicks: 0 }, ...current]);
    announce("Enlace duplicado");
  };

  const createLink = () => {
    setLinks((current) => [{ id: Date.now(), name: "Nuevo enlace", destination: "https://compacto.io", short: `compacto.link/nuevo-${current.length + 1}`, tag: "Sin etiqueta", clicks: 0, status: "Activo" }, ...current]);
    announce("Nuevo enlace creado");
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => { setRefreshing(false); announce("Enlaces actualizados"); }, 650);
  };

  const cycleTheme = () => setTheme((current) => current === "light" ? "dark" : current === "dark" ? "contrast" : "light");
  const ThemeIcon = theme === "light" ? Moon : theme === "dark" ? Sparkles : Sun;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
      <a href="#main" className="skip-link">Saltar al contenido principal</a>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Logo />
          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => <a key={item} href={item === "Enlaces" ? "#main" : "#"} className={`nav-link ${item === "Enlaces" ? "nav-link-active" : ""}`}>{item}</a>)}
          </nav>
          <div className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="icon" aria-label={`Cambiar tema. Actual: ${theme}`} title="Cambiar tema" onClick={cycleTheme}><ThemeIcon aria-hidden="true" /></Button>
            <Button variant="ghost" size="icon" aria-label="Ayuda" title="Ayuda"><CircleHelp aria-hidden="true" /></Button>
            <Button variant="ghost" className="rounded-full px-3"><FileText aria-hidden="true" /> Docs</Button>
            <Button variant="outline" className="ml-1 rounded-full"><UserRound aria-hidden="true" /> Mi cuenta</Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</Button>
        </div>
        {menuOpen && <nav id="mobile-menu" aria-label="Navegación móvil" className="border-t border-border bg-background px-6 py-4 md:hidden">{navItems.map((item) => <a key={item} href={item === "Enlaces" ? "#main" : "#"} className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent" onClick={() => setMenuOpen(false)}>{item}</a>)}<div className="mt-2 flex gap-2 border-t border-border pt-4"><Button variant="outline" className="flex-1" onClick={cycleTheme}><ThemeIcon aria-hidden="true" /> Tema</Button><Button variant="outline" className="flex-1"><UserRound aria-hidden="true" /> Cuenta</Button></div></nav>}
      </header>

      <main id="main" className="pt-16">
        <section className="technical-grid border-b border-border" aria-labelledby="page-title">
          <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-14 md:pb-12 md:pt-16">
            <div className="max-w-2xl animate-rise">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary"><Link2 aria-hidden="true" className="h-3.5 w-3.5" /> Gestión de enlaces</div>
              <h1 id="page-title" className="font-display text-[42px] font-extrabold leading-[1.04] md:text-5xl">Tus enlaces, <span className="text-primary">bajo control.</span></h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">Crea, organiza y consulta el rendimiento de todos tus enlaces cortos desde un solo lugar.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-8 md:py-10" aria-label="Listado de enlaces">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Mis enlaces</h2>
              <p className="mt-1 text-sm text-muted-foreground">{filtered.length} de {links.length} enlaces visibles</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" aria-label="Actualizar enlaces" title="Actualizar enlaces" onClick={refresh}><RefreshCw aria-hidden="true" className={refreshing ? "animate-spin" : ""} /></Button>
              <Button variant="premium" className="flex-1 md:flex-none" onClick={createLink}><Plus aria-hidden="true" /> Nuevo enlace</Button>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, URL o etiqueta..." aria-label="Buscar enlaces" className="h-11 rounded-full bg-card pl-10 pr-10 shadow-card" />
              {query && <Button variant="ghost" size="icon" aria-label="Limpiar búsqueda" onClick={() => setQuery("")} className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2"><X aria-hidden="true" /></Button>}
            </div>
            <Button variant="ghost" className="justify-start text-muted-foreground sm:justify-center">Más recientes <ChevronDown aria-hidden="true" /></Button>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead><tr className="border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"><th className="px-5 py-4">Nombre</th><th className="px-5 py-4">Destino</th><th className="px-5 py-4">Enlace corto</th><th className="px-5 py-4">Etiqueta</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4 text-right">Clics</th><th className="px-5 py-4 text-right">Acciones</th></tr></thead>
                <tbody>{filtered.map((item, index) => <LinkRow key={item.id} item={item} index={index} copyLink={copyLink} duplicateLink={duplicateLink} deleteLink={deleteLink} notify={announce} />)}</tbody>
              </table>
            </div>
            {filtered.length === 0 && <EmptyState />}
          </div>

          <div className="grid gap-4 md:hidden">
            {filtered.map((item, index) => <MobileCard key={item.id} item={item} index={index} copyLink={copyLink} duplicateLink={duplicateLink} deleteLink={deleteLink} notify={announce} />)}
            {filtered.length === 0 && <div className="rounded-2xl border border-border bg-card"><EmptyState /></div>}
          </div>

          {filtered.length > 0 && <nav aria-label="Paginación" className="mt-6 flex items-center justify-between border-t border-border pt-5"><p className="hidden text-sm text-muted-foreground sm:block">Página 1 de 4</p><div className="ml-auto flex items-center gap-1 sm:ml-0"><Button variant="outline" size="icon" disabled aria-label="Página anterior"><ChevronLeft aria-hidden="true" /></Button>{[1,2,3].map((page) => <Button key={page} variant={page === 1 ? "default" : "ghost"} size="icon" aria-current={page === 1 ? "page" : undefined} aria-label={`Página ${page}`}>{page}</Button>)}<Button variant="outline" size="icon" aria-label="Página siguiente"><ChevronRight aria-hidden="true" /></Button></div></nav>}
        </section>
      </main>
      <div aria-live="polite" aria-atomic="true" className={`toast-notice ${notice ? "toast-visible" : ""}`}><Check aria-hidden="true" />{notice}</div>
    </div>
  );
}

function Status({ status }: { status: LinkItem["status"] }) {
  return <span className={`status-badge status-${status === "Activo" ? "active" : status === "Expira pronto" ? "warning" : "expired"}`}><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

type RowProps = { item: LinkItem; index: number; copyLink: (item: LinkItem) => void; duplicateLink: (item: LinkItem) => void; deleteLink: (id: number) => void; notify: (message: string) => void };

function MoreMenu({ item, duplicateLink, deleteLink }: Pick<RowProps, "item" | "duplicateLink" | "deleteLink">) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Más acciones para ${item.name}`} className="h-9 w-9 rounded-lg"><MoreHorizontal aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 rounded-xl"><DropdownMenuItem onSelect={() => duplicateLink(item)}><Copy /> Duplicar</DropdownMenuItem><DropdownMenuItem onSelect={() => window.open(item.destination, "_blank", "noopener,noreferrer")}><ExternalLink /> Abrir destino</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => deleteLink(item.id)}><Trash2 /> Eliminar</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}

function LinkRow({ item, index, copyLink, duplicateLink, deleteLink, notify }: RowProps) {
  return <tr className={`table-row animate-rise delay-${Math.min(index, 7)} border-b border-border/70 last:border-0`}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Globe2 aria-hidden="true" className="h-[18px] w-[18px]" /></span><span className="max-w-[180px] truncate text-sm font-semibold">{item.name}</span></div></td><td className="max-w-[220px] px-5 py-4"><span className="block truncate text-sm text-muted-foreground" title={item.destination}>{item.destination.replace("https://", "")}</span></td><td className="px-5 py-4"><button onClick={() => copyLink(item)} className="group inline-flex items-center gap-2 font-mono text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span>{item.short}</span><Copy aria-hidden="true" className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" /></button></td><td className="px-5 py-4"><span className="tag-badge">{item.tag}</span></td><td className="px-5 py-4"><Status status={item.status} /></td><td className="px-5 py-4 text-right font-mono text-sm font-medium">{item.clicks.toLocaleString("es-CO")}</td><td className="px-5 py-4"><div className="flex justify-end gap-0.5"><ActionButton label={`Copiar ${item.name}`} onClick={() => copyLink(item)}><Copy aria-hidden="true" /></ActionButton><ActionButton label={`Ver QR de ${item.name}`} onClick={() => notify("Código QR listo para compartir")}><QrCode aria-hidden="true" /></ActionButton><MoreMenu item={item} duplicateLink={duplicateLink} deleteLink={deleteLink} /></div></td></tr>;
}

function MobileCard({ item, index, copyLink, duplicateLink, deleteLink }: RowProps) {
  return <article className={`animate-rise delay-${Math.min(index, 7)} rounded-2xl border border-border bg-card p-5 shadow-card`}><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Globe2 aria-hidden="true" className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold">{item.name}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{item.destination.replace("https://", "")}</p></div><MoreMenu item={item} duplicateLink={duplicateLink} deleteLink={deleteLink} /></div><button onClick={() => copyLink(item)} className="mt-4 flex min-h-11 w-full items-center justify-between rounded-xl bg-accent px-3 font-mono text-xs font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="truncate">{item.short}</span><Copy aria-hidden="true" className="ml-2 h-4 w-4 shrink-0" /></button><div className="mt-4 flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="tag-badge">{item.tag}</span><Status status={item.status} /></div><span className="font-mono text-sm font-medium">{item.clicks.toLocaleString("es-CO")} <span className="font-sans text-xs font-normal text-muted-foreground">clics</span></span></div></article>;
}

function EmptyState() {
  return <div className="grid place-items-center px-6 py-16 text-center"><div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><Search aria-hidden="true" className="h-5 w-5" /></div><h3 className="mt-4 font-display text-lg font-semibold">No encontramos enlaces</h3><p className="mt-1 text-sm text-muted-foreground">Prueba con otro nombre, URL o etiqueta.</p></div>;
}
