import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useWASDControls } from '@/shared/lib/hooks/use-wasd-controls';

/** WASD 컨트롤 데모용 씬 내부 컴포넌트 */
function WASDScene() {
  useWASDControls({
    speed: 0.3,
    enabled: true,
    bounds: { min: [-200, -100, -200], max: [200, 100, 200] },
  });

  return (
    <>
      <color attach="background" args={['#050510']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableDamping />

      {/* 바닥 그리드 — 이동 감각 제공 */}
      <gridHelper args={[100, 50, '#334155', '#1e293b']} />

      {/* 랜드마크 큐브들 — 공간 내 위치 인지용 */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 15 + (i % 3) * 10;
        return (
          <mesh
            key={`landmark-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.5 + (i % 4),
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[1, 1 + (i % 3), 1]} />
            <meshStandardMaterial
              color={`hsl(${(i * 18) % 360}, 70%, 60%)`}
            />
          </mesh>
        );
      })}

      {/* 중앙 구체 — 기준점 */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#4A90D9" emissive="#1a3a5c" />
      </mesh>
    </>
  );
}

/** WASD 자유이동 스토리 래퍼 */
function WASDControlsStory() {
  return (
    <div style={{ width: '100%', height: 500, background: '#050510' }}>
      <Canvas camera={{ position: [0, 10, 30], fov: 60 }} gl={{ antialias: true }}>
        <WASDScene />
      </Canvas>
    </div>
  );
}

const meta: Meta<typeof WASDControlsStory> = {
  title: '3D/WASDControls',
  component: WASDControlsStory,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof WASDControlsStory>;

/** 기본 WASD 자유이동 — W/A/S/D 키로 카메라 이동, 마우스로 회전 */
export const Default: Story = {};
