import React, { useRef, useEffect, useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Activity,
  ShieldCheck,
  Globe2,
  Play,
  Pause,
  ArrowRight,
  Info,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export type ModelMode = 'KEYTRUDA_MAB' | 'GLOBAL_TOPOLOGY' | 'OZEMPIC_PEPTIDE' | 'EPI_DATAMATRIX';

interface Point3D {
  id: string;
  x: number;
  y: number;
  z: number;
  label?: string;
  subLabel?: string;
  color?: string;
  size?: number;
  category?: 'TARGET_BINDING' | 'SAFETY_SIGNAL' | 'REGULATORY_AUTHORITY' | 'STRUCTURE_CORE';
  clinicalNote?: string;
  linkedSection?: string;
}

export const Hero3DModel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelMode, setModelMode] = useState<ModelMode>('KEYTRUDA_MAB');
  const [isRotating, setIsRotating] = useState(true);
  const [isDeforming, setIsDeforming] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Point3D | null>(null);

  // Rotation angles in radians
  const rotRef = useRef({ x: 0.35, y: 0.45 });
  const mouseState = useRef({ isDown: false, lastX: 0, lastY: 0 });
  const zoomRef = useRef(1.0);
  const deformTickRef = useRef(0);

  // Mode information descriptors
  const modeMetadata: Record<
    ModelMode,
    { title: string; subtitle: string; tag: string; description: string }
  > = {
    KEYTRUDA_MAB: {
      title: 'Pembrolizumab (IgG4 mAb)',
      subtitle: 'PD-1 Immune Checkpoint Inhibitor',
      tag: 'Oncology Biological',
      description: 'Y-shaped monoclonal antibody targeting PD-1 receptor. Click nodes to inspect clinical binding domains and Section 4.4 hepatic safety triggers.',
    },
    GLOBAL_TOPOLOGY: {
      title: 'Global Regulatory Constellation',
      subtitle: 'Core CCDS Rev 15 ↔ Regional Orbit',
      tag: 'Global Architecture',
      description: '3D constellation topology showing real-time synchronization between Core CCDS Rev 15 and regional regulatory authorities (FDA, EMA, PMDA, MHRA, TGA).',
    },
    OZEMPIC_PEPTIDE: {
      title: 'Semaglutide GLP-1 Backbone',
      subtitle: 'Albumin-Affinity Peptide Helix',
      tag: 'Endocrinology / GLP-1',
      description: 'Alpha-helical peptide with C-18 fatty diacid chain for 168-hour half-life. Click nodes to inspect Section 4.2 Posology and Section 4.3 Contraindications.',
    },
    EPI_DATAMATRIX: {
      title: 'GS1 2D DataMatrix & ePI Lattice',
      subtitle: 'Cryptographic Pack-to-Portal Resolver',
      tag: 'Digital Packaging',
      description: 'Hyper-cube lattice representing physical package QR code resolution to live health authority digital FHIR SmPC leaflets without 404 dead-ends.',
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Generate 3D point cloud and bonds based on selected mode
    const generateStructure = (): { points: Point3D[]; bonds: [number, number][] } => {
      const points: Point3D[] = [];
      const bonds: [number, number][] = [];

      if (modelMode === 'KEYTRUDA_MAB') {
        const scale = 1.35;
        // Fc Stem (Constant region)
        for (let i = 0; i < 7; i++) {
          const y = (i - 3) * 20 * scale;
          points.push({
            id: `fc-${i}`,
            x: Math.sin(i * 0.8) * 8 * scale,
            y,
            z: Math.cos(i * 0.8) * 8 * scale,
            color: '#10B981',
            size: 4.5,
            label: i === 6 ? 'Fc Domain (Asn297)' : undefined,
            subLabel: i === 6 ? 'Effector Function Stability' : undefined,
            category: 'STRUCTURE_CORE',
            clinicalNote: 'Glycosylation at Asn297 ensures IgG4 structural stability and suppresses ADCC/CDC activation.',
            linkedSection: 'Section 11 Description & Formulation',
          });
          if (i > 0) bonds.push([i - 1, i]);
        }

        // Left Fab Arm (Targeting PD-1)
        const leftBase = points.length;
        for (let i = 0; i < 6; i++) {
          const t = (i + 1) * 16 * scale;
          const x = -t * 0.86;
          const y = -60 * scale - t * 0.5;
          const z = Math.sin(i) * 12 * scale;
          points.push({
            id: `fab-l-${i}`,
            x,
            y,
            z,
            color: i >= 4 ? '#D8F34E' : '#34D399',
            size: i >= 4 ? 6.5 : 4.5,
            label: i === 5 ? 'CDR3 Heavy Loop (PD-1 Target)' : undefined,
            subLabel: i === 5 ? 'Epitope Binding Domain' : undefined,
            category: 'TARGET_BINDING',
            clinicalNote: 'High-affinity sub-nanomolar binding to human PD-1, blocking PD-L1/PD-L2 coinhibitory pathways.',
            linkedSection: 'Section 12.1 Mechanism of Action',
          });
          if (i === 0) bonds.push([0, leftBase]);
          else bonds.push([leftBase + i - 1, leftBase + i]);
        }

        // Right Fab Arm (Active Safety Signal Anchor)
        const rightBase = points.length;
        for (let i = 0; i < 6; i++) {
          const t = (i + 1) * 16 * scale;
          const x = t * 0.86;
          const y = -60 * scale - t * 0.5;
          const z = Math.cos(i) * 12 * scale;
          points.push({
            id: `fab-r-${i}`,
            x,
            y,
            z,
            color: i === 5 ? '#F43F5E' : i >= 4 ? '#D8F34E' : '#34D399',
            size: i === 5 ? 7.5 : i >= 4 ? 6.5 : 4.5,
            label: i === 5 ? 'Hepatic Warning Hotspot' : undefined,
            subLabel: i === 5 ? '§4.4 / 5.1 AST/ALT Protocol' : undefined,
            category: 'SAFETY_SIGNAL',
            clinicalNote: 'Active CCDS Rev 15 mandate: Requires baseline AST/ALT before each infusion and permanent discontinuation for Grade 3/4 hepatitis.',
            linkedSection: 'Section 4.4 Special Warnings & Precautions',
          });
          if (i === 0) bonds.push([0, rightBase]);
          else bonds.push([rightBase + i - 1, rightBase + i]);
        }
      } else if (modelMode === 'GLOBAL_TOPOLOGY') {
        // Central Golden CCDS Core Node
        points.push({
          id: 'core-ccds',
          x: 0,
          y: 0,
          z: 0,
          color: '#D8F34E',
          size: 9.0,
          label: 'Core CCDS Rev 15 (Golden Source)',
          subLabel: 'Authoritative Origin Truth',
          category: 'STRUCTURE_CORE',
          clinicalNote: 'Company Core Data Sheet Rev 15: Established baseline transaminase monitoring and liver safety protocol.',
          linkedSection: 'Core Company Data Sheet (ICH E2C R2)',
        });

        // 6 Regional Satellite Authorities
        const satellites = [
          { name: 'US FDA SPL v15.0', concept: 'DailyMed XML', color: '#10B981', note: '100% Aligned with Core Rev 15 liver warning', section: 'Section 5.1 Warnings' },
          { name: 'EU EMA SmPC v9.1', concept: 'Type II Var Pending', color: '#F59E0B', note: 'CHMP Day 60 timetable currently lagging by 14 days', section: 'Section 4.4 Special Warnings' },
          { name: 'Japan PMDA Rev 8', concept: 'Tenpu Bunsho', color: '#3B82F6', note: 'Bilingual review of posology translation ongoing', section: 'Section 2 & 4 Precautions' },
          { name: 'UK MHRA v9.0', concept: 'Great Britain SmPC', color: '#10B981', note: 'Approved and published on MHRA portal', section: 'Section 4.4 SmPC' },
          { name: 'Health Canada Rev 11', concept: 'Product Monograph', color: '#10B981', note: 'Compliant with Core Rev 15 guidance', section: 'Part I Warnings & Precautions' },
          { name: 'Australia TGA v7.4', concept: 'PI Variation', color: '#F59E0B', note: 'Category 1 submission awaiting affiliate proof', section: 'Section 4.4 Precautions' },
        ];

        satellites.forEach((sat, idx) => {
          const angle = (idx / satellites.length) * Math.PI * 2;
          const radius = 95;
          const px = Math.cos(angle) * radius;
          const pz = Math.sin(angle) * radius;
          const py = Math.sin(idx * 1.5) * 25;

          const pIdx = points.length;
          points.push({
            id: `sat-${idx}`,
            x: px,
            y: py,
            z: pz,
            color: sat.color,
            size: 6.5,
            label: sat.name,
            subLabel: sat.concept,
            category: 'REGULATORY_AUTHORITY',
            clinicalNote: sat.note,
            linkedSection: sat.section,
          });

          // Connect satellite to core CCDS
          bonds.push([0, pIdx]);

          // Inter-satellite correlation links
          if (idx > 0) bonds.push([pIdx - 1, pIdx]);
          if (idx === satellites.length - 1) bonds.push([1, pIdx]);
        });
      } else if (modelMode === 'OZEMPIC_PEPTIDE') {
        const count = 30;
        for (let i = 0; i < count; i++) {
          const angle = i * 0.45;
          const y = (i - count / 2) * 8.5;
          const radius = 42;
          const isAlbuminSpacer = i === 15;
          const isBoxedWarning = i === 25;

          points.push({
            id: `pep-${i}`,
            x: Math.cos(angle) * radius,
            y,
            z: Math.sin(angle) * radius,
            color: isBoxedWarning ? '#F43F5E' : isAlbuminSpacer ? '#D8F34E' : i % 3 === 0 ? '#10B981' : '#34D399',
            size: isBoxedWarning || isAlbuminSpacer ? 7 : 4,
            label: isAlbuminSpacer ? 'Lys26 C-18 Diacid Spacer' : isBoxedWarning ? 'Thyroid C-Cell Receptor' : undefined,
            subLabel: isAlbuminSpacer ? '168-Hour Albumin Binding' : isBoxedWarning ? '§4.3 Boxed Warning' : undefined,
            category: isBoxedWarning ? 'SAFETY_SIGNAL' : isAlbuminSpacer ? 'TARGET_BINDING' : 'STRUCTURE_CORE',
            clinicalNote: isAlbuminSpacer
              ? 'Fatty diacid side chain provides strong albumin binding, extending elimination half-life for once-weekly dosing.'
              : isBoxedWarning
              ? 'Contraindicated in patients with personal or family history of medullary thyroid carcinoma (MTC) or MEN 2.'
              : 'Semaglutide 31-amino acid backbone with 94% sequence homology to native human GLP-1.',
            linkedSection: isAlbuminSpacer ? 'Section 4.2 Posology' : isBoxedWarning ? 'Section 4.3 Contraindications' : 'Section 5.1 Pharmacodynamics',
          });
          if (i > 0) bonds.push([i - 1, i]);
        }
      } else {
        // ePI 3D Holographic Cube & DataMatrix Lattice
        const size = 70;
        const corners = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        corners.forEach(([cx, cy, cz], idx) => {
          const isMainNode = idx === 0 || idx === 6;
          points.push({
            id: `epi-${idx}`,
            x: cx * size,
            y: cy * size,
            z: cz * size,
            color: isMainNode ? '#D8F34E' : '#6EE7B7',
            size: isMainNode ? 7.5 : 5,
            label: idx === 0 ? 'GS1 2D DataMatrix Hash' : idx === 6 ? 'FHIR ePI Digital Endpoint' : undefined,
            subLabel: idx === 0 ? 'Physical Pack Code' : idx === 6 ? 'Active Leaflet URL' : undefined,
            category: 'REGULATORY_AUTHORITY',
            clinicalNote: idx === 0
              ? 'Cryptographic package QR payload verified against Health Authority central resolver.'
              : 'Resolves to approved current SmPC leaf, preventing physical packs from opening superseded information.',
            linkedSection: 'ISO/IEC 16022 & GS1 Digital Link Standard',
          });
        });
        bonds.push(
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
          [0, 6], [1, 7]
        );
      }

      return { points, bonds };
    };

    const { points, bonds } = generateStructure();

    // Default select first meaningful node if none selected
    const initialLabeled = points.find((p) => p.label);
    if (initialLabeled && !selectedNode) {
      setSelectedNode(initialLabeled);
    }

    // Render loop
    const render = () => {
      if (isRotating && !mouseState.current.isDown) {
        rotRef.current.y += 0.006;
        rotRef.current.x += 0.0015;
      }

      if (isDeforming) {
        deformTickRef.current += 0.04;
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

      // Project points with deformation support
      const projected = points.map((p, idx) => {
        let px = p.x;
        let py = p.y;
        let pz = p.z;

        // Apply deformation wave if active
        if (isDeforming) {
          const wave = Math.sin(deformTickRef.current + idx * 0.4) * 8;
          px += wave;
          py += Math.cos(deformTickRef.current + idx * 0.3) * 6;
          pz += Math.sin(deformTickRef.current * 0.7 + idx) * 7;
        }

        // Rotate Y
        let x1 = px * cosY + pz * sinY;
        let z1 = -px * sinY + pz * cosY;

        // Rotate X
        let y2 = py * cosX - z1 * sinX;
        let z2 = py * sinX + z1 * cosX;

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

      // Draw Bonds / Coordinate Lines
      bonds.forEach(([idxA, idxB]) => {
        const pA = projected[idxA];
        const pB = projected[idxB];
        if (!pA || !pB) return;

        const avgDepth = (pA.depth + pB.depth) / 2;
        const alpha = Math.max(0.15, Math.min(0.85, (avgDepth + 130) / 260));

        ctx.beginPath();
        ctx.moveTo(pA.projX, pA.projY);
        ctx.lineTo(pB.projX, pB.projY);
        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 0.75})`;
        ctx.lineWidth = Math.max(1, 2.2 * pA.scale);
        ctx.stroke();
      });

      // Draw Nodes / Atoms
      projected.sort((a, b) => b.depth - a.depth);
      projected.forEach((p) => {
        const isSelected = selectedNode?.id === p.id;
        const radius = Math.max(2.5, (p.size || 4.5) * p.scale);
        const alpha = Math.max(0.25, Math.min(1.0, (p.depth + 130) / 260));

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          p.projX,
          p.projY,
          radius * 0.2,
          p.projX,
          p.projY,
          radius * (isSelected ? 3.5 : 2.5)
        );
        glowGradient.addColorStop(0, p.color || '#10B981');
        glowGradient.addColorStop(1, 'rgba(6, 32, 22, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius * (isSelected ? 3.5 : 2.5), 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color || '#10B981';
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Concentric pulse if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, radius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#D8F34E';
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }

        // Labeled hotspots
        if (p.label) {
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = isSelected ? '#FFFFFF' : '#D8F34E';
          ctx.fillText(p.label, p.projX + 12, p.projY + 3);

          if (p.subLabel) {
            ctx.font = '9px sans-serif';
            ctx.fillStyle = 'rgba(216, 243, 78, 0.75)';
            ctx.fillText(p.subLabel, p.projX + 12, p.projY + 14);
          }

          ctx.beginPath();
          ctx.arc(p.projX, p.projY, radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(216, 243, 78, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse Drag Rotation & Node Click Interaction
    const handleMouseDown = (e: MouseEvent) => {
      mouseState.current.isDown = true;
      mouseState.current.lastX = e.clientX;
      mouseState.current.lastY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseState.current.isDown) return;
      const dx = e.clientX - mouseState.current.lastX;
      const dy = e.clientY - mouseState.current.lastY;
      rotRef.current.y += dx * 0.007;
      rotRef.current.x += dy * 0.007;
      mouseState.current.lastX = e.clientX;
      mouseState.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseState.current.isDown = false;
    };

    const handleClickCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Find closest projected point
      const { points: latestPoints } = generateStructure();
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const fov = 380;
      const zoom = zoomRef.current;
      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);

      let closest: Point3D | null = null;
      let minDistance = 22; // Click radius threshold

      latestPoints.forEach((p) => {
        let x1 = p.x * cosY + p.z * sinY;
        let z1 = -p.x * sinY + p.z * cosY;
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;
        const scale = (fov / (fov + z2 * zoom)) * zoom;
        const projX = cx + x1 * scale;
        const projY = cy + y2 * scale;

        const dist = Math.hypot(mouseX - projX, mouseY - projY);
        if (dist < minDistance) {
          minDistance = dist;
          closest = p;
        }
      });

      if (closest) {
        setSelectedNode(closest);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClickCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClickCanvas);
    };
  }, [modelMode, isRotating, isDeforming, selectedNode]);

  const handleZoom = (delta: number) => {
    zoomRef.current = Math.max(0.6, Math.min(2.0, zoomRef.current + delta));
  };

  const handleResetCamera = () => {
    rotRef.current = { x: 0.35, y: 0.45 };
    zoomRef.current = 1.0;
  };

  const currentMeta = modeMetadata[modelMode];

  return (
    <div className="relative w-full rounded-3xl bg-[#03160e] border border-emerald-950/80 overflow-hidden shadow-2xl p-4 sm:p-6 text-white space-y-4">
      {/* Header Mode Selector & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D8F34E] animate-pulse" />
            <h3 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              {currentMeta.title}
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-[#D8F34E] border border-emerald-400/30">
                {currentMeta.tag}
              </span>
            </h3>
          </div>
          <p className="text-xs text-emerald-200/80 mt-0.5">{currentMeta.description}</p>
        </div>

        {/* 3D Action Tools */}
        <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setIsRotating((prev) => !prev)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              isRotating
                ? 'bg-emerald-500/20 text-[#D8F34E] border-emerald-400/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={isRotating ? 'Pause Rotation' : 'Resume Auto-Rotate'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden md:inline">{isRotating ? 'Pause' : 'Spin'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeforming((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              isDeforming
                ? 'bg-purple-500/30 text-purple-200 border-purple-400/50 shadow-sm'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Simulate Structural Conformation Wave / Variant Mutation Drift"
          >
            <Zap className={`w-3.5 h-3.5 ${isDeforming ? 'text-purple-400 animate-spin' : 'text-slate-400'}`} />
            <span className="text-[10px] font-bold">
              {isDeforming ? 'Deforming Shift' : 'Morph / Drift'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleZoom(0.15)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.15)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'KEYTRUDA_MAB', label: 'Pembrolizumab (mAb)', hint: 'PD-1 Checkpoint' },
          { id: 'GLOBAL_TOPOLOGY', label: 'Global Constellation', hint: 'CCDS ↔ Orbit' },
          { id: 'OZEMPIC_PEPTIDE', label: 'Semaglutide Peptide', hint: 'Albumin Spacer' },
          { id: 'EPI_DATAMATRIX', label: 'GS1 2D Hologram', hint: 'Pack-to-Portal' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setModelMode(tab.id as ModelMode);
              setSelectedNode(null);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              modelMode === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-emerald-100/70 border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[9px] opacity-70 font-mono hidden md:inline">({tab.hint})</span>
          </button>
        ))}
      </div>

      {/* Canvas Area & Interactive Node Telemetry HUD Card */}
      <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-radial from-[#082a1d] to-[#02100a] border border-emerald-950 flex items-center justify-center overflow-hidden">
        {/* Interactive HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={720}
          height={400}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Drag Hint Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none text-[10px] text-emerald-400/60 font-mono bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
          Click & Drag to rotate • Click nodes to inspect label binding
        </div>

        {/* Active Node Telemetry Card Overlay */}
        {selectedNode && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:max-w-sm bg-[#062016]/95 backdrop-blur-md border border-emerald-400/40 p-4 rounded-2xl shadow-2xl text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8F34E] font-mono flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#D8F34E]" />
                Selected Structure Node
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {selectedNode.category?.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-white">{selectedNode.label || selectedNode.id}</h4>
              {selectedNode.subLabel && (
                <p className="text-[11px] text-emerald-200/80 font-medium">{selectedNode.subLabel}</p>
              )}
            </div>

            <p className="text-[11px] text-emerald-100/90 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
              {selectedNode.clinicalNote || 'Active pharmacokinetic coordination node in the canonical label lifecycle graph.'}
            </p>

            <div className="pt-2 border-t border-emerald-950/80 flex items-center justify-between text-[11px]">
              <span className="text-emerald-300/80">
                Linked: <strong className="text-white">{selectedNode.linkedSection || 'CCDS Core Guidance'}</strong>
              </span>
              <span className="font-mono text-[#D8F34E] text-[10px]">Evidence Sealed</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Lineage Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-emerald-200/60 pt-1 border-t border-emerald-950/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D8F34E]" />
          <span>Biochemical Coordinate Mapping with Zero Generative Interpolation</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-300/80">
          Model: PRAMANEX CANON 3D Biological Topology v28.4
        </span>
      </div>
    </div>
  );
};
