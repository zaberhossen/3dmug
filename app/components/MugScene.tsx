"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface MugProps {
  textureUrl: string | null;
}

function Mug({ textureUrl }: MugProps) {
  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const loader = new THREE.TextureLoader();
    const t = loader.load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }, [textureUrl]);

  // Outer cylinder body (open-ended so texture maps cleanly)
  const bodyGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.42, 0.38, 1.1, 64, 1, true),
    []
  );

  // Bottom disc
  const bottomGeometry = useMemo(
    () => new THREE.CircleGeometry(0.38, 64),
    []
  );

  // Top rim torus
  const rimGeometry = useMemo(
    () => new THREE.TorusGeometry(0.42, 0.022, 16, 64),
    []
  );

  // Handle tube along a bezier-like curve
  const handleCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.42, 0.35, 0),
        new THREE.Vector3(0.72, 0.25, 0),
        new THREE.Vector3(0.78, 0.0, 0),
        new THREE.Vector3(0.72, -0.25, 0),
        new THREE.Vector3(0.42, -0.35, 0),
      ]),
    []
  );

  const handleGeometry = useMemo(
    () => new THREE.TubeGeometry(handleCurve, 30, 0.048, 10, false),
    [handleCurve]
  );

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture,
        roughness: 0.18,
        metalness: 0.04,
        side: THREE.FrontSide,
      }),
    [texture]
  );

  const whiteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.18,
        metalness: 0.04,
      }),
    []
  );

  return (
    <group>
      {/* Outer mug body with texture */}
      <mesh geometry={bodyGeometry} material={bodyMaterial} />
      {/* Bottom cap */}
      <mesh
        geometry={bottomGeometry}
        material={whiteMaterial}
        position={[0, -0.55, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* Top rim ring */}
      <mesh
        geometry={rimGeometry}
        material={whiteMaterial}
        position={[0, 0.55, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* Handle */}
      <mesh geometry={handleGeometry} material={whiteMaterial} />
    </group>
  );
}

interface DownloadCaptureProps {
  onReady: (fn: () => void) => void;
}

function DownloadCapture({ onReady }: DownloadCaptureProps) {
  const { gl } = useThree();

  useEffect(() => {
    onReady(() => {
      try {
        const dataUrl = gl.domElement.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "mug-mockup.png";
        link.href = dataUrl;
        link.click();
      } catch {
        alert(
          "Download failed. This may be caused by cross-origin image restrictions. Try uploading a local image file."
        );
      }
    });
  }, [gl, onReady]);

  return null;
}

interface MugSceneProps {
  textureUrl: string | null;
  onDownloadReady: (fn: () => void) => void;
}

export default function MugScene({
  textureUrl,
  onDownloadReady,
}: MugSceneProps) {
  const orbitRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <div className="relative w-full h-full">
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 0.2, 2.8], fov: 45 }}
        shadows
      >
        <color attach="background" args={["#1e293b"]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.4}
          castShadow
        />
        <directionalLight position={[-4, 3, -4]} intensity={0.7} />
        <pointLight position={[0, 6, 0]} intensity={0.4} />
        <pointLight position={[0, -2, 2]} intensity={0.2} />

        <Mug textureUrl={textureUrl} />

        <OrbitControls
          ref={orbitRef}
          enableZoom
          enablePan={false}
          minDistance={1.8}
          maxDistance={5}
          autoRotate={!textureUrl}
          autoRotateSpeed={1.8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 0.8}
        />

        <DownloadCapture onReady={onDownloadReady} />
      </Canvas>

      {/* Overlay hint */}
      <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-400 pointer-events-none select-none">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  );
}
