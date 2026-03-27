import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Overlay } from "@/widgets/overlay/ui/Overlay";
import { Button } from "@/shared/ui/shadcn/button";

function OverlayDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>오버레이 열기</Button>
      <Overlay open={open} onClose={() => setOpen(false)} title="오버레이 제목">
        <p>오버레이 내부 콘텐츠입니다. ESC 키 또는 배경 클릭으로 닫을 수 있습니다.</p>
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

export const Default: Story = {};

export const OpenByDefault: Story = {
  render: () => (
    <Overlay open={true} onClose={() => {}} title="항상 열린 오버레이">
      <p>이 오버레이는 스토리에서 항상 열린 상태로 표시됩니다.</p>
    </Overlay>
  ),
};
