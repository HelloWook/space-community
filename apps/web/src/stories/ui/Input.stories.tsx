import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/shared/ui/shadcn/input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "입력해주세요",
    type: "text",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "은하 보드" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "비활성 상태" },
};

export const Error: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "잘못된 입력",
  },
};
