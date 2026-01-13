import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CellScene } from './Cell3D';

// --- ICONS ---
const Icons = {
    Analytics: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Triaging: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    Reporting: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )
};

const logos = ['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'MD Anderson', 'Sloan Kettering'];

// --- VISUAL EFFECTS ---

const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement?.offsetWidth || 300;
        canvas.height = canvas.parentElement?.offsetHeight || 300;

        const columns = Math.floor(canvas.width / 20);
        const drops: number[] = new Array(columns).fill(0);
        const chars = "10";

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 5, 16, 0.1)'; // Fade out
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#a855f7'; // Purple text
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen" />;
};

const RadarVisualizer = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Styles for Radar Animation */}
            <style>{`
                @keyframes spin-radar { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
                .animate-spin-radar { animation: spin-radar 3s linear infinite; }
                
                @keyframes reverse-spin-radar { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(-360deg); } 
                }
                .animate-reverse-spin-radar { animation: reverse-spin-radar 10s linear infinite; }
            `}</style>

            {/* Spinning Radar Beam */}
            <div className="absolute w-[280px] h-[280px] flex items-center justify-center animate-spin-radar">
                 {/* Explicit inline gradient to ensure reliable rendering */}
                 <div 
                    className="w-full h-full rounded-full blur-md"
                    style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(168,85,247,0.6) 360deg)' }}
                 />
            </div>
            
            {/* Outer Rings */}
            <div className="absolute w-[280px] h-[280px] rounded-full border border-purple-500/10" />
            <div className="absolute w-[200px] h-[200px] rounded-full border border-purple-500/30 border-dashed animate-reverse-spin-radar" />
            
            {/* Central Score */}
            <div className="relative z-10 flex flex-col items-center">
                <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">98.4%</span>
                <span className="text-xs text-purple-300 font-mono tracking-widest uppercase mt-1">Confidence</span>
            </div>

            {/* Scanning Dots */}
            <div className="absolute inset-0">
                <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-green-400 rounded-full animate-ping" />
                <div className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}} />
            </div>
            
            {/* List Overlay */}
            <div className="absolute bottom-8 left-8 right-8 font-mono text-[10px] text-purple-200/60 space-y-1">
                <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>MORPH_NUC_01</span>
                    <span className="text-green-400">DETECTED</span>
                </div>
                 <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>CHROMATIN_DENS</span>
                    <span className="text-green-400">ANALYZING...</span>
                </div>
                 <div className="flex justify-between">
                    <span>MITOSIS_RT</span>
                    <span className="text-purple-400">PENDING</span>
                </div>
            </div>
        </div>
    )
}

// --- SUB-COMPONENTS ---

const ComparisonSlider = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 sm:py-16 md:py-20">
             <div className="text-center mb-12">
                <h3 className="text-3xl font-medium text-white mb-4">Visible vs. Invisible</h3>
                <p className="text-gray-400">Drag to see how Auramix reveals hidden biomarkers.</p>
            </div>
            <div 
                ref={containerRef}
                className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden cursor-ew-resize border border-white/10 shadow-2xl select-none group"
                onMouseMove={handleMouseMove}
                onTouchMove={(e) => {
                    if (!containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                    setSliderPos((x / rect.width) * 100);
                }}
            >
                {/* 1. LEFT SIDE: Standard Stain (Grayscale) */}
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-50" />
                    <span className="absolute bottom-8 left-8 text-white/50 font-bold tracking-widest text-sm bg-black/50 px-3 py-1 rounded backdrop-blur">STANDARD STAIN</span>
                </div>

                {/* 2. RIGHT SIDE: AuraMix Heatmap (Revealed) */}
                <div 
                    className="absolute inset-0 bg-purple-900 flex items-center justify-center"
                    style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/80 via-pink-600/60 to-transparent mix-blend-overlay" />
                    
                    {/* SVG Hand-Drawn Annotations */}
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Sketchy Circle around Anomaly 1 */}
                            <path 
                                d="M 38 28 C 35 25, 45 20, 48 24 C 52 28, 48 35, 42 35 C 38 35, 36 32, 38 28" 
                                fill="none" 
                                stroke="#4ade80" 
                                strokeWidth="0.5" 
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
                            />
                            
                            {/* Sketchy Circle around Anomaly 2 (Main) */}
                            <path 
                                d="M 20 60 C 15 55, 25 50, 30 55 C 35 60, 30 70, 22 70 C 15 70, 15 65, 20 60" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="0.6" 
                                strokeDasharray="2 1"
                                className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"
                            />

                            {/* Hand Drawn Arrow */}
                            <path 
                                d="M 45 65 Q 55 65 60 55" 
                                fill="none" 
                                stroke="white" 
                                strokeWidth="0.4" 
                                markerEnd="url(#arrowhead)"
                                opacity="0.8"
                            />
                             <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                                </marker>
                            </defs>
                        </svg>

                        {/* Text Label for Annotation */}
                        <div className="absolute top-[50%] right-[30%] text-right">
                             <span className="font-handwriting text-white text-lg drop-shadow-md block -rotate-6">High Grade<br/>Anomaly</span>
                        </div>
                    </div>

                    <span className="absolute bottom-8 right-8 text-white font-bold tracking-widest text-sm bg-purple-600/50 px-3 py-1 rounded backdrop-blur border border-purple-400/30">AURAMIX HEATMAP</span>
                </div>

                {/* Slider Handle */}
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    style={{ left: `${sliderPos}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </div>
                </div>
            </div>
            {/* Handwriting font injection */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
                .font-handwriting { font-family: 'Caveat', cursive; }
            `}</style>
        </div>
    );
};

