"use client";

import { useLayoutEffect, useRef } from "react";
import { Color, Object3D, type BufferGeometry, type InstancedMesh, type Material } from "three";

const dummy = new Object3D();
const tint = new Color();

/**
 * Fixed-capacity instanced mesh whose first `count` instances are laid out by `place` on every render.
 * Unlike the kit `Instances`, the buffer is never reallocated when the visible count changes, so growing
 * sets (sorts, sheets, markers) animate frame by frame without churn. `place` must be pure (time → transform).
 */
export function Batch({
  geometry,
  material,
  capacity,
  count = capacity,
  place,
  castShadow = false,
  receiveShadow = false,
}: {
  geometry: BufferGeometry;
  material: Material;
  capacity: number;
  count?: number;
  place: (i: number, o: Object3D, color: Color) => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  const n = Math.max(0, Math.min(capacity, Math.floor(count)));
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < n; i++) {
      dummy.position.set(0, 0, 0);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      tint.set("#ffffff");
      place(i, dummy, tint);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, tint);
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, Math.max(1, capacity)]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
      visible={n > 0}
    />
  );
}
