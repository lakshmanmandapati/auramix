import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// --- SHADERS ---

const membraneVertexShader = `
  uniform float uTime;
  uniform float uDistortionScale;
  uniform float uDistortionStrength;
  
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vPosition;
  varying float vNoise;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Low frequency, high amplitude noise for "wobbly" liquid shape
    float noiseVal = snoise(position * uDistortionScale + vec3(uTime * 0.4));
    vNoise = noiseVal;
    
    vec3 newPos = position + normal * noiseVal * uDistortionStrength;

    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const membraneFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uRimColor;
  
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Sharp Fresnel for the "film" look
    float fresnel = dot(normal, viewDir);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    float rim = pow(fresnel, 2.5); 

    // Inner volume density
    float innerGlow = 1.0 - dot(normal, viewDir);
    innerGlow = pow(innerGlow, 1.5);

    vec3 baseColor = uColor;
    
    // Noise adds slight texture to the surface
    baseColor += vec3(vNoise * 0.02);

    vec3 finalColor = mix(baseColor, uRimColor, rim * 0.9);
    finalColor += uRimColor * innerGlow * 0.05;
    
    // More transparent in the center to show the nucleus clearly
    float alpha = mix(0.05, 0.4, rim);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// --- COMPONENTS ---

const NucleusCluster = () => {
  const count = 80; 
  const spheres = useMemo(() => {
    const temp = [];
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // Golden angle

    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const clusterRadius = 0.5; 
        const scale = 0.18 + Math.random() * 0.08;

        temp.push({
            pos: [x * clusterRadius, y * clusterRadius, z * clusterRadius] as [number, number, number],
            scale: scale
        });
    }
    return temp;
  }, []);

  return (
    <group>
        {spheres.map((s, i) => (
            <mesh key={i} position={s.pos} scale={s.scale}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial 
                    color="#7c3aed" // Violet-600
                    emissive="#4c1d95" // Violet-900
                    emissiveIntensity={0.3}
                    roughness={0.4}
                    metalness={0.3}
                />
            </mesh>
        ))}
        {/* Core occluder */}
        <mesh scale={0.45}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#2e1065" />
        </mesh>
    </group>
  );
};

const Membrane = ({ isHero = false }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#e9d5ff') }, 
        uRimColor: { value: new THREE.Color('#ffffff') },
        uDistortionScale: { value: 1.2 }, 
        uDistortionStrength: { value: 0.08 }, 
    }), []);

    return (
        <mesh>
            <sphereGeometry args={[1.0, 128, 128]} /> 
            <shaderMaterial 
                ref={materialRef}
                vertexShader={membraneVertexShader}
                fragmentShader={membraneFragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.FrontSide}
                depthWrite={false}
                blending={THREE.NormalBlending}
            />
        </mesh>
    )
}

interface CellProps {
    position: [number, number, number];
    scale?: number;
    rotationSpeed?: number;
    parallaxFactor?: number; 
    isHero?: boolean;
}

const OrganicCell: React.FC<CellProps> = ({ 
    position, 
    scale = 1, 
    rotationSpeed = 1, 
    parallaxFactor = 0.5,
    isHero = false 
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const initialPos = useRef(new THREE.Vector3(...position));
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const { mouse } = state;

        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1 * rotationSpeed;
            groupRef.current.rotation.z = Math.cos(t * 0.08) * 0.05;

            const targetX = initialPos.current.x + (mouse.x * parallaxFactor * -1.5);
            const targetY = initialPos.current.y + (mouse.y * parallaxFactor * -1.5);
            
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <group scale={isHero ? 1.0 : 0.9}> 
                <NucleusCluster />
                <group scale={1.15}> 
                    <Membrane isHero={isHero} />
                </group>
            </group>
        </group>
    );
};

const InnerScene = () => {
    const { width } = useThree((state) => state.viewport);
    const responsiveScale = width < 6 ? 0.45 : width < 9 ? 0.65 : 0.8;
    const positionScale = width < 6 ? 0.7 : width < 9 ? 0.85 : 1;
    const pos = (x: number, y: number, z: number): [number, number, number] => [
        x * positionScale,
        y * positionScale,
        z * positionScale,
    ];

    return (
        <group scale={responsiveScale}>
            <ambientLight intensity={0.4} color="#2e1065" />
            <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
            <pointLight position={[-5, -5, 5]} intensity={1.5} color="#a855f7" />
            <spotLight position={[0, 10, 0]} intensity={2.5} angle={0.6} penumbra={0.5} color="#f3e8ff" />
            
            <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={30} />
            <Environment preset="night" />

            {/* --- HERO --- */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <OrganicCell 
                    position={pos(0, -1, 0)} 
                    scale={1.2} 
                    isHero={true} 
                    parallaxFactor={0.5}
                />
            </Float>

            {/* --- LEFT TOP GROUP --- */}
            <group position={pos(-3.5, 2.5, 0)}>
                <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[-0.1, 0.1]}>
                    <OrganicCell position={pos(0, 0, 0)} scale={0.5} rotationSpeed={0.8} parallaxFactor={0.3} />
                </Float>
                <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.7} floatingRange={[-0.1, 0.1]}>
                    <OrganicCell position={pos(0.8, -0.6, -0.5)} scale={0.4} rotationSpeed={0.9} parallaxFactor={0.3} />
                </Float>
            </group>

            {/* --- LEFT BOTTOM CENTER (UPDATED) --- */}
            {/* Moved UP and LEFT from [-1.8, -2.8, 1] to [-2.8, -2.2, 1] */}
             <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.5}>
                <OrganicCell position={pos(-2.8, -2.2, 1)} scale={0.45} rotationSpeed={0.5} parallaxFactor={0.2} />
            </Float>

            {/* --- RIGHT BOTTOM GROUP --- */}
            <group position={pos(3.5, -2.5, 0)}>
                 {/* Main of group */}
                <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.7} floatingRange={[-0.2, 0.2]}>
                    <OrganicCell position={pos(0, 0, 0.5)} scale={0.55} rotationSpeed={0.9} parallaxFactor={0.6} />
                </Float>
                 {/* Secondary */}
                <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.6} floatingRange={[-0.2, 0.2]}>
                    <OrganicCell position={pos(0.8, 0.8, -1)} scale={0.4} rotationSpeed={0.7} parallaxFactor={0.5} />
                </Float>
                {/* Tertiary */}
                 <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.5}>
                    <OrganicCell position={pos(-0.6, -0.5, -0.5)} scale={0.35} rotationSpeed={0.7} parallaxFactor={0.4} />
                </Float>
            </group>

             {/* --- RIGHT TOP GROUP --- */}
            <group position={pos(3.2, 2.8, -1)}>
                <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[-0.15, 0.15]}>
                    <OrganicCell position={pos(0, 0, 0)} scale={0.45} rotationSpeed={1.1} parallaxFactor={0.25} />
                </Float>
                <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7} floatingRange={[-0.1, 0.1]}>
                    <OrganicCell position={pos(0.8, -0.5, -0.8)} scale={0.3} rotationSpeed={1.0} parallaxFactor={0.2} />
                </Float>
            </group>

        </group>
    );
};

export const CellScene: React.FC = () => {
    return (
        <div className="w-full h-full relative">
            <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                <InnerScene />
            </Canvas>
        </div>
    );
};