// 2. NEW CREATIVE ISOMETRIC DIAGRAM: The "Motherboard City" Pipeline
const IsometricIntegration = () => {
    return (
        <div className="w-full max-w-7xl mx-auto pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-8 md:pb-12 px-3 sm:px-5 lg:px-8 relative">
             <div className="text-center mb-10 relative z-10">
                <h3 className="text-3xl md:text-5xl font-medium text-white mb-6">Seamless Infrastructure</h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Built on a modular, event-driven architecture designed for infinite scalability and military-grade security.
                </p>
            </div>

            {/* Viewport for 3D - Reduced height from 800px to 600px */}
            <div className="relative w-full h-[360px] sm:h-[440px] md:h-[600px] perspective-[1500px] overflow-visible flex items-center justify-center -mt-10">
                
                {/* 3D World Container - Diagonal Isometric Rotation */}
                <div className="relative w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] md:w-[600px] md:h-[600px] transform-style-3d rotate-x-[55deg] rotate-z-[45deg] scale-[0.7] sm:scale-[0.8] md:scale-100 transition-transform duration-1000 group">

                    {/* --- GLOBAL GRID FLOOR --- */}
                    <div className="absolute inset-[-50%] w-[200%] h-[200%] bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:50px_50px] transform-style-3d translate-z-[-50px] opacity-30 mask-radial-fade" />
                    <div className="absolute inset-0 bg-purple-900/5 blur-3xl transform-style-3d translate-z-[-60px]" />


                    {/* =========================================================
                        MODULE 1: DATA INGESTION (Bottom Left)
                       ========================================================= */}
                    <div className="absolute bottom-10 left-10 w-[180px] h-[180px] transform-style-3d hover:translate-z-[20px] transition-transform duration-500">
                        
                        {/* Base Platform */}
                        <div className="absolute inset-0 bg-[#0f0a18] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center transform-style-3d">
                            <div className="w-full h-full bg-white/5 absolute inset-0 backdrop-blur-sm" />
                            {/* Input Docks */}
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-12 bg-gray-800 border-l border-white/20" />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-gray-800 border-b border-white/20" />
                        </div>

                        {/* Floating Icons/Labels for Inputs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-style-3d translate-z-[40px]">
                             <div className="transform -rotate-z-45 -rotate-x-55 text-center">
                                <div className="text-xs font-mono text-gray-400 mb-1">SOURCE_AGNOSTIC</div>
                                <div className="flex gap-2 justify-center">
                                    {['DICOM', 'HL7', 'S3'].map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-blue-900/50 border border-blue-500/30 rounded text-[8px] text-blue-200">{tag}</span>
                                    ))}
                                </div>
                             </div>
                        </div>
                        
                         {/* EXTRA INFO: Encryption Badge */}
                        <div className="absolute -left-12 -bottom-4 transform-style-3d translate-z-[50px] pointer-events-none">
                            <div className="bg-black/90 border border-gray-700/50 p-2 rounded backdrop-blur-md transform -rotate-z-45 -rotate-x-55 shadow-lg">
                               <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                                   <span className="text-[8px] text-gray-300 font-mono tracking-tight">AES-256 ENCRYPTION</span>
                               </div>
                            </div>
                        </div>

                        {/* Animated Particles Entering */}
                        <div className="absolute -left-20 top-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent to-blue-500 animate-pulse" />
                        <div className="absolute left-1/2 -bottom-20 h-20 w-[2px] bg-gradient-to-t from-transparent to-blue-500 animate-pulse delay-75" />

                        {/* Billboard Label */}
                         <div className="absolute right-0 bottom-0 translate-x-[50%] translate-y-[50%] translate-z-[80px] transform-style-3d pointer-events-none">
                            <div className="transform -rotate-z-45 -rotate-x-55 bg-black/80 border-l-2 border-blue-500 pl-3 py-1 backdrop-blur-md">
                                <h4 className="text-white font-bold text-sm">Secure Ingestion</h4>
                                <p className="text-[10px] text-gray-400">E2E Encrypted • 40GB/s</p>
                            </div>
                        </div>
                    </div>


                    {/* =========================================================
                        CONNECTOR: PIPE 1 (Ingestion -> Core)
                       ========================================================= */}
                    <div className="absolute bottom-[100px] left-[190px] w-[120px] h-[40px] transform-style-3d">
                        {/* The Pipe Structure */}
                        <div className="absolute inset-0 border-y border-white/5 bg-white/[0.01]" />
                        {/* Moving Data */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-4 bg-white/20 blur-md animate-shuttle-x" />
                             {/* Added Packet Pulse Trail */}
                             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-[6px] bg-white/40 blur-sm animate-shuttle-x" style={{animationDelay: '0.1s'}} />
                        </div>
                    </div>


                    {/* =========================================================
                        MODULE 2: NEURAL CORE (Center)
                       ========================================================= */}
                    <div className="absolute top-1/2 left-1/2 w-[220px] h-[220px] transform -translate-x-1/2 -translate-y-1/2 transform-style-3d group-hover:scale-105 transition-transform duration-700">
                        
                        {/* Multi-layer base */}
                        <div className="absolute inset-0 bg-[#1a0b2e] border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.2)] transform-style-3d translate-z-0 rounded-lg">
                            {/* Inner Circuitry */}
                            <div className="absolute inset-2 border border-dashed border-purple-500/20" />
                        </div>
                        
                        <div className="absolute inset-4 bg-[#2e1065] border border-purple-400/40 transform-style-3d translate-z-[20px] shadow-lg rounded-lg flex items-center justify-center overflow-visible">
                             
                             {/* --- REPLACED CORE: Processing Monolith --- */}
                             <div className="transform-style-3d translate-z-[20px] relative flex flex-col items-center justify-end w-16 h-24 group-hover:translate-z-[30px] transition-transform duration-500">
                                 
                                 {/* Server Tower Body */}
                                 <div className="relative w-full h-full bg-black/80 border border-purple-400/50 backdrop-blur-sm rounded-sm overflow-hidden flex items-end justify-center gap-[2px] p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                                     {/* Equalizer Bars */}
                                     {[...Array(5)].map((_, i) => (
                                         <div key={i} className="w-2 bg-gradient-to-t from-purple-600 to-pink-400 animate-monolith-bar rounded-t-[1px]" style={{
                                             animationDelay: `${i * 0.15}s`,
                                             height: '30%' // Base height, animation handles scaleY or height
                                         }} />
                                     ))}
                                     {/* Scanline Overlay */}
                                     <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />
                                 </div>

                                 {/* Top Emitter Cap */}
                                 <div className="absolute -top-[2px] left-0 right-0 h-[4px] bg-purple-300 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20" />

                                 {/* Vertical Laser Beam */}
                                 <div className="absolute bottom-[98%] left-1/2 -translate-x-1/2 w-[2px] h-[120px] bg-gradient-to-t from-purple-400 via-purple-500/20 to-transparent blur-[1px]" />
                                 
                                 {/* Floating Label */}
                                 <div className="absolute -right-24 top-1/2 -translate-y-1/2 bg-black/80 border-l border-purple-500 pl-2 pr-1 py-1 transform-style-3d translate-z-[10px]">
                                     <div className="transform -rotate-z-45 -rotate-x-55 origin-left">
                                         <div className="text-[7px] text-purple-300 font-mono leading-none">
                                             CORE_LOAD<br/>
                                             <span className="text-white font-bold text-xs">98%</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                        </div>
                        
                         {/* EXTRA INFO: Auto-Scaling Badge */}
                         <div className="absolute -left-16 -bottom-8 transform-style-3d translate-z-[40px] pointer-events-none">
                            <div className="bg-purple-900/40 border border-purple-500/30 px-2 py-1 rounded backdrop-blur-md transform -rotate-z-45 -rotate-x-55">
                               <div className="text-[7px] text-purple-200 font-mono text-center">
                                   AUTO-SCALING<br/>
                                   <span className="text-white font-bold">ENABLED</span>
                               </div>
                            </div>
                        </div>

                        {/* Floating Rings */}
                        <div className="absolute inset-[-20px] rounded-full border border-purple-500/10 transform-style-3d translate-z-[40px] animate-spin-slow-reverse border-dashed" />
                        <div className="absolute inset-[-40px] rounded-full border border-purple-500/5 transform-style-3d translate-z-[30px] animate-spin-slow" />

                        {/* Holographic Projection (The "Brain" logic) */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-z-[100px] transform-style-3d pointer-events-none">
                             <div className="transform -rotate-z-45 -rotate-x-55 flex flex-col items-center">
                                 {/* Floating Code Snippets */}
                                 <div className="space-y-1 opacity-70">
                                     <div className="h-1 w-12 bg-green-400/50 rounded animate-pulse" />
                                     <div className="h-1 w-16 bg-purple-400/50 rounded animate-pulse delay-100" />
                                     <div className="h-1 w-10 bg-blue-400/50 rounded animate-pulse delay-200" />
                                 </div>
                                 <div className="mt-4 px-3 py-1 bg-purple-900/80 border border-purple-400/50 rounded backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                     <span className="text-white text-xs font-bold tracking-wider">AURAMIX ENGINE v2.4</span>
                                 </div>
                             </div>
                        </div>
                        
                        {/* HOLOGRAPHIC LOG TERMINAL */}
                        <div className="absolute -left-20 top-0 w-32 h-20 bg-black/60 border border-purple-500/20 backdrop-blur-sm transform-style-3d translate-z-[60px] p-2 pointer-events-none">
                            <div className="transform -rotate-z-45 -rotate-x-55 origin-bottom-right">
                                <div className="text-[6px] font-mono text-green-400 leading-tight">
                                    &gt; INIT_SEQ_START<br/>
                                    &gt; TENSOR_CORES: ACTIVE<br/>
                                    &gt; MODEL_LOAD: 84%<br/>
                                    &gt; ALLOC_MEM: 12GB<br/>
                                    <span className="animate-pulse">_</span>
                                </div>
                            </div>
                            {/* Connector Line */}
                            <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-purple-500/30 origin-right transform rotate-45 translate-y-[10px]" />
                        </div>

                         {/* Heat Sinks / Cooling Towers (3D Blocks) */}
                         <div className="absolute -right-4 -top-4 w-8 h-8 bg-gray-800 transform-style-3d translate-z-[10px]">
                            <div className="absolute inset-0 bg-gray-700 transform translate-z-[20px]" />
                            <div className="absolute inset-0 bg-gray-600 transform rotate-x-90 origin-bottom h-[20px]" />
                            <div className="absolute inset-0 bg-gray-600 transform rotate-y-90 origin-right w-[20px]" />
                         </div>
                    </div>


                    {/* =========================================================
                        CONNECTOR: PIPE 2 (Core -> Output)
                       ========================================================= */}
                    <div className="absolute top-[100px] right-[190px] w-[120px] h-[40px] transform-style-3d">
                        <div className="absolute inset-0 border-y border-white/5 bg-white/[0.01]" />
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-green-500 transform -translate-y-1/2 shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-4 bg-white/20 blur-md animate-shuttle-x" />
                             {/* Added Packet Pulse Trail */}
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-[6px] bg-white/40 blur-sm animate-shuttle-x" style={{animationDelay: '0.1s'}} />
                        </div>
                    </div>


                    {/* =========================================================
                        MODULE 3: DELIVERY / INSIGHTS (Top Right)
                       ========================================================= */}
                    <div className="absolute top-10 right-10 w-[180px] h-[180px] transform-style-3d hover:translate-z-[20px] transition-transform duration-500">
                        
                         {/* Base Platform */}
                        <div className="absolute inset-0 bg-[#0f0a18] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center transform-style-3d">
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_70%)]" />
                            
                            {/* Server Racks / API Gateway */}
                            <div className="grid grid-cols-2 gap-2 w-24 h-24">
                                <div className="bg-gray-800 border-t border-green-500/50 h-full relative group-hover:translate-z-[10px] transition-transform">
                                    <div className="absolute top-1 right-1 w-1 h-1 bg-green-500 rounded-full animate-ping" />
                                    {/* Blinking Server Lights */}
                                    <div className="absolute bottom-2 left-2 flex gap-1">
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-75" />
                                    </div>
                                </div>
                                <div className="bg-gray-800 border-t border-green-500/50 h-full relative group-hover:translate-z-[15px] transition-transform delay-75">
                                     <div className="absolute top-1 right-1 w-1 h-1 bg-green-500 rounded-full animate-ping delay-300" />
                                </div>
                                <div className="bg-gray-800 border-t border-green-500/50 h-full relative group-hover:translate-z-[5px] transition-transform delay-100"></div>
                                <div className="bg-gray-800 border-t border-green-500/50 h-full relative group-hover:translate-z-[20px] transition-transform delay-150"></div>
                            </div>
                        </div>
                        
                        {/* EXTRA INFO: Uptime Badge */}
                         <div className="absolute -right-16 -top-4 transform-style-3d translate-z-[50px] pointer-events-none">
                            <div className="bg-black/80 border border-green-500/30 p-2 rounded backdrop-blur-md transform -rotate-z-45 -rotate-x-55 shadow-lg">
                               <div className="text-[8px] text-gray-300 font-mono text-right">
                                   API GATEWAY<br/>
                                   <span className="text-green-400 font-bold">99.99% UPTIME</span>
                               </div>
                            </div>
                        </div>

                         {/* HOLOGRAPHIC LOG TERMINAL - OUTPUT */}
                        <div className="absolute -right-24 bottom-10 w-32 h-16 bg-black/60 border border-green-500/20 backdrop-blur-sm transform-style-3d translate-z-[60px] p-2 pointer-events-none">
                            <div className="transform -rotate-z-45 -rotate-x-55 origin-bottom-left text-right">
                                <div className="text-[6px] font-mono text-green-400 leading-tight">
                                    &gt; PACKET_SENT: OK<br/>
                                    &gt; LATENCY: 12ms<br/>
                                    &gt; ENCRYPTION: TLS 1.3<br/>
                                    <span className="animate-pulse">_</span>
                                </div>
                            </div>
                             {/* Connector Line */}
                             <div className="absolute top-0 left-0 w-8 h-[1px] bg-green-500/30 origin-left transform -rotate-45 -translate-y-[10px]" />
                        </div>

                         {/* Vertical Beams (Outputs) */}
                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-z-[50px] transform-style-3d">
                             <div className="w-1 h-32 bg-gradient-to-t from-green-500 to-transparent blur-sm transform -rotate-x-90 origin-bottom" />
                         </div>

                        {/* Billboard Label */}
                         <div className="absolute left-0 top-0 translate-x-[-50%] translate-y-[-50%] translate-z-[80px] transform-style-3d pointer-events-none">
                            <div className="transform -rotate-z-45 -rotate-x-55 bg-black/80 border-r-2 border-green-500 pr-3 py-1 text-right backdrop-blur-md">
                                <h4 className="text-white font-bold text-sm">Actionable Insights</h4>
                                <p className="text-[10px] text-gray-400">JSON • PDF • HL7 ORU</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            
            <style>{`
                .mask-radial-fade {
                    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
                }
                .rotate-x-\\[55deg\\] { transform: rotateX(55deg); }
                .rotate-z-\\[45deg\\] { transform: rotateZ(45deg); }
                .-rotate-x-55 { transform: rotateX(-55deg); }
                .-rotate-z-45 { transform: rotateZ(-45deg); }
                
                @keyframes shuttle-x {
                    0% { transform: translateX(0) translateY(-50%); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateX(120px) translateY(-50%); opacity: 0; }
                }
                .animate-shuttle-x { animation: shuttle-x 1.2s linear infinite; }

                @keyframes spin-slow-reverse { 100% { transform: rotate(-360deg); } }
                .animate-spin-slow-reverse { animation: spin-slow-reverse 15s linear infinite; }

                @keyframes spin-slow { 100% { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
                
                @keyframes monolith-bar {
                    0%, 100% { height: 20%; opacity: 0.5; }
                    50% { height: 90%; opacity: 1; filter: drop-shadow(0 0 5px #d8b4fe); }
                }
                .animate-monolith-bar { animation: monolith-bar 0.8s ease-in-out infinite; }
            `}</style>
        </div>
    )
}

