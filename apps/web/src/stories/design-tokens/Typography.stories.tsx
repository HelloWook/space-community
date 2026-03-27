import type { Meta, StoryObj } from "@storybook/react";

const sizeScale = [
  { name: "text-xs", size: "12px / 0.75rem", usage: "아이콘 내 텍스트 (최소 사용)", className: "text-xs" },
  { name: "text-sm", size: "14px / 0.875rem", usage: "캡션, 메타 정보", className: "text-sm" },
  { name: "text-base", size: "16px / 1rem", usage: "본문 기본", className: "text-base" },
  { name: "text-lg", size: "18px / 1.125rem", usage: "소제목", className: "text-lg" },
  { name: "text-xl", size: "20px / 1.25rem", usage: "중제목", className: "text-xl" },
  { name: "text-2xl", size: "24px / 1.5rem", usage: "제목", className: "text-2xl" },
  { name: "text-3xl", size: "30px / 1.875rem", usage: "대제목", className: "text-3xl" },
  { name: "text-4xl", size: "36px / 2.25rem", usage: "히어로", className: "text-4xl" },
];

const weightScale = [
  { name: "Normal", value: "400", className: "font-normal" },
  { name: "Medium", value: "500", className: "font-medium" },
  { name: "Semibold", value: "600", className: "font-semibold" },
  { name: "Bold", value: "700", className: "font-bold" },
];

function TypographyPage() {
  return (
    <div style={{ padding: 32, maxWidth: 720, color: "white" }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>타이포그래피</h1>
      <p style={{ color: "hsl(240 5% 65%)", marginBottom: 32 }}>
        폰트 패밀리, 크기 단계, 행간, 굵기. WCAG 최소 기준: 본문 16px 이상.
      </p>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>폰트 패밀리</h2>
      <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, color: "hsl(240 5% 65%)" }}>
            <code>--font-sans</code>
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 18 }}>
            The quick brown fox jumps over the lazy dog. 은하를 항해하다.
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: "hsl(240 5% 65%)" }}>
            <code>--font-mono</code>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 18 }}>
            const galaxy = new Galaxy(&quot;은하&quot;);
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>크기 단계</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid hsl(240 4% 16%)" }}>
            <th style={{ textAlign: "left", padding: 8, color: "hsl(240 5% 65%)", fontSize: 14 }}>클래스</th>
            <th style={{ textAlign: "left", padding: 8, color: "hsl(240 5% 65%)", fontSize: 14 }}>크기</th>
            <th style={{ textAlign: "left", padding: 8, color: "hsl(240 5% 65%)", fontSize: 14 }}>용도</th>
            <th style={{ textAlign: "left", padding: 8, color: "hsl(240 5% 65%)", fontSize: 14 }}>미리보기</th>
          </tr>
        </thead>
        <tbody>
          {sizeScale.map((s) => (
            <tr key={s.name} style={{ borderBottom: "1px solid hsl(240 4% 16%)" }}>
              <td style={{ padding: 8 }}><code>{s.name}</code></td>
              <td style={{ padding: 8, fontSize: 14, color: "hsl(240 5% 65%)" }}>{s.size}</td>
              <td style={{ padding: 8, fontSize: 14, color: "hsl(240 5% 65%)" }}>{s.usage}</td>
              <td style={{ padding: 8 }}>
                <span className={s.className}>은하 보드</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>굵기</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {weightScale.map((w) => (
          <div key={w.name} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <code style={{ width: 120, fontSize: 14, color: "hsl(240 5% 65%)" }}>{w.value}</code>
            <span className={w.className} style={{ fontSize: 18 }}>
              {w.name} — 은하를 항해하다
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>행간 (Line Height)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { name: "tight", value: "1.25", className: "leading-tight" },
          { name: "normal", value: "1.5", className: "leading-normal" },
          { name: "relaxed", value: "1.75", className: "leading-relaxed" },
        ].map((lh) => (
          <div key={lh.name}>
            <div style={{ fontSize: 14, color: "hsl(240 5% 65%)", marginBottom: 4 }}>
              <code>leading-{lh.name}</code> ({lh.value})
            </div>
            <p className={lh.className} style={{ fontSize: 16, maxWidth: 480, margin: 0 }}>
              은하 보드에서 행성을 만들고 위성 댓글을 달아보세요. 우주를 항해하며 다른 사용자의 은하를 탐험할 수 있습니다.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof TypographyPage> = {
  title: "Design Tokens/Typography",
  component: TypographyPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TypographyPage>;

export const Scale: Story = {};
