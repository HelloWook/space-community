import type { Meta, StoryObj } from "@storybook/react";
import { Planet3D } from "@/entities/planet/ui/Planet3D";
import { ThreeDecorator } from "./ThreeDecorator";
import type { PlanetSummary } from "@galaxy-board/types";

const basePlanet: PlanetSummary = {
  id: "story-planet-1",
  title: "스토리 행성",
  authorNickname: "우주인",
  authorName: null,
  starCount: 5,
  commentCount: 3,
  position: [0, 0, 0],
  mainColor: "#4A90D9",
  subColor: "#2C5F8A",
  size: "MEDIUM",
  shape: "SPHERE",
  pattern: "SMOOTH",
  hasRing: false,
  createdAt: new Date().toISOString(),
};

function PlanetStory(props: Partial<PlanetSummary>) {
  const planet = { ...basePlanet, ...props };
  return (
    <ThreeDecorator>
      <Planet3D planet={planet} />
    </ThreeDecorator>
  );
}

const meta: Meta<typeof PlanetStory> = {
  title: "3D/Planet",
  component: PlanetStory,
  argTypes: {
    mainColor: { control: "color" },
    subColor: { control: "color" },
    size: { control: "select", options: ["SMALL", "MEDIUM", "LARGE"] },
    shape: {
      control: "select",
      options: ["SPHERE", "BOX", "TETRAHEDRON", "OCTAHEDRON", "DODECAHEDRON", "TORUS", "CYLINDER", "CONE"],
    },
    pattern: { control: "select", options: ["SMOOTH", "CRATER", "STRIPE", "CLOUD"] },
    hasRing: { control: "boolean" },
  },
  args: {
    mainColor: "#4A90D9",
    subColor: "#2C5F8A",
    size: "MEDIUM",
    shape: "SPHERE",
    pattern: "SMOOTH",
    hasRing: false,
  },
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PlanetStory>;

export const Default: Story = {};

export const WithRing: Story = {
  args: { hasRing: true, mainColor: "#9C27B0", subColor: "#6A1B9A" },
};

export const Shapes: Story = {
  render: () => (
    <ThreeDecorator cameraPosition={[0, 0, 12]}>
      {(["SPHERE", "BOX", "TORUS", "CONE"] as const).map((shape, i) => (
        <Planet3D
          key={shape}
          planet={{
            ...basePlanet,
            id: `shape-${shape}`,
            shape,
            position: [(i - 1.5) * 3, 0, 0],
          }}
        />
      ))}
    </ThreeDecorator>
  ),
};
