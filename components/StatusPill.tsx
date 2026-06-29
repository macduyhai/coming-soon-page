export default function StatusPill() {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
      </span>
      <span className="font-mono text-[10px] tracking-[0.14em] text-muted whitespace-nowrap">
        HỆ THỐNG ĐANG CÀI ĐẶT &mdash; RA MẮT Q4&middot;2026
      </span>
    </div>
  );
}
