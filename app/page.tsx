import FlowField from "@/components/FlowField";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import StatusPill from "@/components/StatusPill";

// ── Inline SVG icons cho footer ──────────────────────────
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 1.5h2.5l1 2.5-1.5 1a7 7 0 003 3l1-1.5 2.5 1V10a1 1 0 01-1 1C4.716 11 1 7.284 1 2.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="11" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 4l5.5 3.75L12 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M6.5 1.5C4.567 1.5 3 3.067 3 5c0 2.625 3.5 6.5 3.5 6.5S10 7.625 10 5c0-1.933-1.567-3.5-3.5-3.5z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="6.5" cy="5" r="1.25" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL;

export default function Home() {
  return (
    <main
      className="relative isolate min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: "#07060D" }}
    >
      {/* Layer 0 — flow-field canvas */}
      <FlowField />

      {/* Layer 1 — ambient gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none">
        <div
          className="blob-1 fixed rounded-full"
          style={{
            top: "-18%",
            left: "-8%",
            width: "55%",
            height: "55%",
            background:
              "radial-gradient(circle at center, rgba(99,102,241,0.14) 0%, transparent 68%)",
            filter: "blur(64px)",
            zIndex: 1,
          }}
        />
        <div
          className="blob-2 fixed rounded-full"
          style={{
            bottom: "-18%",
            right: "-8%",
            width: "50%",
            height: "50%",
            background:
              "radial-gradient(circle at center, rgba(34,211,238,0.09) 0%, transparent 68%)",
            filter: "blur(64px)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Top bar */}
      <header
        className="relative flex items-center justify-between px-6 py-5 md:px-10"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-3">
          {LOGO_URL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={LOGO_URL}
              alt="Logo Bộ Công An"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          )}
          <div className="flex flex-col">
            <span
              className="font-display text-sm font-semibold tracking-tight leading-none"
              style={{ color: "#ECECF5" }}
            >
              ANM&CNCHP
            </span>
            <span
              className="font-mono text-[9px] tracking-[0.18em]"
              style={{ color: "#8B8BA7" }}
            >
              HẢI PHÒNG &middot; CHỐNG LỪA ĐẢO
            </span>
          </div>
        </div>
        <StatusPill />
      </header>

      {/* Hero */}
      <Hero />

      {/* Feature cards + stats + hotlines */}
      <Features />

      {/* Footer */}
      <footer
        className="relative px-6 py-8 md:px-10"
        style={{
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          {/* Contact row */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <a
              href="tel:0692785415"
              className="flex items-center gap-2 font-mono text-xs text-muted hover:text-fg transition-colors duration-150"
              aria-label="Gọi điện: 069.278.5415"
            >
              <PhoneIcon />
              069.278.5415
            </a>
            <a
              href="mailto:chongluadaotructuyenhp@gmail.com"
              className="flex items-center gap-2 font-mono text-xs text-muted hover:text-fg transition-colors duration-150 break-all"
              aria-label="Gửi email"
            >
              <MailIcon />
              chongluadaotructuyenhp@gmail.com
            </a>
            <span className="flex items-center gap-2 font-mono text-xs text-muted">
              <PinIcon />
              Hải Phòng, Việt Nam
            </span>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
            aria-hidden="true"
          />

          {/* Copyright */}
          <p
            className="font-mono text-[10px] leading-relaxed text-muted"
          >
            &copy; 2026 ANM&amp;CNCHP &ndash; An ninh mạng và PCTP sử dụng công nghệ cao
            CATP Hải Phòng. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </main>
  );
}
