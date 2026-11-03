import * as THREE from 'three';

export function initHeroScene(container: HTMLElement) {
  if (!container || typeof window === 'undefined') return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 500;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 8.5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Group for all rotating 3D objects
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // 1. Central Geodesic Knowledge Core (Stable engineering nucleus)
  const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
  const coreWireframe = new THREE.WireframeGeometry(coreGeometry);
  const coreLineMaterial = new THREE.LineBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.65,
    linewidth: 1,
  });
  const coreMesh = new THREE.LineSegments(coreWireframe, coreLineMaterial);
  rootGroup.add(coreMesh);

  // Inner solid core with subtle dark refraction
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x0e1726,
    wireframe: false,
    transparent: true,
    opacity: 0.4,
  });
  const innerMesh = new THREE.Mesh(coreGeometry, innerMat);
  rootGroup.add(innerMesh);

  // 2. Multi-Agent Swarm (Orbiting knowledge nodes)
  const NODE_COUNT = 55;
  const nodes: { pos: THREE.Vector3; vel: THREE.Vector3; basePos: THREE.Vector3 }[] = [];
  const positions = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    // Distribute on spherical shells around the core
    const radius = 2.2 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const pos = new THREE.Vector3(x, y, z);
    nodes.push({
      pos: pos.clone(),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008
      ),
      basePos: pos.clone(),
    });

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  const nodesGeometry = new THREE.BufferGeometry();
  nodesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Node Points (Luminous agent vertices)
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 0.11,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const nodePoints = new THREE.Points(nodesGeometry, nodeMaterial);
  rootGroup.add(nodePoints);

  // 3. Dynamic Knowledge Transmission Lines (Proximity-based connections)
  const MAX_CONNECTIONS = 400;
  const linePositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  const lineColors = new Float32Array(MAX_CONNECTIONS * 2 * 3);

  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const linesMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
  rootGroup.add(linesMesh);

  // 4. Subtle Orbital Rings (Coordinate guides)
  const ringGeo = new THREE.RingGeometry(3.6, 3.63, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x1e3a8a,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.25,
  });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  rootGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.x = Math.PI / 6;
  rootGroup.add(ring2);

  // Lighting
  const blueLight = new THREE.PointLight(0x3b82f6, 3, 20);
  blueLight.position.set(5, 5, 5);
  scene.add(blueLight);

  const amberLight = new THREE.PointLight(0xf59e0b, 1.8, 15);
  amberLight.position.set(-5, -4, -2);
  scene.add(amberLight);

  // Mouse & Motion State
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let pulse = 0;

  const onMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouse.targetX = (e.clientX - cx) / (rect.width / 2);
    mouse.targetY = (e.clientY - cy) / (rect.height / 2);
  };

  const onPointerDown = () => {
    pulse = 1.0;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  container.addEventListener('pointerdown', onPointerDown);

  const onResize = () => {
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // Visibility optimization via IntersectionObserver
  let isVisible = true;
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(container);

  // Animation Loop
  let frameId: number;
  let time = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    if (!isVisible) return;

    time += 0.01;

    // Smooth mouse inertia tracking
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Continuous slow orbit + interactive tilt
    rootGroup.rotation.y = time * 0.15 + mouse.x * 0.45;
    rootGroup.rotation.x = THREE.MathUtils.clamp(-mouse.y * 0.35 + Math.sin(time * 0.2) * 0.08, -0.6, 0.6);

    coreMesh.rotation.y = -time * 0.2;
    coreMesh.rotation.z = time * 0.1;

    // Pulse decay from user click
    if (pulse > 0.001) {
      pulse *= 0.94;
    }

    // Update node positions and dynamic interconnections
    let lineIdx = 0;
    const posAttr = nodesGeometry.attributes.position as THREE.BufferAttribute;
    const linePosAttr = linesGeometry.attributes.position as THREE.BufferAttribute;
    const lineColAttr = linesGeometry.attributes.color as THREE.BufferAttribute;
    const linePosArr = linePosAttr.array as Float32Array;
    const lineColArr = lineColAttr.array as Float32Array;

    const CONNECT_DIST = 1.6 + pulse * 0.4;
    const coreScale = 1 + pulse * 0.18;
    coreMesh.scale.set(coreScale, coreScale, coreScale);

    for (let i = 0; i < NODE_COUNT; i++) {
      const node = nodes[i];
      // Subtle float motion
      node.pos.x = node.basePos.x + Math.sin(time + i * 1.5) * 0.12;
      node.pos.y = node.basePos.y + Math.cos(time * 0.9 + i) * 0.12;
      node.pos.z = node.basePos.z + Math.sin(time * 0.7 + i * 2) * 0.12;

      if (pulse > 0.01) {
        node.pos.addScaledVector(node.basePos, pulse * 0.08);
      }

      posAttr.setXYZ(i, node.pos.x, node.pos.y, node.pos.z);

      // Check distance to other nodes to form dynamic communication lines
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (lineIdx >= MAX_CONNECTIONS) break;
        const other = nodes[j];
        const dist = node.pos.distanceTo(other.pos);

        if (dist < CONNECT_DIST) {
          const alpha = 1.0 - dist / CONNECT_DIST;

          const pIdx = lineIdx * 6;
          linePosArr[pIdx] = node.pos.x;
          linePosArr[pIdx + 1] = node.pos.y;
          linePosArr[pIdx + 2] = node.pos.z;

          linePosArr[pIdx + 3] = other.pos.x;
          linePosArr[pIdx + 4] = other.pos.y;
          linePosArr[pIdx + 5] = other.pos.z;

          // Electric blue to cyan line gradient
          lineColArr[pIdx] = 0.23 * alpha;
          lineColArr[pIdx + 1] = 0.51 * alpha;
          lineColArr[pIdx + 2] = 0.96 * alpha;

          lineColArr[pIdx + 3] = 0.58 * alpha;
          lineColArr[pIdx + 4] = 0.77 * alpha;
          lineColArr[pIdx + 5] = 0.99 * alpha;

          lineIdx++;
        }
      }
    }

    posAttr.needsUpdate = true;
    linesGeometry.setDrawRange(0, lineIdx * 2);
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('resize', onResize);
    observer.disconnect();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
