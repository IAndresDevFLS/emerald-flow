import {
  Check,
  Copy,
  Globe2,
  Link2,
  Lock,
  LockOpen,
  Plus,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type NewLinkPayload = {
  name: string;
  destination: string;
  domain: string;
  tags: string[];
  protected: boolean;
};

const domains = ["compacto.link", "cmp.to", "go.compacto.io", "enlaces.midominio.com"];
const suggestedTags = ["Producto", "Campaña", "Email", "Social", "Docs"];

function SectionTitle({ step, title, hint }: { step: string; title: string; hint: string }) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border bg-secondary font-mono text-[11px] font-bold text-primary">
        {step}
      </span>
      <div>
        <h3 className="font-display text-sm font-bold tracking-tight">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

export function NewLinkDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: NewLinkPayload) => void;
}) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [domain, setDomain] = useState(domains[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [locked, setLocked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const slug = useMemo(() => {
    const base = name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    return base ? base.slice(0, 28) : "tu-enlace";
  }, [name]);

  const mismatch = locked && confirm.length > 0 && password !== confirm;
  const valid = name.trim().length > 1 && /^https?:\/\/.+\..+/.test(destination.trim()) && !mismatch && (!locked || (username.trim() !== "" && password.length >= 4 && password === confirm));

  const addTag = (value: string) => {
    const clean = value.trim().replace(/,$/, "");
    if (!clean || tags.includes(clean) || tags.length >= 6) return;
    setTags((current) => [...current, clean]);
    setTagDraft("");
  };

  const reset = () => {
    setName(""); setDestination(""); setDomain(domains[0]); setTags([]); setTagDraft("");
    setLocked(false); setUsername(""); setPassword(""); setConfirm("");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onCreate({ name: name.trim(), destination: destination.trim(), domain, tags, protected: locked });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) reset(); onOpenChange(next); }}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-[960px] gap-0 overflow-y-auto rounded-2xl border-border bg-card p-0 shadow-card sm:max-w-[960px]"
      >
        <div className="technical-grid relative border-b border-border px-6 py-5 md:px-8">
          <DialogHeader className="pr-12 text-left">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              <Link2 aria-hidden="true" className="h-3.5 w-3.5" /> Nuevo enlace corto
            </div>
            <DialogTitle className="font-display text-2xl font-extrabold leading-tight md:text-[28px]">
              Crea un enlace <span className="text-primary">en segundos.</span>
            </DialogTitle>
            <DialogDescription className="max-w-lg text-sm">
              Define el destino, el dominio de marca y la protección de acceso. Podrás editarlo después.
            </DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Cerrar ventana"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <form onSubmit={submit} className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7 px-6 py-6 md:px-8 md:py-7">
            <section className="space-y-4 animate-rise">
              <SectionTitle step="01" title="Datos del enlace" hint="Nombre interno y dirección de destino." />
              <div className="space-y-2">
                <Label htmlFor="link-name">Nombre</Label>
                <Input id="link-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Lanzamiento de producto" className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-destination">URL de destino</Label>
                <div className="relative">
                  <Globe2 aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="link-destination" type="url" inputMode="url" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="https://midominio.com/pagina" className="h-11 rounded-xl pl-10 font-mono text-sm" required />
                </div>
              </div>
            </section>

            <section className="space-y-4 animate-rise delay-1">
              <SectionTitle step="02" title="Dominio y etiquetas" hint="Elige tu dominio de marca y clasifica el enlace." />
              <div className="space-y-2">
                <Label htmlFor="link-domain">Dominio de marca</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger id="link-domain" className="h-11 w-full rounded-xl font-mono text-sm">
                    <SelectValue placeholder="Selecciona un dominio" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {domains.map((item) => <SelectItem key={item} value={item} className="font-mono text-sm">{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-tags">Etiquetas</Label>
                <div className="rounded-xl border border-border bg-background p-2">
                  {tags.length > 0 && (
                    <ul className="mb-2 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <li key={tag}>
                          <span className="tag-badge gap-1.5 pr-1.5">
                            {tag}
                            <button type="button" aria-label={`Quitar etiqueta ${tag}`} onClick={() => setTags((c) => c.filter((t) => t !== tag))} className="grid h-4 w-4 place-items-center rounded-full text-muted-foreground hover:text-destructive">
                              <X aria-hidden="true" className="h-3 w-3" />
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center gap-2">
                    <Tag aria-hidden="true" className="ml-1.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                      id="link-tags"
                      value={tagDraft}
                      onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagDraft); } }}
                      placeholder="Escribe y pulsa Enter..."
                      className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground">Sugeridas:</span>
                  {suggestedTags.filter((tag) => !tags.includes(tag)).map((tag) => (
                    <button key={tag} type="button" onClick={() => addTag(tag)} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                      <Plus aria-hidden="true" className="h-3 w-3" />{tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4 animate-rise delay-2">
              <SectionTitle step="03" title="Protección con contraseña" hint="Opcional: solicita credenciales antes de redirigir." />
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/60 px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-card text-primary shadow-card">
                    {locked ? <Lock aria-hidden="true" className="h-4 w-4" /> : <LockOpen aria-hidden="true" className="h-4 w-4" />}
                  </span>
                  {locked ? "Enlace protegido" : "Enlace público"}
                </span>
                <Switch checked={locked} onCheckedChange={setLocked} aria-label="Proteger enlace con contraseña" />
              </div>
              {locked && (
                <div className="grid gap-3 rounded-xl border border-border border-dashed p-4 animate-rise sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="link-user">Usuario</Label>
                    <Input id="link-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" placeholder="usuario" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-pass">Contraseña</Label>
                    <Input id="link-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="Mínimo 4 caracteres" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-confirm">Confirmar contraseña</Label>
                    <Input id="link-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" aria-invalid={mismatch} aria-describedby={mismatch ? "pass-error" : undefined} placeholder="Repite la contraseña" className="h-11 rounded-xl" />
                  </div>
                  {mismatch && <p id="pass-error" role="alert" className="text-xs font-medium text-destructive sm:col-span-2">Las contraseñas no coinciden.</p>}
                </div>
              )}
            </section>
          </div>

          <aside className="flex flex-col justify-between gap-6 border-t border-border bg-secondary/50 px-6 py-6 md:border-l md:border-t-0 md:px-7">
            <div className="space-y-4">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Vista previa</p>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow-action">
                    <Link2 aria-hidden="true" className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{name.trim() || "Nombre del enlace"}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{destination.trim().replace(/^https?:\/\//, "") || "midominio.com/pagina"}</p>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-3 py-2.5 font-mono text-xs font-semibold text-primary">
                  <Copy aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{domain}/{slug}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {(tags.length ? tags : ["Sin etiqueta"]).map((tag) => <span key={tag} className="tag-badge">{tag}</span>)}
                  <span className={`status-badge ${locked ? "status-warning" : "status-active"}`}>
                    {locked ? <Lock aria-hidden="true" className="h-3 w-3" /> : <Check aria-hidden="true" className="h-3 w-3" />}
                    {locked ? "Con contraseña" : "Acceso libre"}
                  </span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {["Se genera un código QR automáticamente", "Métricas de clics en tiempo real", "Podrás cambiar el destino sin perder el enlace"].map((item) => (
                  <li key={item} className="flex items-start gap-2"><Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row-reverse">
              <Button type="submit" variant="premium" disabled={!valid} className="w-full sm:w-auto sm:flex-1">
                <Plus aria-hidden="true" /> Crear enlace
              </Button>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancelar</Button>
            </div>
          </aside>
        </form>
      </DialogContent>
    </Dialog>
  );
}
