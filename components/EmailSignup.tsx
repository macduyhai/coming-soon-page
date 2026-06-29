"use client";

import { useState, type FormEvent } from "react";

type State = "idle" | "loading" | "success" | "error";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const endpoint = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMsg("Vui lòng nhập địa chỉ email hợp lệ.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");

    if (!endpoint) {
      await new Promise((r) => setTimeout(r, 700));
      setState("success");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
    } catch {
      setErrorMsg("Có lỗi xảy ra. Vui lòng thử lại sau.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-center justify-center py-3">
        <p className="font-mono text-sm" style={{ color: "#22D3EE" }}>
          &mdash;&nbsp;Đã ghi nhận. Chúng tôi sẽ thông báo khi ra mắt.&nbsp;&mdash;
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-2.5 w-full"
    >
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="email@example.com"
          aria-label="Địa chỉ email"
          autoComplete="email"
          disabled={state === "loading"}
          className="email-input flex-1 rounded-lg px-4 py-3 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Đăng ký nhận cảnh báo sớm khi ra mắt"
          className="cta-button rounded-lg px-5 py-3 font-mono text-sm font-medium shrink-0"
        >
          {state === "loading" ? (
            <span style={{ opacity: 0.6 }}>&#8230;</span>
          ) : (
            "Nhận cảnh báo"
          )}
        </button>
      </div>

      {state === "error" && errorMsg && (
        <p
          role="alert"
          className="font-mono text-[11px] pl-1"
          style={{ color: "#F472B6" }}
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}
