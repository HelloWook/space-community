import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Overlay } from "@/widgets/overlay/ui/Overlay";
import { Button } from "@/shared/ui/shadcn/button";

/** 크기별 오버레이 데모 래퍼 */
function OverlayDemo({ size, title, description }: { size?: 'sm' | 'lg' | 'xl'; title?: string; description?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>오버레이 열기 ({size ?? 'sm'})</Button>
      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        title={title ?? "오버레이 제목"}
        description={description}
        size={size}
      >
        <p>오버레이 내부 콘텐츠입니다. ESC 키 또는 닫기 버튼으로 닫을 수 있습니다.</p>
        <div style={{ marginTop: 16 }}>
          <Button variant="outline" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </div>
      </Overlay>
    </div>
  );
}

const meta: Meta<typeof OverlayDemo> = {
  title: "UI/Overlay",
  component: OverlayDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof OverlayDemo>;

/** 기본 (sm) 크기 오버레이 */
export const Default: Story = {};

/** sm 크기 — 로그인, 은하 생성용 */
export const Small: Story = {
  render: () => <OverlayDemo size="sm" title="로그인" description="소셜 계정으로 간편하게 로그인하세요" />,
};

/** lg 크기 — 게시글 상세용 */
export const Large: Story = {
  render: () => <OverlayDemo size="lg" title="게시글 상세" />,
};

/** xl 크기 — 게시글 작성 (2단 레이아웃)용 */
export const ExtraLarge: Story = {
  render: () => <OverlayDemo size="xl" title="새 게시글" />,
};

/** 항상 열린 상태의 오버레이 */
export const OpenByDefault: Story = {
  render: () => (
    <Overlay open={true} onClose={() => {}} title="항상 열린 오버레이" size="sm">
      <p>이 오버레이는 스토리에서 항상 열린 상태로 표시됩니다.</p>
    </Overlay>
  ),
};
