import React, { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import colorImg from "../assets/earth_color.jpg";
import bumpImg from "../assets/earth_bump.jpg";
import nightImg from "../assets/earth_night.jpg"; // 밤 도시 불빛 이미지 추가

const Globe = () => {
  const globeRef = useRef();

  const [colorMap, bumpMap, nightMap] = useLoader(THREE.TextureLoader, [
    colorImg,
    bumpImg,
    nightImg,
  ]);

  // 쉐이더 데이터 (Uniforms)
  const uniforms = useMemo(
    () => ({
      sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
      dayTexture: { value: colorMap },
      nightTexture: { value: nightMap },
    }),
    [colorMap, nightMap],
  );

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vSunDirection;

          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            // 태양의 위치를 계산
            vSunDirection = normalize(vec3(5.0, 3.0, 5.0)); 
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vSunDirection;

          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;

          void main() {
            // 법선 벡터와 태양 방향의 내적을 통해 빛의 양 계산
            float intensity = dot(vNormal, vSunDirection);
            
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb;
            
            // 내적값이 높으면 낮(day), 낮으면 밤(night) 텍스처를 섞음
            // clamp를 사용하여 범위를 0~1로 고정하고 부드럽게 전환
            float mixAmount = smoothstep(-0.2, 0.2, intensity);
            vec3 finalColor = mix(nightColor, dayColor, mixAmount);
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
};

export default Globe;
