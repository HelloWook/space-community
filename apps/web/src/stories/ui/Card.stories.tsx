import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/shadcn/card";
import { Button } from "@/shared/ui/shadcn/button";

function CardExample() {
  return (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader>
        <CardTitle>행성 제목</CardTitle>
        <CardDescription>2026-03-27에 생성됨</CardDescription>
      </CardHeader>
      <CardContent>
        <p>은하계 게시판의 행성 카드 예시입니다. 우주 테마에 맞는 어두운 배경 위에 렌더링됩니다.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">상세 보기</Button>
      </CardFooter>
    </Card>
  );
}

const meta: Meta<typeof CardExample> = {
  title: "UI/Card",
  component: CardExample,
};

export default meta;
type Story = StoryObj<typeof CardExample>;

export const Default: Story = {};

export const MinimalCard: Story = {
  render: () => (
    <Card style={{ maxWidth: 400, padding: 16 }}>
      <p>최소 카드 — 헤더/푸터 없이 콘텐츠만</p>
    </Card>
  ),
};
