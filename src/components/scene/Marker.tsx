"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AdditiveBlending, Mesh, type Group, type MeshBasicMaterial } from "three";
import type { HistoricalLocation } from "@/domain/types";
import { sceneMotion } from "@/lib/choreography";
import { facingOpacity, isFacingCamera, latLonToVector3 } from "@/lib/geo";
import { formatYear } from "@/lib/years";
import { useAtlasStore } from "@/store/useAtlasStore";

const MARKER_RADIUS = 1.005;
const noRaycast = () => null;
const meshRaycast = Mesh.prototype.raycast;

type Props = { location: HistoricalLocation; index: number };

/** Camera-to-marker distance at which markers render at their modelled size (era framing ≈ 2.8). */
const MARKER_REF_DISTANCE = 1.8;

export function Marker({ location, index }: Props) {
  const position = useMemo(
    () => latLonToVector3(location.coordinates.lat, location.coordinates.lon, MARKER_RADIUS),
    [location],
  );
  const outward = useMemo(() => position.clone().multiplyScalar(2), [position]);

  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const beam = useRef<Mesh>(null);
  const hit = useRef<Mesh>(null);
  const dotMat = useRef<MeshBasicMaterial>(null);
  const ringMat = useRef<MeshBasicMaterial>(null);
  const beamMat = useRef<MeshBasicMaterial>(null);
  const hoverScale = useRef(1);
  const hoverTarget = useRef(1);
  const [hovered, setHovered] = useState(false);
  const phase = useMemo(() => index * 0.9, [index]);

  const setStoreHovered = useAtlasStore((s) => s.setHovered);
  const selectLocation = useAtlasStore((s) => s.selectLocation);

  // Local +Z points away from the globe centre; ringGeometry faces +Z, so it lies tangent.
  useLayoutEffect(() => {
    root.current?.lookAt(outward);
  }, [outward]);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
      if (useAtlasStore.getState().hoveredLocationId === location.id) useAtlasStore.getState().setHovered(null);
    },
    [location.id],
  );

  useFrame(({ camera, clock }, delta) => {
    const m = sceneMotion.markers[index];
    const dot = isFacingCamera(position, camera.position);
    const facing = facingOpacity(dot);
    const opacity = m.opacity * facing;
    const visible = opacity > 0.01 && m.scale > 0.001;

    if (root.current) {
      root.current.visible = visible;
      // Roughly constant on-screen size: markers shrink as the camera approaches the surface.
      root.current.scale.setScalar(Math.min(1, Math.max(0.25, camera.position.distanceTo(position) / MARKER_REF_DISTANCE)));
    }
    const interactive = visible && dot > 0 && !useAtlasStore.getState().isTransitioning;
    if (hit.current) hit.current.raycast = interactive ? meshRaycast : noRaycast;
    if (!interactive && (hovered || hoverTarget.current !== 1)) {
      hoverTarget.current = 1;
      setHovered(false);
      if (useAtlasStore.getState().hoveredLocationId === location.id) setStoreHovered(null);
      document.body.style.cursor = "";
    }
    if (!visible) return;

    hoverScale.current += (hoverTarget.current - hoverScale.current) * Math.min(1, delta * 12);
    const s = m.scale * hoverScale.current;
    body.current?.scale.setScalar(s);

    const h = m.highlight;
    const pulse = sceneMotion.ambient ? (clock.elapsedTime * 0.6 + phase) % 1 : 0;
    // Pulse fades out as the highlight comes in; highlighted ring ends ≈3× the dot diameter.
    const pulseScale = sceneMotion.ambient ? 1 + pulse * 0.6 * (1 - h) : 1;
    const pulseFade = sceneMotion.ambient ? 1 - pulse : 0.7;
    ring.current?.scale.setScalar(pulseScale * (1 + 0.24 * h));

    if (dotMat.current) {
      dotMat.current.color.copy(sceneMotion.accent);
      dotMat.current.opacity = opacity;
    }
    if (ringMat.current) {
      ringMat.current.color.copy(sceneMotion.accent);
      ringMat.current.opacity = opacity * Math.min(1, (0.15 + 0.6 * pulseFade) * (1 + h) );
    }
    if (beam.current) {
      beam.current.visible = h > 0.01;
      beam.current.scale.z = Math.max(0.001, h);
      if (beamMat.current) {
        beamMat.current.color.copy(sceneMotion.accent);
        beamMat.current.opacity = opacity * 0.8 * Math.min(1, h);
      }
    }
  });

  return (
    <group ref={root} position={position} visible={false}>
      <group ref={body}>
        <mesh raycast={noRaycast}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial ref={dotMat} transparent depthWrite={false} blending={AdditiveBlending} />
        </mesh>
        <group ref={ring}>
          <mesh raycast={noRaycast}>
            <ringGeometry args={[0.024, 0.029, 48]} />
            <meshBasicMaterial ref={ringMat} transparent depthWrite={false} blending={AdditiveBlending} side={2} />
          </mesh>
        </group>
        <mesh ref={beam} position={[0, 0, 0.06]} scale={[1, 1, 0.001]} visible={false} raycast={noRaycast}>
          <boxGeometry args={[0.004, 0.004, 0.12]} />
          <meshBasicMaterial ref={beamMat} transparent depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      </group>
      <mesh
        ref={hit}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoverTarget.current = 1.4;
          setHovered(true);
          setStoreHovered(location.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hoverTarget.current = 1;
          setHovered(false);
          setStoreHovered(null);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectLocation(location.id);
        }}
      >
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {hovered && (
        <Html position={[0, 0, 0.04]} center style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div className="-translate-y-8 whitespace-nowrap rounded-md border border-(--tip-accent) bg-black/60 px-3 py-1.5 text-center shadow-lg backdrop-blur-md"
            style={{ ["--tip-accent" as string]: `#${sceneMotion.accent.getHexString()}` }}>
            <div className="font-serif text-base leading-tight text-[#ece6d6]">{location.name}</div>
            <div className="font-sans text-[11px] tracking-wide text-white/60">{formatYear(location.year)}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

