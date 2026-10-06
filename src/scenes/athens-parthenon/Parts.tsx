"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, Object3D, type BufferGeometry, type Material } from "three";
import type { InstanceSpec } from "../kit";

const dummy = new Object3D();
const tint = new Color();

/**
 * Instanced mesh like the kit `Instances`, plus a custom shadow depth material (needed when the vertex shader
 * deforms the geometry, see templeMaterials.ts).
 */
export function Parts({
  geometry,
  material,
  depth,
  items,
  castShadow = false,
  receiveShadow = false,
}: {
  geometry: BufferGeometry;
  material: Material;
  depth?: Material;
  items: readonly InstanceSpec[];
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  const capacity = useMemo(() => Math.max(1, items.length), [items.length]);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach((it, i) => {
      dummy.position.set(...it.position);
      dummy.rotation.set(...(it.rotation ?? [0, 0, 0]));
      const s = it.scale ?? 1;
      if (typeof s === "number") dummy.scale.setScalar(s);
      else dummy.scale.set(...s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (it.color) mesh.setColorAt(i, tint.set(it.color));
    });
    mesh.count = items.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);
  if (items.length === 0) return null;
  return (
    <instancedMesh
      key={capacity}
      ref={ref}
      args={[geometry, material, capacity]}
      customDepthMaterial={depth}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
    />
  );
}
