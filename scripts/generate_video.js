import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const W = 1920;
const H = 1080;
const FPS = 30;
const TOTAL_FRAMES = 120; // 4 seconds loop
const FOV = 800;
const CX = W / 2 + 30; // slight artistic offset like in the video
const CY = H / 2 - 20;

const BG_COLOR = '#eaedeb';
const CUBE_SIZE = 360;

// Camera moves forward along Z by CUBE_SIZE over TOTAL_FRAMES
// Everything repeats with period CUBE_SIZE in Z, so frame 0 and frame TOTAL_FRAMES are identical!

// Define repeating feature distribution inside each grid block
const FEATURES = [
  // Big cubes at lattice points: (gx, gy, gz)
  // Cross clusters (plus shapes)
  { type: 'cross', gx: -1, gy: 0, gz: 0, size: 28 },
  { type: 'cross', gx: 0, gy: -1, gz: 1, size: 32 },
  { type: 'cross', gx: 1, gy: 0, gz: 0, size: 30 },
  { type: 'cross', gx: -1, gy: 1, gz: 2, size: 26 },
  
  // Solid node cubes at lattice corners
  { type: 'node_cube', gx: -1, gy: -1, gz: 0, size: 24 },
  { type: 'node_cube', gx: 0, gy: 0, gz: 0, size: 30 },
  { type: 'node_cube', gx: 1, gy: -1, gz: 0, size: 26 },
  { type: 'node_cube', gx: -1, gy: 1, gz: 1, size: 24 },
  { type: 'node_cube', gx: 1, gy: 1, gz: 1, size: 28 },
  { type: 'node_cube', gx: 0, gy: -1, gz: 2, size: 22 },
  { type: 'node_cube', gx: 0, gy: 1, gz: 0, size: 32 },
  { type: 'node_cube', gx: 2, gy: 0, gz: 1, size: 28 },
  { type: 'node_cube', gx: -2, gy: 0, gz: 2, size: 26 },
];

function project(x, y, z) {
  if (z <= 20) return null;
  const s = FOV / z;
  return [CX + x * s, CY + y * s, z];
}

function getDepthAlpha(z) {
  const zNear = 120;
  const zNearFade = 280;
  const zFarFade = 1800;
  const zFar = 2600;

  let a = 1;
  if (z < zNear) return 0;
  if (z < zNearFade) a *= (z - zNear) / (zNearFade - zNear);
  if (z > zFar) return 0;
  if (z > zFarFade) a *= (zFar - z) / (zFar - zFarFade);
  return Math.max(0, Math.min(1, a));
}

// Generate SVG string for a given frame index
function renderFrame(frameIdx) {
  const t = frameIdx / TOTAL_FRAMES;
  const camZ = t * CUBE_SIZE;

  const elements = []; // { z, svg }

  const minGX = -3;
  const maxGX = 3;
  const minGY = -2;
  const maxGY = 2;
  const minGZ = -1;
  const maxGZ = 7;

  // 1. Draw wireframe cubes
  for (let gx = minGX; gx <= maxGX; gx++) {
    for (let gy = minGY; gy <= maxGY; gy++) {
      for (let gz = minGZ; gz <= maxGZ; gz++) {
        const cx = gx * CUBE_SIZE;
        const cy = gy * CUBE_SIZE;
        const cz = gz * CUBE_SIZE - camZ;

        if (cz < 50 || cz > 2500) continue;

        const hs = CUBE_SIZE / 2;
        // 8 corners
        const corners = [
          [-hs, -hs, -hs],
          [ hs, -hs, -hs],
          [ hs,  hs, -hs],
          [-hs,  hs, -hs],
          [-hs, -hs,  hs],
          [ hs, -hs,  hs],
          [ hs,  hs,  hs],
          [-hs,  hs,  hs],
        ].map(([dx, dy, dz]) => project(cx + dx, cy + dy, cz + dz));

        // 12 edges
        const edges = [
          [0,1], [1,2], [2,3], [3,0], // back
          [4,5], [5,6], [6,7], [7,4], // front
          [0,4], [1,5], [2,6], [3,7], // connecting
        ];

        const alpha = getDepthAlpha(cz);
        if (alpha <= 0.01) continue;

        const strokeWidth = Math.max(0.7, Math.min(3.6, (FOV / cz) * 1.8));

        for (const [i, j] of edges) {
          const p1 = corners[i];
          const p2 = corners[j];
          if (!p1 || !p2) continue;

          // Cull edges entirely off-screen
          if (
            (p1[0] < -200 && p2[0] < -200) ||
            (p1[0] > W + 200 && p2[0] > W + 200) ||
            (p1[1] < -200 && p2[1] < -200) ||
            (p1[1] > H + 200 && p2[1] > H + 200)
          ) continue;

          const edgeZ = (p1[2] + p2[2]) / 2;
          elements.push({
            z: edgeZ,
            svg: `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="#3e444a" stroke-opacity="${alpha.toFixed(3)}" stroke-width="${strokeWidth.toFixed(2)}" stroke-linecap="round"/>`
          });
        }
      }
    }
  }

  // 2. Draw solid cubes and cross clusters
  for (let gz = minGZ; gz <= maxGZ; gz++) {
    for (const feat of FEATURES) {
      const cx = feat.gx * CUBE_SIZE;
      const cy = feat.gy * CUBE_SIZE;
      const cz = gz * CUBE_SIZE - camZ;

      if (cz < 60 || cz > 2500) continue;
      const alpha = getDepthAlpha(cz);
      if (alpha <= 0.01) continue;

      if (feat.type === 'node_cube') {
        drawSolidCube(cx, cy, cz, feat.size, alpha, elements);
      } else if (feat.type === 'cross') {
        // 3D plus/cross shape: center cube + 4 arms
        const s = feat.size;
        drawSolidCube(cx, cy, cz, s, alpha, elements);
        drawSolidCube(cx - s, cy, cz, s, alpha, elements);
        drawSolidCube(cx + s, cy, cz, s, alpha, elements);
        drawSolidCube(cx, cy - s, cz, s, alpha, elements);
        drawSolidCube(cx, cy + s, cz, s, alpha, elements);
      }
    }
  }

  // Sort from back to front (largest Z to smallest Z)
  elements.sort((a, b) => b.z - a.z);

  const body = elements.map(e => e.svg).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG_COLOR}"/>
  ${body}
