import React, { useRef, useEffect, useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Activity,
  ShieldCheck
} from 'lucide-react';

type ModelMode = 'ANTIBODY_MAB' | 'GLP1_HELIX' | 'EPI_HOLOGRAM';

interface Point3D {
  x: number;
  y: number;
  z: number;
  label?: string;
  color?: string;
  size?: number;
}

export const Hero3DModel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelMode, setModelMode] = useState<ModelMode>('ANTIBODY_MAB');
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Rotation angles in radians
  const rotRef = useRef({ x: 0.3, y: 0.4 });
  const mouseState = useRef({ isDown: false, lastX: 0, lastY: 0 });
  const zoomRef = useRef(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Generate 3D point cloud based on modelMode
    const generatePoints = (): { points: Point3D[]; bonds: [number, number][] } => {
      const points: Point3D[] = [];
      const bonds: [number, number][] = [];

      if (modelMode === 'ANTIBODY_MAB') {
        // Y-shaped Monoclonal Antibody Fab/Fc structure
        const scale = 1.3;
        // Stem (Fc region)
        for (let i = 0; i < 7; i++) {
          const y = (i - 3) * 22 * scale;
          points.push({
            x: Math.sin(i * 0.8) * 8 * scale,
            y,
            z: Math.cos(i * 0.8) * 8 * scale,
            color: '#10B981',
            size: 4.5,
            label: i === 6 ? 'Fc Glycosylation Site (Asn297)' : undefined,
          });
          if (i > 0) bonds.push([i - 1, i]);
        }

        // Left Fab Arm
        const leftBase = points.length;
        for (let i = 0; i < 6; i++) {
          const t = (i + 1) * 16 * scale;
          const x = -t * 0.86;
          const y = -60 * scale - t * 0.5;
          const z = Math.sin(i) * 12 * scale;
          points.push({
            x,
            y,
            z,
            color: i >= 4 ? '#D8F34E' : '#34D399',
            size: i >= 4 ? 6 : 4,
            label: i === 5 ? 'CDR3 Heavy Binding Loop (PD-1 Target)' : undefined,
          });
          if (i === 0) bonds.push([0, leftBase]);
          else bonds.push([leftBase + i - 1, leftBase + i]);
        }

        // Right Fab Arm
        const rightBase = points.length;
        for (let i = 0; i < 6; i++) {
          const t = (i + 1) * 16 * scale;
          const x = t * 0.86;
          const y = -60 * scale - t * 0.5;
          const z = Math.cos(i) * 12 * scale;
          points.push({
            x,
            y,
            z,
            color: i >= 4 ? '#D8F34E' : '#34D399',
            size: i >= 4 ? 6 : 4,
            label: i === 5 ? 'CDR3 Light Binding Domain (Keytruda Epitope)' : undefined,
          });
          if (i === 0) bonds.push([0, rightBase]);
          else bonds.push([rightBase + i - 1, rightBase + i]);
        }
      } else if (modelMode === 'GLP1_HELIX') {
        // Double helix / coiled peptide backbone with side chain
        const count = 28;
        for (let i = 0; i < count; i++) {
          const angle = i * 0.45;
          const y = (i - count / 2) * 8;
          const radius = 38;
          points.push({
            x: Math.cos(angle) * radius,
            y,
            z: Math.sin(angle) * radius,
            color: i % 4 === 0 ? '#FBBF24' : '#10B981',
            size: 4.2,
            label: i === 14 ? 'Lys26 C-18 Diacid Spacer (Albumin Binder)' : undefined,
          });
          if (i > 0) bonds.push([i - 1, i]);
        }
      } else {
        // ePI 3D Holographic Cube & DataMatrix Lattice
        const size = 65;
        const corners = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        corners.forEach(([cx, cy, cz], idx) => {
          points.push({
            x: cx * size,
            y: cy * size,
            z: cz * size,
            color: '#6EE7B7',
            size: 5,
            label: idx === 0 ? 'GS1 2D DataMatrix Hash Corner' : undefined,
          });
        });
        bonds.push(
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        );
      }

      return { points, bonds };
    };

    const { points, bonds } = generatePoints();

    // Render loop
    const render = () => {
      if (isRotating && !mouseState.current.isDown) {
        rotRef.current.y += 0.007;
        rotRef.current.x += 0.002;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 380;
      const zoom = zoomRef.current;

      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);

      // Project points
      const projected = points.map((p) => {
        // Rotate Y
        let x1 = p.x * cosY + p.z * sinY;
        let z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Perspective
        const distance = fov + z2 * zoom;
        const scale = (fov / (distance || 1)) * zoom;
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;

        return {
          ...p,
          projX,
          projY,
          depth: z2,
          scale,
        };
      });

      // Draw Bonds / Lines with gradient glow
      bonds.forEach(([idxA, idxB]) => {
        const pA = projected[idxA];
        const pB = projected[idxB];
        if (!pA || !pB) return;

        const avgDepth = (pA.depth + pB.depth) / 2;
        const alpha = Math.max(0.15, Math.min(0.85, (avgDepth + 120) / 240));

        ctx.beginPath();
        ctx.moveTo(pA.projX, pA.projY);
        ctx.lineTo(pB.projX, pB.projY);
        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 0.7})`;
        ctx.lineWidth = Math.max(1, 2.2 * pA.scale);
        ctx.stroke();
      });

      // Draw Nodes / Atoms
      projected.sort((a, b) => b.depth - a.depth);
      projected.forEach((p) => {
        const radius = Math.max(2, (p.size || 4) * p.scale);
        const alpha = Math.max(0.2, Math.min(1.0, (p.depth + 120) / 240));

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          p.projX,
          p.projY,
          radius * 0.2,
          p.projX,
          p.projY,
          radius * 2.5
        );
        glowGradient.addColorStop(0, p.color || '#10B981');
        glowGradient.addColorStop(1, 'rgba(6, 32, 22, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color || '#10B981';
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Label if high priority
        if (p.label) {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#D8F34E';
          ctx.fillText(p.label, p.projX + 12, p.projY + 3);

          ctx.beginPath();
          ctx.arc(p.projX, p.projY, radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(216, 243, 78, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [modelMode, isRotating]);

  // Interactive mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseState.current.isDown = true;
    mouseState.current.lastX = e.clientX;
    mouseState.current.lastY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseState.current.isDown) return;
    const dx = e.clientX - mouseState.current.lastX;
    const dy = e.clientY - mouseState.current.lastY;
    rotRef.current.y += dx * 0.008;
    rotRef.current.x += dy * 0.008;
    mouseState.current.lastX = e.clientX;
    mouseState.current.lastY = e.clientY;
  };

  const handleMouseUp = () => {
    mouseState.current.isDown = false;
  };

  return (
    <div className="relative rounded-3xl bg-[#061B13] border border-emerald-900/60 p-4 shadow-2xl overflow-hidden text-white flex flex-col justify-between select-none">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 px-2 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D8F34E] animate-ping" />
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">
            3D Molecular & ePI Spatial Model
          </span>
        </div>

        {/* Model Selector Pills */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-[11px] font-semibold">
          <button
            onClick={() => setModelMode('ANTIBODY_MAB')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              modelMode === 'ANTIBODY_MAB'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            Pembrolizumab Fab
          </button>
          <button
            onClick={() => setModelMode('GLP1_HELIX')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              modelMode === 'GLP1_HELIX'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            Semaglutide GLP-1
          </button>
          <button
            onClick={() => setModelMode('EPI_HOLOGRAM')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              modelMode === 'EPI_HOLOGRAM'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            2D ePI Hologram
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        className="relative my-2 w-full h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={540}
          height={320}
          className="max-w-full h-auto"
        />

        {/* Floating coordinate helper */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-emerald-300">
          Interactive: Drag to Rotate 360° • Zoom: {(zoomRef.current * 100).toFixed(0)}%
        </div>

        {/* Rotation & Zoom buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => {
              zoomRef.current = Math.min(1.6, zoomRef.current + 0.15);
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              zoomRef.current = Math.max(0.6, zoomRef.current - 0.15);
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isRotating ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="pt-3 border-t border-emerald-950 flex items-center justify-between text-xs text-emerald-200/70 px-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Biologic Structural Alignment: Section 11 & Section 12 Mapped</span>
        </div>
        <span className="font-mono text-[10px] text-[#D8F34E]">Resolution: 1.8 Å</span>
      </div>
    </div>
  );
};
