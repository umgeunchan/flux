import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Globe from "./components/Globe";
import * as THREE from "three";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}>
      {/* 상단 헤더 UI */}
      <header
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          padding: "20px",
          zIndex: 10,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          backdropFilter: "blur(4px)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          FLUX
        </h1>
        <nav>
          <span style={{ cursor: "pointer", opacity: 0.8 }}>About</span>
        </nav>
      </header>

      {/* 3D 캔버스 영역 */}
      <Canvas
        dpr={[1, 2]} // 고해상도 디스플레이 대응 (선명도 핵심)
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <color attach="background" args={["#000"]} />

        {/* 전체적으로 은은한 빛 */}
        <ambientLight intensity={0.8} />

        {/* 태양 역할: 한쪽에서 강하게 비춰야 입체감이 삽니다 */}
        <directionalLight position={[5, 3, 5]} intensity={2} />

        {/* 지구가 반짝이게 해줄 포인트 조명 */}
        <pointLight position={[-5, -3, -5]} color="#2244ff" intensity={1} />

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshBasicMaterial color="#111" />
            </mesh>
          }
        >
          <Globe />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}

export default App;