</svg>`;
}

function drawSolidCube(cx, cy, cz, size, alpha, elements) {
  const hs = size / 2;
  const vertices = [
    [-hs, -hs, -hs], // 0
    [ hs, -hs, -hs], // 1
    [ hs,  hs, -hs], // 2
    [-hs,  hs, -hs], // 3
    [-hs, -hs,  hs], // 4
    [ hs, -hs,  hs], // 5
    [ hs,  hs,  hs], // 6
    [-hs,  hs,  hs], // 7
  ].map(([dx, dy, dz]) => project(cx + dx, cy + dy, cz + dz));

  // Check visibility
  if (vertices.some(v => v === null)) return;

  // Faces with shaded colors matching the uploaded architectural video
  const faces = [
    { pts: [4, 5, 6, 7], color: '#4a5159', name: 'front' }, // Front face
    { pts: [0, 1, 5, 4], color: '#68707a', name: 'top' },   // Top face (lighter)
    { pts: [1, 2, 6, 5], color: '#3b4148', name: 'right' }, // Right face (darker)
    { pts: [0, 4, 7, 3], color: '#565d66', name: 'left' },  // Left face
    { pts: [3, 7, 6, 2], color: '#2f343a', name: 'bottom' },// Bottom face
  ];

  for (const face of faces) {
    const pts = face.pts.map(i => vertices[i]);
    // Normal / backface test in screen space
    const v1x = pts[1][0] - pts[0][0];
    const v1y = pts[1][1] - pts[0][1];
    const v2x = pts[2][0] - pts[1][0];
    const v2y = pts[2][1] - pts[1][1];
    const cross = v1x * v2y - v1y * v2x;
    
    // Only render visible faces
    if (cross > 0) {
      const avgZ = pts.reduce((sum, p) => sum + p[2], 0) / 4;
      const pointsStr = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
      elements.push({
        z: avgZ,
        svg: `<polygon points="${pointsStr}" fill="${face.color}" fill-opacity="${alpha.toFixed(3)}" stroke="#282d32" stroke-opacity="${(alpha * 0.9).toFixed(3)}" stroke-width="0.8"/>`
      });
    }
  }
}

async function main() {
  const tmpDir = '/tmp/cube_frames';
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  console.log(`Rendering ${TOTAL_FRAMES} SVG frames for architectural 3D wireframe cube grid...`);
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const svg = renderFrame(i);
    const fname = path.join(tmpDir, `frame_${String(i).padStart(4, '0')}.svg`);
    fs.writeFileSync(fname, svg, 'utf8');
  }
  console.log('All SVG frames written successfully. Compiling MP4 with FFmpeg...');

  // Also save poster frame
  const posterSvg = path.join(tmpDir, 'frame_0000.svg');
  const posterDst = path.resolve('public/videos/login-bg-poster.jpg');
  
  // Convert poster frame to high-quality JPG
  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-y', '-i', posterSvg, '-q:v', '2', posterDst]);
    p.on('close', code => code === 0 ? resolve() : reject(new Error('Poster generation failed')));
  });
  console.log('Generated poster image at:', posterDst);

  // Compile seamless looping MP4 video
  const mp4Dst = path.resolve('public/videos/login-bg.mp4');
  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', [
      '-y',
      '-r', String(FPS),
      '-i', path.join(tmpDir, 'frame_%04d.svg'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '20',
      '-preset', 'fast',
      '-movflags', '+faststart',
      mp4Dst
    ]);
    p.stderr.on('data', d => process.stderr.write(d));
    p.on('close', code => code === 0 ? resolve() : reject(new Error('MP4 compilation failed with code ' + code)));
  });

  console.log('MP4 video generated successfully at:', mp4Dst);

  // Copy to dist/videos as well for production build
  const distDir = path.resolve('dist/videos');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(mp4Dst, path.join(distDir, 'login-bg.mp4'));
  fs.copyFileSync(posterDst, path.join(distDir, 'login-bg-poster.jpg'));
  console.log('Copied assets to dist/videos/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
