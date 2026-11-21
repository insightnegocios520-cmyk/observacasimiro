/** Primitivas de interface reutilizáveis por todas as seções do OBSERVA. */
import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/format';
import { IconAlert, IconInfo } from './icons';

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONE_BADGE: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
};

const TONE_CALLOUT: Record<Tone, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  brand: 'border-brand-200 bg-brand-50 text-brand-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
};

/* --------------------------------- Card ---------------------------------- */

export function Card({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  return (
    <As className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>{children}</As>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 sm:p-5', className)} as="section">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-slate-500 sm:text-[13px]">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

/* -------------------------------- Badges --------------------------------- */

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        TONE_BADGE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Selo obrigatório: identifica que o conteúdo é demonstrativo. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-800 ring-1 ring-inset ring-amber-300',
        className,
      )}
      title="Este conteúdo é fictício e existe apenas para demonstrar a interface."
    >
      DADO FICTÍCIO
    </span>
  );
}

const STATUS_MAP: Record<string, { tone: Tone; label: string }> = {
  vigente: { tone: 'success', label: 'Vigente' },
  encerrado: { tone: 'neutral', label: 'Encerrado' },
  aditado: { tone: 'info', label: 'Com aditivo' },
  suspenso: { tone: 'warning', label: 'Suspenso' },
  publicada: { tone: 'info', label: 'Publicada' },
  'em andamento': { tone: 'brand', label: 'Em andamento' },
  homologada: { tone: 'success', label: 'Homologada' },
  deserta: { tone: 'neutral', label: 'Deserta' },
  revogada: { tone: 'danger', label: 'Revogada' },
  planejamento: { tone: 'neutral', label: 'Planejamento' },
  'em execução': { tone: 'brand', label: 'Em execução' },
  paralisada: { tone: 'danger', label: 'Paralisada' },
  concluída: { tone: 'success', label: 'Concluída' },
  'em funcionamento': { tone: 'success', label: 'Em funcionamento' },
  reforma: { tone: 'warning', label: 'Em reforma' },
  ampliação: { tone: 'info', label: 'Em ampliação' },
  aberto: { tone: 'warning', label: 'Aberto' },
  'em verificação': { tone: 'info', label: 'Em verificação' },
  alta: { tone: 'danger', label: 'Severidade alta' },
  média: { tone: 'warning', label: 'Severidade média' },
  baixa: { tone: 'neutral', label: 'Severidade baixa' },
  operando: { tone: 'success', label: 'Operando' },
  parcial: { tone: 'warning', label: 'Parcial' },
  'em implantação': { tone: 'info', label: 'Em implantação' },
  planejado: { tone: 'neutral', label: 'Planejado' },
  'não conectado': { tone: 'danger', label: 'Não conectado' },
  'em avaliação': { tone: 'info', label: 'Em avaliação' },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_MAP[status] ?? { tone: 'neutral' as Tone, label: status };
  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}

/* -------------------------------- Callout -------------------------------- */

export function Callout({
  tone = 'info',
  title,
  children,
  icon,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  const FallbackIcon = tone === 'warning' || tone === 'danger' ? IconAlert : IconInfo;
  return (
    <div className={cn('flex gap-3 rounded-xl border p-3 text-[13px] sm:p-4', TONE_CALLOUT[tone], className)}>
      <span className="mt-0.5 shrink-0">{icon ?? <FallbackIcon size={18} />}</span>
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && 'mt-0.5', 'leading-relaxed opacity-90')}>{children}</div> : null}
      </div>
    </div>
  );
}

/** Aviso padrão de dados fictícios usado no topo de cada seção de dados. */
export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <Callout tone="warning" title="Conteúdo demonstrativo">
      {children ?? (
        <>
          Todos os números, nomes de empresas, unidades e documentos desta seção são <strong>fictícios</strong>,
          gerados para validar a interface. Nenhuma fonte pública está conectada nesta versão e nada aqui deve ser
          usado como informação sobre a administração municipal.
        </>
      )}
    </Callout>
  );
}

/* -------------------------------- StatCard -------------------------------- */

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'brand',
  demo = true,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: Tone;
  demo?: boolean;
}) {
  return (
    <Card className="p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon ? (
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-lg',
              tone === 'brand' && 'bg-brand-50 text-brand-700',
              tone === 'success' && 'bg-emerald-50 text-emerald-700',
              tone === 'warning' && 'bg-amber-50 text-amber-700',
              tone === 'danger' && 'bg-rose-50 text-rose-700',
              tone === 'info' && 'bg-sky-50 text-sky-700',
              tone === 'neutral' && 'bg-slate-100 text-slate-600',
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900 tabular sm:text-2xl">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {hint ? <p className="text-[11px] text-slate-500">{hint}</p> : null}
        {demo ? <DemoBadge className="ml-auto" /> : null}
      </div>
    </Card>
  );
}

/* ------------------------------- Progress -------------------------------- */

export function ProgressBar({
  value,
  tone,
  label,
}: {
  value: number;
  tone?: Tone;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const auto: Tone = clamped >= 100 ? 'success' : clamped >= 50 ? 'brand' : clamped > 0 ? 'warning' : 'neutral';
  const resolved = tone ?? auto;
  const fill =
    resolved === 'success'
      ? 'bg-emerald-500'
      : resolved === 'warning'
        ? 'bg-amber-500'
        : resolved === 'danger'
          ? 'bg-rose-500'
          : resolved === 'info'
            ? 'bg-sky-500'
            : resolved === 'neutral'
              ? 'bg-slate-400'
              : 'bg-brand-600';

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progresso'}
    >
      <div className={cn('h-full rounded-full transition-all', fill)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/* ------------------------------- EmptyState ------------------------------- */

export function EmptyState({
  title = 'Nenhum resultado',
  description = 'Ajuste a pesquisa ou limpe os filtros para ver outros registros.',
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-10 text-center">
      <span className="text-slate-400">{icon ?? <IconInfo size={26} />}</span>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="max-w-sm text-xs text-slate-500">{description}</p>
      {action}
    </div>
  );
}

/* ------------------------------- PageHeader ------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <header className="mb-4 sm:mb-5">
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 hidden size-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm sm:flex">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-slate-600 sm:text-sm">{description}</p>
        </div>
      </div>
      {actions ? <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/* ------------------------------ Detail rows ------------------------------- */

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
      <dt className="shrink-0 text-xs text-slate-500">{label}</dt>
      <dd className="text-right text-[13px] font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export function KeyValueGrid({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
      {items.map((item) => (
        <InfoRow key={item.label} label={item.label} value={item.value} />
      ))}
    </dl>
  );
}

/* --------------------------------- LinkCard ------------------------------- */

export function ActionCard({
  to,
  title,
  description,
  icon,
  badge,
  LinkComponent,
}: {
  to: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  LinkComponent: ComponentType<{ to: string; className?: string; children: ReactNode }>;
}) {
  const Icon = icon;
  return (
    <LinkComponent
      to={to}
      className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-sm"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-slate-900">{title}</span>
          {badge ? <Badge tone="brand">{badge}</Badge> : null}
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{description}</span>
      </span>
    </LinkComponent>
  );
}