const CaseStudy = () => {
    return (
        <div className="w-full max-w-7xl py-16 sm:py-20 md:py-28 border-t border-white/5">
            <div className="relative rounded-[3rem] bg-[#0f0a18] border border-white/10 overflow-hidden group/card hover:border-purple-500/20 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[80px]" />
                
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-6 sm:p-8 md:p-12 relative z-10">
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-mono text-green-400 tracking-widest uppercase">Live Deployment</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-4 sm:mb-6">Memorial Sloan Kettering</h3>
                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                            By integrating Auramix into their digital pathology workflow, MSKCC achieved a historic reduction in diagnostic turnaround time for complex solid tumors.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 sm:gap-8 border-t border-white/10 pt-6 sm:pt-8">
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">85%</div>
                                <div className="text-xs sm:text-sm text-gray-500">Faster Diagnosis</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">12k+</div>
                                <div className="text-xs sm:text-sm text-gray-500">Slides Processed</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="relative h-[280px] sm:h-[320px] md:h-[400px] bg-black/40 rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col justify-end overflow-hidden group">
                        {/* Fake Graph */}
                        <div className="absolute inset-x-8 bottom-8 top-20 flex items-end gap-6">
                            <div className="flex-1 flex flex-col justify-end h-full">
                                <div className="w-full bg-white/5 rounded-t-lg h-[30%] relative group-hover:h-[35%] transition-all duration-700 ease-out">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono">BEFORE</div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-end h-full">
                                <div className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg h-[85%] relative group-hover:h-[95%] transition-all duration-700 ease-out shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-purple-300 font-bold font-mono">AFTER</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-8 left-8">
                            <h4 className="text-white font-medium">Efficiency Delta</h4>
                            <p className="text-xs text-gray-500 mt-1">Q3 2024 Performance Review</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const testimonials = [
    { quote: "Auramix reduced our false positives by 40% in the first month.", author: "Dr. Sarah Chen", role: "Chief of Pathology, Mayo Clinic" },
    { quote: "The integration was flawless. It feels like magic.", author: "James Wilson", role: "CTO, Mount Sinai" },
    { quote: "Finally, an AI tool that actually fits our workflow.", author: "Dr. Elena Rodriguez", role: "Oncologist, MD Anderson" },
    { quote: "A game changer for high-volume screening.", author: "Dr. A. Gupta", role: "Director, Cleveland Clinic" },
    { quote: "Sensitivity increased by 15% without compromising specificity.", author: "Dr. M. Al-Fayed", role: "Head of Research, King's College" },
    { quote: "The dashboard is intuitive and requires zero training.", author: "Sarah Jenkins", role: "Lab Manager, UCSF" },
    { quote: "We processed our backlog in record time.", author: "Dr. Kenji Tanaka", role: "Director, Tokyo Med" },
    { quote: "Security compliance was our biggest hurdle, Auramix solved it.", author: "Rebecca Lin", role: "CISO, HealthFirst" },
    { quote: "The visual heatmaps make explaining diagnosis to patients easier.", author: "Dr. P. Weber", role: "Oncologist, Charité" },
];

const TestimonialCard = ({ t }: { t: typeof testimonials[0] }) => (
    <div className="relative w-full p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl group hover:bg-white/[0.04] transition-all duration-500 overflow-hidden mb-6">
        {/* Glowing Accent Line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-transparent to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        {/* Ambient Glow */}
        <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/20 rounded-full blur-[50px] group-hover:bg-purple-500/30 transition-colors" />

        <div className="relative z-10">
            <p className="text-lg text-gray-200 font-light leading-relaxed mb-6">"{t.quote}"</p>
            
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center">
                    <span className="text-white font-medium">{t.author[0]}</span>
                </div>
                <div>
                    <div className="text-white font-semibold text-sm">{t.author}</div>
                    <div className="text-purple-400 text-xs tracking-wider uppercase">{t.role}</div>
                </div>
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    // Create 3 separate columns of data by duplicating/slicing
    // Each column needs enough data to scroll smoothly
    const fullList = [...testimonials, ...testimonials];
    const column1 = fullList;
    const column2 = [...testimonials.slice(2), ...testimonials.slice(0, 2), ...testimonials]; // Shifted
    const column3 = [...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials]; // Shifted

    return (
        <div className="w-full py-16 sm:py-20 md:py-28 relative flex flex-col items-center bg-[#0a0510]">
             {/* Header Section */}
             <div className="text-center mb-12 sm:mb-16 md:mb-20 relative z-20 px-4">
                <h3 className="text-3xl md:text-5xl font-medium text-white mb-6">Voices from the Frontlines</h3>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                    See how leading healthcare providers are leveraging Auramix to elevate patient outcomes.
                </p>
            </div>

             <div className="w-full max-w-7xl h-[560px] sm:h-[700px] md:h-[800px] overflow-hidden relative grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                 
                 {/* Top/Bottom Fade Masks */}
                 <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0510] to-transparent z-10 pointer-events-none" />
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0510] to-transparent z-10 pointer-events-none" />

                 {/* Column 1 - Up */}
                 <div className="flex flex-col animate-scroll-up hover:pause">
                    {column1.map((t, i) => <TestimonialCard key={`col1-${i}`} t={t} />)}
                 </div>

                 {/* Column 2 - Down */}
                 <div className="hidden md:flex flex-col animate-scroll-down hover:pause">
                    {column2.map((t, i) => <TestimonialCard key={`col2-${i}`} t={t} />)}
                 </div>

                 {/* Column 3 - Up (Slower) */}
                 <div className="hidden md:flex flex-col animate-scroll-up-slow hover:pause">
                     {column3.map((t, i) => <TestimonialCard key={`col3-${i}`} t={t} />)}
                 </div>
             </div>
             
             <style>{`
                @keyframes scroll-up {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-33.33%); }
                }
                @keyframes scroll-down {
                    0% { transform: translateY(-33.33%); }
                    100% { transform: translateY(0); }
                }
                .animate-scroll-up {
                    animation: scroll-up 45s linear infinite;
                }
                .animate-scroll-down {
                    animation: scroll-down 45s linear infinite;
                }
                .animate-scroll-up-slow {
                    animation: scroll-up 55s linear infinite;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
             `}</style>
        </div>
    );
};

