import type { Meta, StoryObj } from "@storybook/react";

const spacingScale = [
  { name: "1", px: 4, tailwind: "p-1" },
  { name: "2", px: 8, tailwind: "p-2" },
  { name: "3", px: 12, tailwind: "p-3" },
  { name: "4", px: 16, tailwind: "p-4" },
  { name: "5", px: 20, tailwind: "p-5" },
  { name: "6", px: 24, tailwind: "p-6" },
  { name: "8", px: 32, tailwind: "p-8" },
  { name: "12", px: 48, tailwind: "p-12" },
  { name: "16", px: 64, tailwind: "p-16" },
];

const radiusScale = [
  { name: "--radius-sm", value: "4px (0.25rem)", css: "var(--radius-sm)" },
  { name: "--radius", value: "8px (0.5rem)", css: "var(--radius)" },
  { name: "--radius-lg", value: "12px (0.75rem)", css: "var(--radius-lg)" },
  { name: "--radius-xl", value: "16px (1rem)", css: "var(--radius-xl)" },
];

function SpacingPage() {
  return (
    <div style={{ padding: 32, maxWidth: 720, color: "white" }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>간격 & 반경</h1>
      <p style={{ color: "hsl(240 5% 65%)", marginBottom: 32 }}>
        4px 단위 기반 간격 스케일과 테두리 반경 토큰.
      </p>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>간격 (Spacing)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
        {spacingScale.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <code style={{ width: 60, fontSize: 14, color: "hsl(240 5% 65%)", textAlign: "right" }}>
              {s.tailwind}
            </code>
            <code style={{ width: 50, fontSize: 14, color: "hsl(240 5% 65%)" }}>
              {s.px}px
            </code>
            <div
              style={{
                width: s.px,
                height: 24,
                backgroundColor: "hsl(270 50% 40%)",
                borderRadius: 4,
                minWidth: 4,
              }}
            />
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>테두리 반경 (Border Radius)</h2>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {radiusScale.map((r) => (
          <div key={r.name} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: "hsl(270 50% 40%)",
                borderRadius: r.css,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: 14 }}><code>{r.name}</code></div>
            <div style={{ fontSize: 12, color: "hsl(240 5% 65%)" }}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof SpacingPage> = {
  title: "Design Tokens/Spacing",
  component: SpacingPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SpacingPage>;

export const Scale: Story = {};
