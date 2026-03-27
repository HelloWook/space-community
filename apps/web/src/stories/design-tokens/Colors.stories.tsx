import type { Meta, StoryObj } from "@storybook/react";

const colorTokens = [
  { name: "--background", label: "Background", desc: "전체 배경 (우주 검정)" },
  { name: "--foreground", label: "Foreground", desc: "기본 텍스트 (흰색)" },
  { name: "--card", label: "Card", desc: "카드 배경" },
  { name: "--card-foreground", label: "Card Foreground", desc: "카드 텍스트" },
  { name: "--popover", label: "Popover", desc: "팝오버 배경" },
  { name: "--popover-foreground", label: "Popover Foreground", desc: "팝오버 텍스트" },
  { name: "--primary", label: "Primary", desc: "주요 액션" },
  { name: "--primary-foreground", label: "Primary Foreground", desc: "주요 액션 텍스트" },
  { name: "--secondary", label: "Secondary", desc: "보조 배경" },
  { name: "--secondary-foreground", label: "Secondary Foreground", desc: "보조 텍스트" },
  { name: "--muted", label: "Muted", desc: "비활성 배경" },
  { name: "--muted-foreground", label: "Muted Foreground", desc: "비활성 텍스트" },
  { name: "--accent", label: "Accent", desc: "악센트 (연보라)" },
  { name: "--accent-foreground", label: "Accent Foreground", desc: "악센트 텍스트" },
  { name: "--destructive", label: "Destructive", desc: "위험/에러" },
  { name: "--destructive-foreground", label: "Destructive Foreground", desc: "위험 텍스트" },
  { name: "--border", label: "Border", desc: "테두리" },
  { name: "--input", label: "Input", desc: "입력 필드 테두리" },
  { name: "--ring", label: "Ring", desc: "포커스 링" },
  { name: "--overlay-bg", label: "Overlay BG", desc: "오버레이 배경" },
  { name: "--overlay-border", label: "Overlay Border", desc: "오버레이 테두리" },
  { name: "--glow-purple", label: "Glow Purple", desc: "보라 글로우" },
];

function ColorSwatch({
  name,
  label,
  desc,
}: {
  name: string;
  label: string;
  desc: string;
}) {
  const hslValue =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim()
      : "";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: `hsl(${hslValue})`,
          border: "1px solid hsl(240 4% 30%)",
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ color: "hsl(240 5% 65%)", fontSize: 13 }}>
          <code>{name}</code> — hsl({hslValue})
        </div>
        <div style={{ color: "hsl(240 5% 55%)", fontSize: 12 }}>{desc}</div>
      </div>
    </div>
  );
}

function ColorsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      <h1 style={{ color: "white", fontSize: 30, marginBottom: 8 }}>색상 팔레트</h1>
      <p style={{ color: "hsl(240 5% 65%)", marginBottom: 32 }}>
        우주 테마 디자인 시스템의 색상 토큰. CSS 변수로 정의되며 globals.css에서 관리됩니다.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {colorTokens.map((token) => (
          <ColorSwatch key={token.name} {...token} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof ColorsPage> = {
  title: "Design Tokens/Colors",
  component: ColorsPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ColorsPage>;

export const Palette: Story = {};
