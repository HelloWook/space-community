import type { Meta, StoryObj } from "@storybook/react";
import { Meteor } from "@/entities/decoration/ui/Meteor";
import { Asteroid } from "@/entities/decoration/ui/Asteroid";
import { Starfield } from "@/entities/decoration/ui/Starfield";
import { ThreeDecorator } from "./ThreeDecorator";

function MeteorStory() {
  return (
    <ThreeDecorator cameraPosition={[0, 0, 20]}>
      <Meteor startPosition={[15, 10, 0]} direction={[-1, -0.5, -0.2]} speed={0.4} />
      <Meteor startPosition={[-10, 15, 5]} direction={[0.8, -0.7, -0.1]} speed={0.6} />
    </ThreeDecorator>
  );
}

function AsteroidStory() {
  return (
    <ThreeDecorator cameraPosition={[0, 0, 15]}>
      {Array.from({ length: 5 }, (_, i) => (
        <Asteroid
          key={i}
          center={[Math.cos(i * 1.2) * 5, Math.sin(i * 0.8) * 3, 0]}
          orbitRadius={2}
          scale={0.3 + i * 0.15}
          orbitSpeed={0.01 + i * 0.005}
        />
      ))}
    </ThreeDecorator>
  );
}

function StarfieldStory() {
  return (
    <ThreeDecorator cameraPosition={[0, 0, 30]}>
      <Starfield count={500} radius={50} />
    </ThreeDecorator>
  );
}

const meta: Meta = {
  title: "3D/Decorations",
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

export const Meteors: Story = {
  render: () => <MeteorStory />,
};

export const Asteroids: Story = {
  render: () => <AsteroidStory />,
};

export const Stars: Story = {
  render: () => <StarfieldStory />,
};
