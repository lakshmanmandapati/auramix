import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Generate a soft glow texture programmatically
const getTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(230, 200, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)'); // Purple glow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// The inner dense core of the globe
const CoreGlobe = ({ count = 3000, radius = 1.8 }) => {
  const mesh = useRef<THREE.Points>(null);
  const texture = useMemo(() => getTexture(), []);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorInside = new THREE.Color('#e9d5ff'); // Light lavender
    const colorOutside = new THREE.Color('#9333ea'); // Deep purple

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const r = radius * (0.95 + Math.random() * 0.1); 

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = i % 4 === 0 ? colorInside : colorOutside;
      
      if (Math.random() > 0.98) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
        sizes[i] = Math.random() * 0.12 + 0.04;
      } else {
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
        sizes[i] = Math.random() * 0.08 + 0.02;
      }
    }

    return { positions, colors, sizes };
  }, [count, radius]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        transparent={true}
        alphaTest={0.01}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// The distinct outer border shell with MOUSE INTERACTION
// UPDATED: Closer Radius (2.2) and Thicker Particles
const OuterBorderShell = ({ count = 300, minRadius = 2.1, maxRadius = 2.3 }) => {
    const mesh = useRef<THREE.Points>(null);
    const texture = useMemo(() => getTexture(), []);
    
    // Store original positions to return to
    const originalPositions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = minRadius + Math.random() * (maxRadius - minRadius);
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count, minRadius, maxRadius]);

    const colors = useMemo(() => {
        const c = new Float32Array(count * 3);
        const color = new THREE.Color('#d8b4fe');
        for (let i = 0; i < count; i++) {
            c[i * 3] = color.r;
            c[i * 3 + 1] = color.g;
            c[i * 3 + 2] = color.b;
        }
        return c;
    }, [count]);

    // Use a dummy array for current positions to modify in useFrame
    const currentPositions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

    useFrame((state) => {
        if (mesh.current) {
            // Basic Rotation
            mesh.current.rotation.y = -state.clock.getElapsedTime() * 0.05;
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.02;

            // Interaction Logic
            const { pointer } = state;
            // Map pointer to a rough 3D influence zone (simplified)
            // Pointer is -1 to 1. 
            // Calculate distance from center of screen (0,0) to pointer
            const dist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
            
            // If mouse is close to center (globe), scatter particles
            // Close = < 0.4 (normalized)
            const isHovering = dist < 0.4;
            
            const positions = mesh.current.geometry.attributes.position.array as Float32Array;

            for(let i=0; i<count; i++) {
                const ix = i * 3;
                const ox = originalPositions[ix];
                const oy = originalPositions[ix + 1];
                const oz = originalPositions[ix + 2];

                // Calculate vector from center
                const v = new THREE.Vector3(ox, oy, oz);
                const originalLength = v.length();
                
                // Expansion factor based on mouse proximity
                // If close, expand by up to 1.5 units
                let targetExpansion = 0;
                
                if (isHovering) {
                   // Stronger scatter when closer to center
                   const proximity = Math.max(0, 0.4 - dist) / 0.4; // 0 to 1
                   targetExpansion = proximity * 0.8; // Reduced from 2.5 for subtle effect
                }

                // Current length
                const currentV = new THREE.Vector3(positions[ix], positions[ix+1], positions[ix+2]);
                const currentLen = currentV.length();

                // Lerp towards target radius
                const targetRadius = originalLength + targetExpansion;
                const newLen = THREE.MathUtils.lerp(currentLen, targetRadius, 0.1);
                
                // Normalize and apply new length
                v.normalize().multiplyScalar(newLen);

                positions[ix] = v.x;
                positions[ix+1] = v.y;
                positions[ix+2] = v.z;
            }
            mesh.current.geometry.attributes.position.needsUpdate = true;
        }
    });
  
    return (
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={currentPositions.length / 3}
            array={currentPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          vertexColors
          size={0.18} // UPDATED: Thicker Size
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    );
};

// Sparse floating particles for extra depth
const DistantStars = ({ count = 50 }) => {
    const mesh = useRef<THREE.Points>(null);
    const texture = useMemo(() => getTexture(), []);
    
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const r = 4 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i*3+2] = r * Math.cos(phi);
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if(mesh.current) {
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.01;
        }
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial map={texture} size={0.06} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false}/>
        </points>
    )
}

const ResponsiveGroup = ({ children }: { children?: React.ReactNode }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        
        const width = state.size.width;
        let targetScale = 1;

        if (width < 640) {
            targetScale = 0.55; 
        } else if (width < 1024) {
            targetScale = 0.75; 
        } else {
            targetScale = 1.0; 
        }

        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return <group ref={groupRef}>{children}</group>;
};

export const GlobeScene: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-move">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
        
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={0.5} />
            <ResponsiveGroup>
                <CoreGlobe />
                <OuterBorderShell />
                <DistantStars />
            </ResponsiveGroup>
            {/* Enabled Rotation */}
            <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate={true} 
                autoRotateSpeed={0.5} 
                rotateSpeed={0.5}
            />
        </Canvas>
    </div>
  );
};