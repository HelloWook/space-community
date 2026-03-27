import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

interface ThreeDecoratorProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

/**
 * 3D 스토리용 Canvas + OrbitControls + 조명 래퍼.
 * 각 스토리에 독립적인 WebGL 컨텍스트를 제공한다.
 */
export function ThreeDecorator({
  children,
  cameraPosition = [0, 0, 5],
}: ThreeDecoratorProps) {
  return (
    <div style={{ width: "100%", height: 500, background: "#050510" }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050510"]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableDamping />
        {children}
      </Canvas>
    </div>
  );
}
