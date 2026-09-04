// =============================================================================
// EXPERIMENTO #02 — Pingu Voxel Cretácico: Gran Mundo 3D & WebGL
// Mejoras Clave:
//   1. MOVIMIENTO OMNIDIRECCIONAL Y RELATIVO A LA CÁMARA:
//      - Movimiento 360° fluido en todas direcciones (diagonal, frente, lados, atrás).
//      - Orientado relativo a la rotación orbital de la cámara (W siempre avanza hacia donde miras).
//      - Giro angular suave (slerp/lerp) con cinemática pulida.
//   2. CORRECCIÓN DE PAISAJE Y AGUA:
//      - Árboles y helechos reubicados estrictamente en tierra fértil (cero árboles en el lago).
//   3. CORDILLERA DE MONTAÑAS Y VOLCANES EN LOS BORDES:
//      - Perímetro rodeado de picos rocosos, montañas cretácicas y cráteres volcánicos.
//      - Volcán activo con cráter de magma incandescente, ríos de lava y partículas de ceniza/humo animadas.
//      - Detección precisa de altura para que Pingu siempre camine exactamente sobre la superficie.
// =============================================================================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import { 
  RotateCcw, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Compass,
  Boxes,
  Flame
} from 'lucide-react';

export const PinguVoxelCretaceous: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const [currentAction, setCurrentAction] = useState<'IDLE' | 'WALK' | 'JUMP' | 'DANCE'>('IDLE');
  const [voxelCount, setVoxelCount] = useState<number>(0);

  const onTelemetryUpdateRef = useRef(onTelemetryUpdate);
  useEffect(() => {
    onTelemetryUpdateRef.current = onTelemetryUpdate;
  }, [onTelemetryUpdate]);

  const stateRef = useRef<{
    pinguGroup: THREE.Group | null;
    leftLeg: THREE.Group | null;
    rightLeg: THREE.Group | null;
    leftWing: THREE.Group | null;
    rightWing: THREE.Group | null;
    tail: THREE.Group | null;
    waterCubes: THREE.Mesh[];
    waterInitialY: number[];
    smokeParticles: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; offset: number }[];
    matLava: THREE.MeshBasicMaterial | null;
    matLavaGlow: THREE.MeshBasicMaterial | null;
    posX: number;
    posZ: number;
    jumpOffset: number;
    velY: number;
    isJumping: boolean;
    rotationY: number;
    action: 'IDLE' | 'WALK' | 'JUMP' | 'DANCE';
    keys: Record<string, boolean>;
    cameraAngle: { theta: number; phi: number; radius: number };
    isDragging: boolean;
    prevMouse: { x: number; y: number };
  }>({
    pinguGroup: null,
    leftLeg: null,
    rightLeg: null,
    leftWing: null,
    rightWing: null,
    tail: null,
    waterCubes: [],
    waterInitialY: [],
    smokeParticles: [],
    matLava: null,
    matLavaGlow: null,
    posX: 0,
    posZ: 0,
    jumpOffset: 0,
    velY: 0,
    isJumping: false,
    rotationY: 0,
    action: 'IDLE',
    keys: {},
    cameraAngle: { theta: Math.PI / 4, phi: Math.PI / 3.4, radius: 24 },
    isDragging: false,
    prevMouse: { x: 0, y: 0 }
  });

  const emitTelemetry = useCallback((actionName: string, x: number, z: number, totalVoxels: number) => {
    onTelemetryUpdateRef.current?.({
      renderTime: 0.16,
      eventName: `Cretácico Voxel: ${actionName} @ (${x.toFixed(1)}, ${z.toFixed(1)})`,
      customMetrics: [
        { label: 'Acción', value: actionName, color: actionName === 'DANCE' ? 'text-amber-400' : 'text-emerald-400' },
        { label: 'Posición', value: `X:${x.toFixed(1)} Z:${z.toFixed(1)}`, color: 'text-blue-400' },
        { label: 'Micro-Cubos', value: `${totalVoxels} voxels`, color: 'text-purple-400' }
      ]
    });
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Limpieza estricta del contenedor para evitar canvas duplicados o imágenes congeladas
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x93c5fd);
    scene.fog = new THREE.FogExp2(0x93c5fd, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    sunLight.position.set(28, 48, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 130;
    sunLight.shadow.camera.left = -32;
    sunLight.shadow.camera.right = 32;
    sunLight.shadow.camera.top = 32;
    sunLight.shadow.camera.bottom = -32;
    scene.add(sunLight);

    const volcanoLight = new THREE.PointLight(0xff5722, 2.5, 30);
    volcanoLight.position.set(0, 9 * 0.5, -19 * 0.5);
    scene.add(volcanoLight);

    let totalBlocks = 0;

    const matGrass = new THREE.MeshLambertMaterial({ color: 0x4ade80 });
    const matGrassDark = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const matDirt = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const matSand = new THREE.MeshLambertMaterial({ color: 0xfde047 });
    const matStone = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const matDarkRock = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const matBasalt = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const matLava = new THREE.MeshBasicMaterial({ color: 0xff3800 });
    const matLavaGlow = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const matSmoke = new THREE.MeshLambertMaterial({ color: 0x64748b, transparent: true, opacity: 0.65 });
    const matWood = new THREE.MeshLambertMaterial({ color: 0x543310 });
    const matLeaves = new THREE.MeshLambertMaterial({ color: 0x15803d });
    
    // Materiales de Pingu y Pijama de Dinosaurio
    const matPajamaGreen = new THREE.MeshLambertMaterial({ color: 0x22c55e });
    const matPajamaDark = new THREE.MeshLambertMaterial({ color: 0x15803d });
    const matPajamaYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const matPajamaBelly = new THREE.MeshLambertMaterial({ color: 0xdcfce7 });
    const matPenguinBlack = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const matPenguinWhite = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const matPenguinEyePupil = new THREE.MeshLambertMaterial({ color: 0x09090b });
    const matPenguinBeak = new THREE.MeshLambertMaterial({ color: 0xf97316 });
    const matPenguinCheek = new THREE.MeshLambertMaterial({ color: 0xf472b6 });
    const matWater = new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.82 });
    
    stateRef.current.matLava = matLava;
    stateRef.current.matLavaGlow = matLavaGlow;

    const TV = 0.5;
    const terrainBoxGeo = new THREE.BoxGeometry(TV * 0.96, TV * 0.96, TV * 0.96);

    const addTerrainVoxel = (gx: number, gy: number, gz: number, mat: THREE.Material, parent: THREE.Object3D = scene) => {
      const mesh = new THREE.Mesh(terrainBoxGeo, mat);
      mesh.position.set(gx * TV, gy * TV, gz * TV);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      totalBlocks++;
      return mesh;
    };

    const PV = 0.075; 
    const pinguBoxGeo = new THREE.BoxGeometry(PV * 0.96, PV * 0.96, PV * 0.96);

    const addMicroVoxel = (gx: number, gy: number, gz: number, mat: THREE.Material, parent: THREE.Object3D) => {
      const mesh = new THREE.Mesh(pinguBoxGeo, mat);
      mesh.position.set(gx * PV, gy * PV, gz * PV);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      totalBlocks++;
      return mesh;
    };

    const isLakeGrid = (gx: number, gz: number): boolean => {
      const lx = gx - (-11);
      const lz = gz - 10;
      return (lx * lx) / 25 + (lz * lz) / 16 <= 1;
    };

    const getElevationGrid = (gx: number, gz: number): number => {
      const dist = Math.sqrt(gx * gx + gz * gz);
      if (dist > 25) return 0;
      if (isLakeGrid(gx, gz)) return 0;

      const distV1 = Math.sqrt((gx - 0) ** 2 + (gz - (-19)) ** 2);
      if (distV1 < 7.5) {
        if (distV1 < 2) return 5;
        return Math.min(8, Math.round(9 - distV1 * 1.05));
      }

      const distV2 = Math.sqrt((gx - 18) ** 2 + (gz - 3) ** 2);
      if (distV2 < 6.5) {
        if (distV2 < 1.5) return 4;
        return Math.min(7, Math.round(7.5 - distV2 * 1.1));
      }

      const distV3 = Math.sqrt((gx - (-19)) ** 2 + (gz - (-6)) ** 2);
      if (distV3 < 6) return Math.min(6, Math.round(6.5 - distV3 * 1.0));

      if (dist > 16) {
        const angle = Math.atan2(gz, gx);
        const jagged = Math.sin(angle * 6) * 1.2 + Math.cos(angle * 11) * 0.9;
        const mountainHeight = (dist - 16) * 0.75 + jagged;
        return Math.max(1, Math.min(6, Math.round(mountainHeight)));
      }

      const distHill = Math.sqrt((gx - 9) ** 2 + (gz - (-6)) ** 2);
      if (distHill < 4.5) return Math.max(0, Math.round(2.5 - distHill * 0.6));
      return 0;
    };

    const getTerrainHeightWorld = (wx: number, wz: number): number => {
      const gx = Math.round(wx / TV);
      const gz = Math.round(wz / TV);
      const elev = getElevationGrid(gx, gz);
      return elev * TV + TV * 0.5;
    };

    const terrainRadius = 24;
    const waterCubesList: THREE.Mesh[] = [];
    const waterInitialYList: number[] = [];

    for (let x = -terrainRadius; x <= terrainRadius; x++) {
      for (let z = -terrainRadius; z <= terrainRadius; z++) {
        const dist = Math.sqrt(x * x + z * z);
        if (dist > terrainRadius) continue;
        const isLake = isLakeGrid(x, z);

        if (isLake) {
          addTerrainVoxel(x, -2, z, matSand);
          addTerrainVoxel(x, -1, z, matSand);
          const wMesh = addTerrainVoxel(x, 0, z, matWater);
          waterCubesList.push(wMesh);
          waterInitialYList.push(wMesh.position.y);
        } else {
          const height = getElevationGrid(x, z);
          addTerrainVoxel(x, -2, z, matDirt);
          addTerrainVoxel(x, -1, z, matDirt);
          const distV1 = Math.sqrt((x - 0) ** 2 + (z - (-19)) ** 2);
          const distV2 = Math.sqrt((x - 18) ** 2 + (z - 3) ** 2);
          const isVolcano = distV1 < 7.5 || distV2 < 6.5;

          for (let y = 0; y <= height; y++) {
            const isTop = (y === height);
            let voxelMat: THREE.Material = matDirt;
            if (isVolcano) {
              if (distV1 < 2 && y === height) voxelMat = ((x + z) % 2 === 0) ? matLava : matLavaGlow;
              else if (distV1 < 3.5 && z > -19 && y >= 3 && y < height) voxelMat = matLava;
              else if (isTop) voxelMat = height >= 6 ? matBasalt : matDarkRock;
              else voxelMat = matDarkRock;
            } else if (height >= 3) voxelMat = isTop ? (height >= 5 ? matStone : matDarkRock) : matDarkRock;
            else if (height >= 1) voxelMat = isTop ? ((x + z) % 2 === 0 ? matGrassDark : matStone) : matDirt;
            else voxelMat = isTop ? (((x + z) % 2 === 0) ? matGrass : matGrassDark) : matDirt;
            addTerrainVoxel(x, y, z, voxelMat);
          }
        }
      }
    }

    stateRef.current.waterCubes = waterCubesList;
    stateRef.current.waterInitialY = waterInitialYList;

    const smokeParticlesList: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; offset: number }[] = [];
    const smokeGeo = new THREE.BoxGeometry(TV * 0.7, TV * 0.7, TV * 0.7);
    for (let i = 0; i < 7; i++) {
      const sMesh = new THREE.Mesh(smokeGeo, matSmoke);
      const angle = (i / 7) * Math.PI * 2;
      const r = Math.random() * 0.8;
      const basePos = new THREE.Vector3(0 + Math.cos(angle) * r, 6 * TV, -19 * TV + Math.sin(angle) * r);
      sMesh.position.copy(basePos);
      scene.add(sMesh);
      smokeParticlesList.push({ mesh: sMesh, basePos, speed: 1.2 + Math.random() * 0.8, offset: i * 0.9 });
    }
    stateRef.current.smokeParticles = smokeParticlesList;

    const buildVoxelPalm = (rootX: number, rootZ: number, trunkHeight: number) => {
      if (isLakeGrid(rootX, rootZ)) return;
      const groundY = getElevationGrid(rootX, rootZ);
      for (let y = 1; y <= trunkHeight; y++) addTerrainVoxel(rootX, groundY + y, rootZ, matWood);
      const ty = groundY + trunkHeight + 1;
      addTerrainVoxel(rootX, ty, rootZ, matLeaves);
      for (let i = 1; i <= 3; i++) {
        addTerrainVoxel(rootX + i, ty - (i === 3 ? 1 : 0), rootZ, matLeaves);
        addTerrainVoxel(rootX - i, ty - (i === 3 ? 1 : 0), rootZ, matLeaves);
        addTerrainVoxel(rootX, ty - (i === 3 ? 1 : 0), rootZ + i, matLeaves);
        addTerrainVoxel(rootX, ty - (i === 3 ? 1 : 0), rootZ - i, matLeaves);
      }
      addTerrainVoxel(rootX + 1, ty, rootZ + 1, matLeaves);
      addTerrainVoxel(rootX - 1, ty, rootZ + 1, matLeaves);
      addTerrainVoxel(rootX + 1, ty, rootZ - 1, matLeaves);
      addTerrainVoxel(rootX - 1, ty, rootZ - 1, matLeaves);
    };

    buildVoxelPalm(10, 10, 8);
    buildVoxelPalm(-8, -8, 8);
    buildVoxelPalm(13, -8, 7);
    buildVoxelPalm(-4, 15, 8);
    buildVoxelPalm(6, -12, 7);
    buildVoxelPalm(-12, -2, 8);
    buildVoxelPalm(4, 15, 6);

    const buildFern = (fx: number, fz: number) => {
      if (isLakeGrid(fx, fz)) return;
      const fy = getElevationGrid(fx, fz);
      addTerrainVoxel(fx, fy + 1, fz, matGrassDark);
      addTerrainVoxel(fx + 1, fy + 1, fz, matLeaves);
      addTerrainVoxel(fx - 1, fy + 1, fz, matLeaves);
      addTerrainVoxel(fx, fy + 1, fz + 1, matLeaves);
      addTerrainVoxel(fx, fy + 1, fz - 1, matLeaves);
    };

    buildFern(4, 4); buildFern(-4, -4); buildFern(8, -2); buildFern(-6, 3);
    buildFern(2, -8); buildFern(8, 12); buildFern(-3, 8);

    // =========================================================================
    // MODELADO DE PINU VOXEL CON PIJAMA DE DINOSAURIO (KIGURUMI & OJOS ADORABLES)
    // Se eliminó el dinosaurio de la escena a petición del usuario.
    // =========================================================================
    const pinguRoot = new THREE.Group();
    const pinguBody = new THREE.Group();
    pinguRoot.add(pinguBody);
    const legOffsetY = 1;

    // 1. Tronco del cuerpo cubierto con la pijama verde de dinosaurio
    for (let y = 3; y <= 10; y++) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          // Pancita del kigurumi en verde menta suave pastel al frente
          const isBelly = (z === 2 && y >= 4 && y <= 9 && Math.abs(x) <= 1);
          addMicroVoxel(x, y + legOffsetY, z, isBelly ? matPajamaBelly : matPajamaGreen, pinguBody);
        }
      }
    }

    // Espinas dorsales de dinosaurio en la espalda (amarillas)
    for (let y = 4; y <= 10; y += 2) {
      addMicroVoxel(0, y + legOffsetY, -3, matPajamaYellow, pinguBody);
      addMicroVoxel(0, y + legOffsetY, -4, matPajamaYellow, pinguBody);
    }

    // 2. Cabeza y Capucha de Dinosaurio
    // La capucha cubre la parte posterior (z <= 0), los laterales (Math.abs(x) >= 2) y arriba (y >= 15)
    for (let y = 11; y <= 16; y++) {
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 2; z++) {
          const isOuterBack = z <= -1;
          const isOuterSide = Math.abs(x) === 3;
          const isOuterTop = y === 16;
          
          if (isOuterBack || isOuterSide || isOuterTop) {
            // Capucha de dinosaurio verde
            addMicroVoxel(x, y + legOffsetY, z, matPajamaGreen, pinguBody);
          } else {
            // Interior: Cabeza negra de Pingu dentro de la capucha
            if (z >= 0 && Math.abs(x) <= 2) {
              addMicroVoxel(x, y + legOffsetY, z, matPenguinBlack, pinguBody);
            }
          }
        }
      }
    }

    // Cúpula superior de la capucha (y = 17)
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 1; z++) {
        addMicroVoxel(x, 17 + legOffsetY, z, matPajamaGreen, pinguBody);
      }
    }

    // Crestas / Cuernos de dinosaurio sobre la capucha (amarillos)
    addMicroVoxel(0, 17 + legOffsetY, -2, matPajamaYellow, pinguBody);
    addMicroVoxel(0, 17 + legOffsetY, -1, matPajamaYellow, pinguBody);
    addMicroVoxel(0, 17 + legOffsetY, 0, matPajamaYellow, pinguBody);
    addMicroVoxel(0, 17 + legOffsetY, 1, matPajamaYellow, pinguBody);
    addMicroVoxel(0, 18 + legOffsetY, -1, matPajamaYellow, pinguBody);
    addMicroVoxel(0, 18 + legOffsetY, 0, matPajamaYellow, pinguBody);

    // Visera / ceja de la capucha en z = 2, y = 16
    for (let x = -2; x <= 2; x++) {
      addMicroVoxel(x, 16 + legOffsetY, 2, matPajamaDark, pinguBody);
    }

    // 3. CARA DE PINGU: OJOS CLAROS Y ADORABLES, PICO Y MEJILLAS
    // Los ojos en z = 3 (resaltados hacia adelante, ultra nítidos y simétricos)
    // Ojo Izquierdo (x = -2 y -1, y = 13 y 14)
    addMicroVoxel(-2, 14 + legOffsetY, 3, matPenguinWhite, pinguBody); // Blanco brillo superior
    addMicroVoxel(-1, 14 + legOffsetY, 3, matPenguinWhite, pinguBody); // Blanco superior
    addMicroVoxel(-2, 13 + legOffsetY, 3, matPenguinWhite, pinguBody); // Blanco inferior
    addMicroVoxel(-1, 13 + legOffsetY, 3, matPenguinEyePupil, pinguBody); // Pupila negra centrada

    // Ojo Derecho (x = 1 y 2, y = 13 y 14)
    addMicroVoxel(1, 14 + legOffsetY, 3, matPenguinWhite, pinguBody);  // Blanco superior
    addMicroVoxel(2, 14 + legOffsetY, 3, matPenguinWhite, pinguBody);  // Blanco brillo superior
    addMicroVoxel(1, 13 + legOffsetY, 3, matPenguinEyePupil, pinguBody); // Pupila negra centrada
    addMicroVoxel(2, 13 + legOffsetY, 3, matPenguinWhite, pinguBody);  // Blanco inferior

    // Pico clásico redondeado de Pingu en naranja (y = 12 y 13, proyectado en z = 3 y 4)
    addMicroVoxel(0, 12 + legOffsetY, 3, matPenguinBeak, pinguBody);
    addMicroVoxel(0, 12 + legOffsetY, 4, matPenguinBeak, pinguBody);
    addMicroVoxel(0, 13 + legOffsetY, 3, matPenguinBeak, pinguBody);
    addMicroVoxel(0, 13 + legOffsetY, 4, matPenguinBeak, pinguBody);
    addMicroVoxel(-1, 12 + legOffsetY, 3, matPenguinBeak, pinguBody);
    addMicroVoxel(1, 12 + legOffsetY, 3, matPenguinBeak, pinguBody);

    // Mejillas tiernas sonrosadas (y = 12)
    addMicroVoxel(-2, 12 + legOffsetY, 3, matPenguinCheek, pinguBody);
    addMicroVoxel(2, 12 + legOffsetY, 3, matPenguinCheek, pinguBody);

    // 4. ALAS / MANGAS DE LA PIJAMA
    const leftWingGroup = new THREE.Group();
    leftWingGroup.position.set(-3.2 * PV, (8 + legOffsetY) * PV, 0);
    for (let y = -3; y <= 0; y++) {
      for (let z = -1; z <= 1; z++) {
        addMicroVoxel(0, y, z, matPajamaGreen, leftWingGroup);
      }
    }
    addMicroVoxel(0, -4, 0, matPenguinBlack, leftWingGroup);
    pinguRoot.add(leftWingGroup);
    stateRef.current.leftWing = leftWingGroup;

    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(3.2 * PV, (8 + legOffsetY) * PV, 0);
    for (let y = -3; y <= 0; y++) {
      for (let z = -1; z <= 1; z++) {
        addMicroVoxel(0, y, z, matPajamaGreen, rightWingGroup);
      }
    }
    addMicroVoxel(0, -4, 0, matPenguinBlack, rightWingGroup);
    pinguRoot.add(rightWingGroup);
    stateRef.current.rightWing = rightWingGroup;

    // 5. COLA DE DINOSAURIO
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, (4 + legOffsetY) * PV, -2.5 * PV);
    addMicroVoxel(0, 0, -1, matPajamaGreen, tailGroup);
    addMicroVoxel(-1, 0, -1, matPajamaGreen, tailGroup);
    addMicroVoxel(1, 0, -1, matPajamaGreen, tailGroup);
    addMicroVoxel(0, 0, -2, matPajamaGreen, tailGroup);
    addMicroVoxel(0, 1, -2, matPajamaYellow, tailGroup);
    addMicroVoxel(0, 1, -3, matPajamaGreen, tailGroup);
    addMicroVoxel(0, 2, -3, matPajamaYellow, tailGroup);
    pinguRoot.add(tailGroup);
    stateRef.current.tail = tailGroup;

    // 6. PATITAS DE PINGÜINO
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-1.5 * PV, (2 + legOffsetY) * PV, 0);
    addMicroVoxel(0, -1, 0, matPenguinBeak, leftLegGroup);
    addMicroVoxel(0, -2, 0, matPenguinBeak, leftLegGroup);
    addMicroVoxel(0, -2, 1, matPenguinBeak, leftLegGroup);
    addMicroVoxel(-1, -2, 1, matPenguinBeak, leftLegGroup);
    addMicroVoxel(1, -2, 1, matPenguinBeak, leftLegGroup);
    pinguRoot.add(leftLegGroup);
    stateRef.current.leftLeg = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(1.5 * PV, (2 + legOffsetY) * PV, 0);
    addMicroVoxel(0, -1, 0, matPenguinBeak, rightLegGroup);
    addMicroVoxel(0, -2, 0, matPenguinBeak, rightLegGroup);
    addMicroVoxel(0, -2, 1, matPenguinBeak, rightLegGroup);
    addMicroVoxel(-1, -2, 1, matPenguinBeak, rightLegGroup);
    addMicroVoxel(1, -2, 1, matPenguinBeak, rightLegGroup);
    pinguRoot.add(rightLegGroup);
    stateRef.current.rightLeg = rightLegGroup;

    const initialGroundY = getTerrainHeightWorld(0, 0);
    pinguRoot.position.set(0, initialGroundY, 0);
    scene.add(pinguRoot);
    stateRef.current.pinguGroup = pinguRoot;
    setVoxelCount(totalBlocks);

    const handleMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.prevMouse.x;
      const dy = e.clientY - stateRef.current.prevMouse.y;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
      stateRef.current.cameraAngle.theta -= dx * 0.007;
      stateRef.current.cameraAngle.phi = Math.max(0.12, Math.min(Math.PI / 2.05, stateRef.current.cameraAngle.phi - dy * 0.007));
    };
    const handleMouseUp = () => { stateRef.current.isDragging = false; };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.cameraAngle.radius = Math.max(10, Math.min(52, stateRef.current.cameraAngle.radius + e.deltaY * 0.03));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      stateRef.current.keys[key] = true;
      if (key === ' ' || key === 'space') { e.preventDefault(); triggerJump(); }
      else if (key === 'b') triggerDance();
    };
    const handleKeyUp = (e: KeyboardEvent) => { stateRef.current.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      const state = stateRef.current;

      for (let i = 0; i < state.waterCubes.length; i++) {
        const cube = state.waterCubes[i];
        cube.position.y = state.waterInitialY[i] + Math.sin(time * 3 + cube.position.x * 1.5 + cube.position.z * 1.5) * 0.06;
      }

      if (state.matLava && state.matLavaGlow) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 4.5);
        state.matLava.color.setRGB(1.0, 0.15 + pulse * 0.2, 0.0);
        state.matLavaGlow.color.setRGB(1.0, 0.6 + pulse * 0.35, 0.05);
      }
      for (const s of state.smokeParticles) {
        const yProgress = (time * s.speed + s.offset) % 4.5;
        s.mesh.position.y = s.basePos.y + yProgress * TV;
        s.mesh.position.x = s.basePos.x + Math.sin(time * 2.5 + s.offset) * 0.35;
        s.mesh.position.z = s.basePos.z + Math.cos(time * 2.5 + s.offset) * 0.35;
        const scaleVal = 0.6 + yProgress * 0.25;
        s.mesh.scale.set(scaleVal, scaleVal, scaleVal);
      }
      // Se eliminó la animación del dinosaurio ya que fue retirado de la escena

      let isMoving = false;
      const speed = 7.8 * delta;
      let inputForward = 0, inputRight = 0;
      if (state.keys['w'] || state.keys['arrowup']) inputForward += 1;
      if (state.keys['s'] || state.keys['arrowdown']) inputForward -= 1;
      if (state.keys['a'] || state.keys['arrowleft']) inputRight -= 1;
      if (state.keys['d'] || state.keys['arrowright']) inputRight += 1;

      if (inputForward !== 0 || inputRight !== 0) {
        isMoving = true;
        const inputMag = Math.hypot(inputRight, inputForward);
        const normRight = inputRight / inputMag;
        const normForward = inputForward / inputMag;
        const camTheta = state.cameraAngle.theta;
        const fwdX = -Math.sin(camTheta), fwdZ = -Math.cos(camTheta);
        const rightX = Math.cos(camTheta), rightZ = -Math.sin(camTheta);
        const dirX = fwdX * normForward + rightX * normRight;
        const dirZ = fwdZ * normForward + rightZ * normRight;
        const targetRot = Math.atan2(dirX, dirZ);
        let diff = (targetRot - state.rotationY) % (Math.PI * 2);
        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;
        state.rotationY += diff * Math.min(1, 16 * delta);
        const nextX = state.posX + dirX * speed;
        const nextZ = state.posZ + dirZ * speed;
        const maxRadius = (terrainRadius - 3.2) * TV;
        const currentDist = Math.hypot(nextX, nextZ);
        if (currentDist <= maxRadius) { state.posX = nextX; state.posZ = nextZ; }
        else { state.posX = (nextX / currentDist) * maxRadius; state.posZ = (nextZ / currentDist) * maxRadius; }
        if (!state.isJumping && state.action !== 'DANCE') { state.action = 'WALK'; setCurrentAction('WALK'); }
      } else if (!state.isJumping && state.action !== 'DANCE') { state.action = 'IDLE'; setCurrentAction('IDLE'); }

      if (state.isJumping) {
        state.jumpOffset += state.velY * delta;
        state.velY -= 22 * delta;
        if (state.jumpOffset <= 0) { state.jumpOffset = 0; state.velY = 0; state.isJumping = false; state.action = 'IDLE'; setCurrentAction('IDLE'); }
      }

      const totalY = getTerrainHeightWorld(state.posX, state.posZ) + state.jumpOffset;
      if (state.pinguGroup) {
        state.pinguGroup.position.set(state.posX, totalY, state.posZ);
        state.pinguGroup.rotation.y = state.rotationY;
        if (state.action === 'WALK' && isMoving) {
          const walkCycle = Math.sin(time * 16);
          if (state.leftLeg) state.leftLeg.rotation.x = walkCycle * 0.7;
          if (state.rightLeg) state.rightLeg.rotation.x = -walkCycle * 0.7;
          if (state.leftWing) state.leftWing.rotation.z = 0.2 + Math.abs(walkCycle) * 0.4;
          if (state.rightWing) state.rightWing.rotation.z = -0.2 - Math.abs(walkCycle) * 0.4;
          if (state.tail) state.tail.rotation.y = Math.sin(time * 17) * 0.5;
        } else if (state.action === 'DANCE') {
          state.rotationY += 6.5 * delta;
          const danceCycle = Math.sin(time * 18);
          state.pinguGroup.position.y = totalY + Math.abs(Math.sin(time * 8)) * 0.5;
          if (state.leftWing) state.leftWing.rotation.z = 0.9 + danceCycle * 0.5;
          if (state.rightWing) state.rightWing.rotation.z = -0.9 - danceCycle * 0.5;
          if (state.tail) state.tail.rotation.y = Math.sin(time * 22) * 0.75;
          if (state.leftLeg) state.leftLeg.rotation.x = danceCycle * 0.5;
          if (state.rightLeg) state.rightLeg.rotation.x = -danceCycle * 0.5;
        } else {
          const breath = Math.sin(time * 3);
          state.pinguGroup.position.y = totalY + breath * 0.02;
          if (state.leftWing) state.leftWing.rotation.z = 0.15 + breath * 0.06;
          if (state.rightWing) state.rightWing.rotation.z = -0.15 - breath * 0.06;
        }
      }
      camera.position.set(state.posX + state.cameraAngle.radius * Math.sin(state.cameraAngle.phi) * Math.sin(state.cameraAngle.theta), totalY + state.cameraAngle.radius * Math.cos(state.cameraAngle.phi), state.posZ + state.cameraAngle.radius * Math.sin(state.cameraAngle.phi) * Math.cos(state.cameraAngle.theta));
      camera.lookAt(state.posX, totalY + 0.8, state.posZ);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [emitTelemetry]);

  const triggerJump = () => {
    if (!stateRef.current.isJumping) {
      stateRef.current.isJumping = true;
      stateRef.current.velY = 8.0;
      stateRef.current.action = 'JUMP';
      setCurrentAction('JUMP');
    }
  };

  const triggerDance = () => {
    stateRef.current.action = 'DANCE';
    setCurrentAction('DANCE');
    setTimeout(() => { if (stateRef.current.action === 'DANCE') { stateRef.current.action = 'IDLE'; setCurrentAction('IDLE'); } }, 4500);
  };

  const resetPosition = () => {
    stateRef.current.posX = 0;
    stateRef.current.posZ = 0;
    stateRef.current.jumpOffset = 0;
    stateRef.current.velY = 0;
    stateRef.current.rotationY = 0;
    stateRef.current.isJumping = false;
    stateRef.current.action = 'IDLE';
    setCurrentAction('IDLE');
    emitTelemetry('IDLE', 0, 0, voxelCount);
  };

  const pressKey = (key: string, isDown: boolean) => { stateRef.current.keys[key] = isDown; };

  return (
    <div className="w-full h-full flex flex-col space-y-3 font-mono text-fg select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs">
        <div className="flex items-center space-x-2 min-w-0">
          <Compass className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />
          <span className="font-bold tracking-wider uppercase text-[11px] sm:text-xs truncate">
            PINGU VOXEL // <span className="hidden sm:inline">VALLE CRETÁCICO 3D</span><span className="sm:hidden">3D</span>
          </span>
        </div>
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button 
            onClick={triggerDance} 
            onTouchStart={(e) => { e.stopPropagation(); triggerDance(); }}
            className="px-2 sm:px-2.5 py-1.5 border border-amber-500 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 active:scale-95 font-bold flex items-center space-x-1.5 transition-all text-[11px] touch-manipulation" 
            title="Pingu baila"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> <span>[ BAILAR ]</span>
          </button>
          <button 
            onClick={triggerJump} 
            onTouchStart={(e) => { e.stopPropagation(); triggerJump(); }}
            className="px-2 sm:px-2.5 py-1.5 border border-emerald-500 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 active:scale-95 font-bold flex items-center space-x-1.5 transition-all text-[11px] touch-manipulation" 
            title="Saltar"
          >
            <ArrowUp className="w-3.5 h-3.5 shrink-0" /> <span>[ SALTAR ]</span>
          </button>
          <button 
            onClick={resetPosition} 
            onTouchStart={(e) => { e.stopPropagation(); resetPosition(); }}
            className="p-1.5 border border-border bg-bg-subtle hover:border-fg text-fg transition-all active:scale-95 touch-manipulation" 
            title="Reiniciar al centro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[460px] border border-border bg-slate-900 overflow-hidden shadow-inner group">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        <div className="absolute top-3 left-3 bg-bg/85 backdrop-blur-sm border border-border p-2 sm:p-2.5 text-[10px] sm:text-[11px] space-y-1 pointer-events-none max-w-[200px] sm:max-w-none">
          <div className="text-fg font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ESTADO: <strong className="text-emerald-400">{currentAction}</strong></span>
          </div>
          <div className="text-fg-subtle text-[10px] flex items-center space-x-1">
            <Boxes className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">CUBOS: <strong className="text-fg">{voxelCount}</strong></span>
          </div>
          <div className="text-amber-400 text-[10px] flex items-center space-x-1">
            <Flame className="w-3 h-3 shrink-0" />
            <span className="truncate">CORDILLERA VOLCÁNICA</span>
          </div>
          <div className="text-fg-muted text-[9px] pt-0.5 hidden sm:block">
            RATÓN: Arrastra para orbitar • Rueda para zoom
          </div>
        </div>

        {/* Botones de acción táctiles en esquina inferior izquierda — apilados verticalmente para ergonomía móvil */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-2 z-20">
          <button
            onClick={triggerDance}
            onTouchStart={(e) => { e.stopPropagation(); triggerDance(); }}
            className="px-3 py-2 border border-amber-500/90 bg-slate-950/90 backdrop-blur-sm text-amber-400 font-bold hover:bg-amber-500/20 active:scale-95 text-xs transition-all shadow-md flex items-center space-x-1.5 touch-manipulation select-none"
            title="Hacer bailar a Pingu"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>[ BAILAR ]</span>
          </button>
          <button
            onClick={triggerJump}
            onTouchStart={(e) => { e.stopPropagation(); triggerJump(); }}
            className="px-3 py-2 border border-emerald-500/90 bg-slate-950/90 backdrop-blur-sm text-emerald-400 font-bold hover:bg-emerald-500/20 active:scale-95 text-xs transition-all shadow-md flex items-center space-x-1.5 touch-manipulation select-none"
            title="Saltar"
          >
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>[ SALTAR ]</span>
          </button>
        </div>

        {/* D-Pad Virtual en pantalla para control táctil o ratón */}
        <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1 bg-bg/80 backdrop-blur-sm p-2 border border-border z-20">
          <button onMouseDown={() => pressKey('w', true)} onMouseUp={() => pressKey('w', false)} onTouchStart={() => pressKey('w', true)} onTouchEnd={() => pressKey('w', false)} className="p-2 border border-border bg-bg-subtle hover:border-fg text-fg active:bg-fg active:text-bg" title="Avanzar">
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            <button onMouseDown={() => pressKey('a', true)} onMouseUp={() => pressKey('a', false)} onTouchStart={() => pressKey('a', true)} onTouchEnd={() => pressKey('a', false)} className="p-2 border border-border bg-bg-subtle hover:border-fg text-fg active:bg-fg active:text-bg" title="Izquierda">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onMouseDown={() => pressKey('s', true)} onMouseUp={() => pressKey('s', false)} onTouchStart={() => pressKey('s', true)} onTouchEnd={() => pressKey('s', false)} className="p-2 border border-border bg-bg-subtle hover:border-fg text-fg active:bg-fg active:text-bg" title="Retroceder">
              <ArrowDown className="w-4 h-4" />
            </button>
            <button onMouseDown={() => pressKey('d', true)} onMouseUp={() => pressKey('d', false)} onTouchStart={() => pressKey('d', true)} onTouchEnd={() => pressKey('d', false)} className="p-2 border border-border bg-bg-subtle hover:border-fg text-fg active:bg-fg active:text-bg" title="Derecha">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-2.5 border border-border bg-bg-subtle flex flex-wrap items-center justify-between gap-2 text-[11px] text-fg-subtle">
        <div>• Mover 360°: <strong className="text-fg">[W, A, S, D] o Flechas</strong> (Relativo a la vista de la cámara)</div>
        <div>• Saltar: <strong className="text-fg">[Espacio]</strong></div>
        <div>• Baile Cretácico: <strong className="text-fg">[Tecla B]</strong></div>
        <div>• Orbitar Escenario: <strong className="text-fg">Arrastrar ratón</strong></div>
      </div>
    </div>
  );
};
