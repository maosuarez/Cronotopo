"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { BufferGeometry, Color, InstancedMesh, Material, Object3D } from "three";

export type InstanceSpec = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
};

const dummy = new Object3D();
const color = new Color();

/**
 * Generic instanced mesh from a list of specs. Rebuilds matrices only when `items` changes identity,
 * so scenes should memoise static layouts and pass new arrays only for animated sets.
 */
export function Instances({
  geometry,
  material,
  items,
  castShadow = false,
  receiveShadow = false,
}: {
  geometry: BufferGeometry;
  material: Material;
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
      if (it.color) mesh.setColorAt(i, color.set(it.color));
    });
    mesh.count = items.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh
      key={capacity}
      ref={ref}
      args={[geometry, material, capacity]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
    />
  );
}

