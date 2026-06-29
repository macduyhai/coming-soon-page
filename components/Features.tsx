const features = [
  {
    id: "01",
    title: "Cẩm nang nhận diện",
    description:
      "Thư viện thủ đoạn lừa đảo phổ biến — giả mạo công an, ngân hàng, chiếm đoạt mạng xã hội, đầu tư ảo — được cập nhật hàng tuần theo thực tế tại Hải Phòng.",
    accent: "#4F46E5",
  },
  {
    id: "02",
    title: "Cảnh báo tức thì",
    description:
      "Nhận thông báo ngay khi xuất hiện kịch bản lừa đảo mới tại địa bàn Hải Phòng.",
    accent: "#7C3AED",
  },
  {
    id: "03",
    title: "Tố giác trực tiếp",
    description:
      "Báo cáo vụ việc kèm bằng chứng ảnh, video, đoạn hội thoại — kết nối thẳng tới cơ quan điều tra. Nhanh hơn, có dấu vết pháp lý rõ ràng hơn.",
    accent: "#06B6D4",
  },
  {
    id: "04",
    title: "Xác minh nguồn tin",
    description:
      "Có các hướng dẫn cụ thể để xác minh thông tin, tránh bị lừa đảo bởi các nguồn tin giả mạo.",
    accent: "#4F46E5",
  },
];

const stats = [
  {
    number: "24+",
    label: "Loại Lừa Đảo Được Giải Thích",
    color: "#6366F1",
  },
  {
    number: "6",
    label: "Quy Tắc Vàng Để Bảo Vệ",
    color: "#8B5CF6",
  },
  {
    number: "5",
    label: "Bước Phòng Chống",
    color: "#06B6D4",
  },
];

const hotlines = [
  {
    number: "113",
    label: "Cảnh sát",
    sublabel: "Khẩn cấp — 24/7",
  },
  {
    number: "5656",
    label: "Chống lừa đảo",
    sublabel: "Đường dây quốc gia",
  },
  {
    number: "069.278.5415",
    label: "ANM&CNCHP",
    sublabel: "An ninh mạng và PCTP sử dụng công nghệ cao CATP Hải Phòng",
  },
];

// ── Inline SVG icons ──────────────────────────────────────
function IconRecognize() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 1.5L2.25 4.5V9c0 4.14 2.9 8.02 6.75 9 3.85-.98 6.75-4.86 6.75-9V4.5L9 1.5z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      <path
        d="M6.25 9.25l2 2 3.5-3.5"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 6v4M9 12.25v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 3h10l-2 4 2 4H3V3z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      <path d="M3 15v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconVerify() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 12l3.75 3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = [IconRecognize, IconAlert, IconReport, IconVerify];

export default function Features() {
  return (
    <section
      className="relative px-6 pb-16 md:px-10 md:pb-24"
      style={{ zIndex: 10 }}
      aria-label="Tính năng và thống kê"
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Section header ─────────────────────────────── */}
        <div
          className="flex items-center gap-4 mb-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.25em] shrink-0"
            style={{ color: "#6B7280" }}
          >
            NỀN TẢNG SẮP RA MẮT
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(0,0,0,0.07)" }}
            aria-hidden="true"
          />
        </div>

        {/* ── Stats row ──────────────────────────────────── */}
        <div
          className="grid grid-cols-3 rounded-xl overflow-hidden mb-6"
          style={{
            border: "1px solid rgba(79,70,229,0.12)",
            background: "#FFFFFF",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
          aria-label="Thống kê nội dung"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center py-7 px-3 sm:px-6"
              style={{
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
              }}
            >
              <span
                className="font-mono font-bold leading-none mb-2 text-3xl sm:text-4xl md:text-5xl"
                style={{ color: s.color }}
              >
                {s.number}
              </span>
              <span
                className="font-body text-[11px] sm:text-xs leading-tight"
                style={{ color: "#6B7280" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Feature grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = ICONS[i];
            return (
              <article
                key={f.id}
                className="feature-card rounded-xl p-6 flex flex-col gap-4"
                style={{ background: "#FFFFFF" }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ background: `${f.accent}18`, color: f.accent }}
                  >
                    <Icon />
                  </div>
                  <span
                    className="font-mono text-[10px] tracking-[0.2em]"
                    style={{ color: "#6B7280" }}
                  >
                    {f.id}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3
                    className="font-display text-sm font-semibold"
                    style={{ color: "#14103A" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {f.description}
                  </p>
                </div>

                <div>
                  <span
                    className="font-mono text-[9px] tracking-[0.2em] rounded px-2 py-0.5"
                    style={{
                      color: f.accent,
                      border: `1px solid ${f.accent}40`,
                      background: `${f.accent}0D`,
                    }}
                  >
                    SẮP CÓ
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Emergency hotlines ─────────────────────────── */}
        <div
          className="mt-6 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5"
          style={{
            background: "rgba(6,182,212,0.06)",
            border: "1px solid rgba(6,182,212,0.22)",
          }}
        >
          <div className="shrink-0">
            <p
              className="font-mono text-[10px] tracking-[0.22em] mb-1"
              style={{ color: "#06B6D4" }}
            >
              LIÊN HỆ KHẨN CẤP
            </p>
            <p className="font-body text-xs leading-relaxed" style={{ color: "#6B7280" }}>
              Nếu bạn đang hoặc vừa bị lừa đảo, hãy liên hệ ngay:
            </p>
          </div>

          <div
            className="w-px h-8 hidden sm:block shrink-0"
            style={{ background: "rgba(0,0,0,0.07)" }}
            aria-hidden="true"
          />

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {hotlines.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="flex flex-col gap-0.5 group"
                aria-label={`Gọi ${h.label}: ${h.number}`}
              >
                <span
                  className="font-mono text-lg font-semibold leading-none group-hover:text-cyan transition-colors duration-150"
                  style={{ color: "#14103A" }}
                >
                  {h.number}
                </span>
                <span
                  className="font-mono text-[10px] tracking-[0.12em]"
                  style={{ color: "#6B7280" }}
                >
                  {h.label}
                </span>
                <span
                  className="font-mono text-[9px]"
                  style={{ color: "#6B7280", opacity: 0.7 }}
                >
                  {h.sublabel}
                </span>
              </a>
            ))}
          </div>
        </div>

        <p
          className="font-mono text-[10px] mt-4 leading-relaxed text-center"
          style={{ color: "#6B7280", opacity: 0.55 }}
        >
          Số đường dây nóng có thể thay đổi theo quy định cơ quan nhà nước. Vui lòng xác
          minh trước khi gọi.
        </p>
      </div>
    </section>
  );
}
