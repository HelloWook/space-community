// 절차적 패턴 ShaderMaterial 팩토리 — 행성 표면 렌더링용

import * as THREE from 'three';
import { SIMPLEX_NOISE_GLSL } from './noise';

import type { SurfacePattern } from '@galaxy-board/types';

/** 패턴별 fragment shader 본문 */
const PATTERN_FRAGMENTS: Record<SurfacePattern, string> = {
  // SMOOTH: mainColor → subColor 그라디언트
  SMOOTH: `
    float gradient = vUv.y;
    gl_FragColor = vec4(mix(mainColor, subColor, gradient), 1.0);
  `,
  // CRATER: 고주파 noise로 울퉁불퉁한 크레이터
  CRATER: `
    float n = snoise(vPosition * 4.0);
    float crater = smoothstep(0.2, 0.4, n);
    vec3 color = mix(mainColor * 0.6, mainColor, crater);
    color = mix(color, subColor, smoothstep(-0.3, 0.0, n) * 0.3);
    gl_FragColor = vec4(color, 1.0);
  `,
  // STRIPE: sin 함수 기반 줄무늬
  STRIPE: `
    float stripe = sin(vUv.y * 20.0) * 0.5 + 0.5;
    vec3 color = mix(mainColor, subColor, step(0.5, stripe));
    gl_FragColor = vec4(color, 1.0);
  `,
  // CLOUD: 저주파 noise로 부드러운 구름
  CLOUD: `
    float n = snoise(vPosition * 2.0) * 0.5 + 0.5;
    float cloud = smoothstep(0.3, 0.7, n);
    vec3 color = mix(mainColor, subColor, cloud);
    gl_FragColor = vec4(color, 1.0);
  `,
};

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** 패턴 + 색상으로 ShaderMaterial 생성 */
export function createPlanetMaterial(
  pattern: SurfacePattern,
  mainColor: string,
  subColor: string,
): THREE.ShaderMaterial {
  const fragmentBody = PATTERN_FRAGMENTS[pattern] ?? PATTERN_FRAGMENTS.SMOOTH;

  const fragmentShader = /* glsl */ `
    ${SIMPLEX_NOISE_GLSL}

    uniform vec3 mainColor;
    uniform vec3 subColor;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      ${fragmentBody}
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader,
    uniforms: {
      mainColor: { value: new THREE.Color(mainColor) },
      subColor: { value: new THREE.Color(subColor) },
    },
  });
}
