import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/shadcn/dialog";
import { Button } from "@/shared/ui/shadcn/button";

/** shadcn Dialog 데모 — 크기 variant별 스토리 */
function DialogDemo({ maxWidthClass, label }: { maxWidthClass?: string; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Dialog 열기 ({label})</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={maxWidthClass}>
          <DialogHeader>
            <DialogTitle>Dialog 제목</DialogTitle>
            <DialogDescription>Dialog 설명 텍스트입니다.</DialogDescription>
          </DialogHeader>
          <p>Dialog 내부 콘텐츠입니다.</p>
          <Button variant="outline" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const meta: Meta<typeof DialogDemo> = {
  title: "UI/Dialog",
  component: DialogDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof DialogDemo>;

/** sm 크기 (~448px) */
export const Small: Story = {
  render: () => <DialogDemo maxWidthClass="sm:max-w-md" label="sm" />,
};

/** lg 크기 (~672px) */
export const Large: Story = {
  render: () => <DialogDemo maxWidthClass="sm:max-w-2xl" label="lg" />,
};

/** xl 크기 (~1024px) */
export const ExtraLarge: Story = {
  render: () => <DialogDemo maxWidthClass="sm:max-w-5xl" label="xl" />,
};

/** 우주 테마 스타일 적용 */
export const CosmicTheme: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>우주 테마 Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="sm:max-w-md border-[hsl(var(--overlay-border)/0.2)] bg-[hsl(var(--card))] shadow-[0_0_30px_hsl(var(--glow-purple)/0.15)]"
            overlayClassName="bg-[hsl(var(--overlay-bg)/0.85)] backdrop-blur-md"
          >
            <DialogHeader>
              <DialogTitle className="text-foreground">우주 테마</DialogTitle>
              <DialogDescription>우주 테마가 적용된 Dialog입니다.</DialogDescription>
            </DialogHeader>
            <p className="text-foreground/85">글래스모피즘 효과와 glow 그림자가 적용됩니다.</p>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
