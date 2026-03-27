import type { Meta, StoryObj } from "@storybook/react";
import { Meteor } from "@/entities/decoration/ui/Meteor";
import { Asteroid } from "@/entities/decoration/ui/Asteroid";
import { Starfield } from "@/entities/decoration/ui/Starfield";
import { Nebula } from "@/entities/decoration/ui/Nebula";
import { DistantGalaxy } from "@/entities/decoration/ui/DistantGalaxy";
import { CosmicDust } from "@/entities/decoration/ui/CosmicDust";
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

function NebulaStory() {
  return (
    <ThreeDecorator cameraPosition={[0, 0, 40]}>
      <Nebula position={[0, 0, 0]} color="#8866cc" size={15} />
      <Nebula position={[20, 10, -10]} color="#cc6688" size={10} />
    </ThreeDecorator>
  );
}

function DistantGalaxiesStory() {
  return (
    <ThreeDecorator cameraPosition={[0, 0, 60]}>
      {Array.from({ length: 10 }, (_, i) => (
        <DistantGalaxy
          key={i}
          position={[Math.cos(i * 0.63) * 30, Math.sin(i * 0.97) * 20, Math.sin(i * 0.43) * 25]}
          color={['#aabbff', '#ffbbaa', '#bbffcc'][i % 3]}
          scale={0.3 + i * 0.05}
        />
      ))}
    </ThreeDecorator>
  );
}

function CosmicDustStory() {
  return (
    <ThreeDecorator cameraPosition={[0, 0, 30]}>
      <CosmicDust count={300} radius={50} opacity={0.2} />
    </ThreeDecorator>
  );
}

export const Nebulae: Story = {
  render: () => <NebulaStory />,
};

export const DistantGalaxies: Story = {
  render: () => <DistantGalaxiesStory />,
};

export const CosmicDustCloud: Story = {
  render: () => <CosmicDustStory />,
};