// New Section: Compliance Ticker
const SecurityTicker = () => {
    return (
        <div className="w-full border-y border-white/5 bg-[#0a0510] py-6 px-3 sm:px-5 flex justify-center items-center gap-12 overflow-hidden">
             <div className="flex flex-wrap justify-center gap-8 sm:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {['HIPAA COMPLIANT', 'SOC 2 TYPE II', 'GDPR READY', 'ISO 27001', 'FDA CLEARED'].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-mono font-bold tracking-widest text-white">{badge}</span>
                    </div>
                ))}
             </div>
        </div>
    )
}

export const Sections: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center z-20 relative">
      
      {/* 1. Trusted By Section */}
      <div className="w-full max-w-6xl px-3 sm:px-5 lg:px-8 py-12 sm:py-16 md:py-20 border-b border-white/5">
        <p className="text-center text-xs font-semibold text-purple-200/50 uppercase tracking-[0.2em] mb-8 sm:mb-10">Trusted by leading institutions</p>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-24 opacity-30 grayscale mix-blend-screen hover:opacity-50 transition-opacity duration-500">
          {logos.map((logo, i) => (
             <span key={i} className="text-xl md:text-2xl font-bold font-serif text-white">{logo}</span>
          ))}
        </div>
      </div>

      {/* 2. Precision at Scale - BENTO GRID */}
      <div className="w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-16 sm:py-20 md:py-28">
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">Precision at Scale</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Our platform integrates seamlessly into existing workflows, augmenting clinical decision-making with state-of-the-art AI.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[360px] sm:auto-rows-[320px] md:auto-rows-[300px]">
            
            {/* CARD 1: Large (Span 2) - Predictive Analytics */}
            <div className="group relative md:col-span-2 rounded-[2.5rem] bg-[#0a0510] border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-500 flex flex-col md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Visualizer: Cybernetic Radar */}
                <div className="relative w-full h-40 sm:h-48 md:absolute md:top-0 md:right-0 md:w-1/2 md:h-full opacity-60" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}>
                     <RadarVisualizer />
                </div>

                <div className="relative p-6 sm:p-8 md:p-10 flex-1 md:h-full flex flex-col justify-between items-center md:items-start gap-4 md:gap-6 z-10 pointer-events-none">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300">
                        <Icons.Analytics />
                    </div>
                    <div className="max-w-full md:max-w-[50%] text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl font-medium text-white mb-3">Live Confidence Scoring</h3>
                        <p className="text-gray-400">Real-time probability analysis across 50+ distinct morphological biomarkers.</p>
                    </div>
                </div>
            </div>

            {/* CARD 2: Tall/Square - Automated Triaging */}
            <div className="group relative md:col-span-1 rounded-[2.5rem] bg-[#0a0510] border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
                
                <div className="absolute top-10 right-10 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>

                <div className="relative p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300">
                        <Icons.Triaging />
                    </div>
                    <div>
                        <h3 className="text-2xl font-medium text-white mb-3">Smart Triage</h3>
                        <p className="text-gray-400 text-sm">Intelligently route critical cases instantly.</p>
                    </div>
                </div>
            </div>

            {/* CARD 3: Wide/Square - Real-time Reporting */}
            <div className="group relative md:col-span-1 rounded-[2.5rem] bg-[#0a0510] border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-500">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-colors" />
                
                <div className="relative p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300">
                        <Icons.Reporting />
                    </div>
                    <div>
                        <h3 className="text-2xl font-medium text-white mb-3">Auto Reporting</h3>
                        <p className="text-gray-400 text-sm">Save 15+ hours/week with automated compliance insights.</p>
                    </div>
                </div>
            </div>

             {/* CARD 4: Decorative Fill - "Scale" with MATRIX RAIN */}
             <div className="group relative md:col-span-2 rounded-[2.5rem] border border-white/5 bg-[#0a0510] overflow-hidden flex items-center justify-center hover:border-purple-500/20 transition-colors">
                
                <MatrixRain />
                
                <div className="relative z-10 text-center bg-black/50 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                    <p className="text-4xl font-bold text-white mb-1">10TB+</p>
                    <p className="text-purple-300 font-mono tracking-widest text-xs uppercase">Daily Processing Volume</p>
                </div>
            </div>

        </div>
      </div>

      {/* 3. Deep Dive / Visualization Section */}
      <div className="w-full h-[100vh] sm:h-[110vh] md:h-[120vh] min-h-[700px] sm:min-h-[800px] md:min-h-[900px] relative overflow-hidden bg-[#030005]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#581c8720] via-[#030005] to-[#030005] z-0"></div>

        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0 cursor-default">
            <CellScene />
        </div>

        {/* Text Overlay Layer with ADDED STATS */}
        <div className="absolute inset-0 z-10 flex flex-col items-center pt-16 sm:pt-20 md:pt-32 px-3 sm:px-5 pointer-events-none">
            <p className="text-purple-300/60 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 shadow-black drop-shadow-lg">Auramix Cellular Intelligence</p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mb-6 drop-shadow-2xl">
                AI-Driven<br />
                Cytopathology
            </h2>
            <p className="text-purple-100/60 text-base md:text-lg text-center max-w-2xl leading-relaxed drop-shadow-md font-light mb-8">
                Analyzing nuclear morphology and chromatin texture at the nanometer scale<br className="hidden md:block"/> to detect anomalies before they are visible to the human eye.
            </p>
            
            {/* Added Stats Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-4 backdrop-blur-sm bg-black/20 p-4 sm:p-6 rounded-2xl border border-white/5">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-[10px] text-purple-300 tracking-widest uppercase">Accuracy</div>
                </div>
                 <div className="text-center border-l-0 sm:border-l border-white/10 pl-0 sm:pl-12">
                    <div className="text-2xl font-bold text-white">&lt;2s</div>
                    <div className="text-[10px] text-purple-300 tracking-widest uppercase">Latency</div>
                </div>
                 <div className="text-center border-l-0 sm:border-l border-white/10 pl-0 sm:pl-12">
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-[10px] text-purple-300 tracking-widest uppercase">Biomarkers</div>
                </div>
            </div>
            
            <div className="absolute bottom-12 left-12 hidden md:flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-white/30 tracking-[0.3em] font-bold uppercase">Biomarker Visualization Active</p>
            </div>
             <div className="absolute bottom-12 right-12 hidden md:block">
                <div className="w-6 h-6 border-b border-r border-white/20"></div>
            </div>
        </div>
      </div>

      {/* 4. Interactive Case Study */}
      <div className="w-full bg-[#030005] border-t border-white/5 relative z-20">
         <ComparisonSlider />
      </div>

      {/* 5. Isometric Integration Architecture */}
      <div className="w-full bg-gradient-to-b from-[#030005] to-[#0a0510] border-t border-white/5 relative z-20">
         <IsometricIntegration />
      </div>
      
      {/* 6. Security Ticker (Moved ABOVE Case Study) */}
      <SecurityTicker />
      
      {/* 7. Case Study Section */}
      <CaseStudy />

      {/* 8. Testimonials */}
      <div className="w-full bg-[#0a0510] relative z-20">
          <Testimonials />
      </div>

      {/* 9. Improved Footer CTA */}
      <div className="w-full max-w-6xl mx-auto py-20 sm:py-28 md:py-40 text-center relative z-20 overflow-hidden">
        {/* Ambient background glow - INTENSIFIED */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

        <h2 className="relative text-4xl sm:text-6xl md:text-8xl font-medium text-white tracking-tighter mb-8 z-10">
            Diagnostic<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">Singularity.</span>
        </h2>
        <p className="relative text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 sm:mb-16 z-10 font-light">
            Join the network of 500+ institutions leveraging Auramix to redefine the standard of care.
        </p>

        {/* Improved Buttons Container */}
        <div className="relative flex flex-col sm:flex-row justify-center gap-6 z-10 p-2 rounded-3xl">
            <div className="absolute inset-0 bg-white/[0.02] blur-xl rounded-full"></div>
            
            <Button variant="primary" className="px-6 sm:px-8 py-3 text-sm shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] !rounded-2xl relative overflow-hidden">
                <span className="relative z-10">Book Clinical Demo</span>
                {/* Subtle shimmer animation inside button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
            </Button>
            
            <Button variant="secondary" className="px-6 sm:px-8 py-3 text-sm !rounded-2xl border-white/20 text-white">
                Read Documentation
            </Button>
        </div>
        
        <div className="mt-16 sm:mt-24 md:mt-32 pt-8 sm:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm z-10 relative">
            <p>© 2024 Auramix AI. All rights reserved.</p>
            <div className="flex gap-6 sm:gap-8 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
        </div>
      </div>

    </div>
  );
};
