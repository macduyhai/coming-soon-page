"use client";

import { motion, type Variants } from "framer-motion";
import Countdown from "./Countdown";
import EmailSignup from "./EmailSignup";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32"
      style={{ zIndex: 10 }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center max-w-2xl mx-auto gap-8"
      >
        {/* Eyebrow */}
        <motion.div variants={item}>
          <span
            className="font-mono text-[11px] tracking-[0.28em] rounded px-3 py-1.5"
            style={{
              color: "#6B7280",
              border: "1px solid rgba(79,70,229,0.15)",
            }}
          >
            [ HẢI PHÒNG &middot; CHỐNG LỪA ĐẢO SỐ ]
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-display font-bold leading-[1.06] tracking-[-0.03em] text-5xl sm:text-6xl md:text-7xl"
        >
          <span className="gradient-text">
            Nhận diện lừa đảo.
            <br />
            Bảo vệ Hải Phòng.
          </span>
        </motion.h1>

        {/* Subcopy */}
        <motion.p
          variants={item}
          className="font-body text-base md:text-lg leading-relaxed max-w-md"
          style={{ color: "#6B7280" }}
        >
          Nền tảng cẩm nang, cảnh báo và tố giác lừa đảo trực tuyến — hoàn
          toàn miễn phí, dành riêng cho người dân thành phố Hải Phòng.
        </motion.p>

        {/* Countdown */}
        <motion.div variants={item}>
          <Countdown />
        </motion.div>

        {/* Đăng ký nhận cảnh báo sớm */}
        <motion.div variants={item} className="w-full max-w-sm">
          <p
            className="font-mono text-[11px] tracking-[0.15em] mb-3"
            style={{ color: "#6B7280" }}
          >
            ĐĂNG KÝ NHẬN CẢNH BÁO SỚM
          </p>
          <EmailSignup />
        </motion.div>
      </motion.div>
    </section>
  );
}
