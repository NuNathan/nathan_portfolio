'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface SpinningShapeProps {
  width?: number;
  height?: number;
  textures?: string[];
}

// Create mask texture for each face (Apple Fifth Avenue approach)
function createMaskTexture(maskId: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Fill with black (no mask)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 512, 512);

  // Convert maskId to binary RGB (Apple Fifth Avenue approach)
  // MaskID 1 => [0, 0, 1] => Blue
  // MaskID 2 => [0, 1, 0] => Lime
  // MaskID 3 => [0, 1, 1] => Cyan
  // MaskID 4 => [1, 0, 0] => Red
  // MaskID 5 => [1, 0, 1] => Magenta
  // MaskID 6 => [1, 1, 0] => Yellow
  const r = (maskId & 4) ? 255 : 0;
  const g = (maskId & 2) ? 255 : 0;
  const b = (maskId & 1) ? 255 : 0;

  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Create displacement map for glass distortion effect (Apple Fifth Avenue approach)
function createDisplacementTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Create displacement map using Apple Fifth Avenue approach
  const imageData = ctx.createImageData(512, 512);
  const data = imageData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const u = x / 512;
      const v = y / 512;

      // Apple Fifth Avenue borders function for displacement length
      const borderBottomLeft = Math.min(
        smoothstep(0, 0.028, u),
        smoothstep(0, 0.028, v)
      );
      const borderTopRight = Math.min(
        smoothstep(0, 0.028, 1 - u),
        smoothstep(0, 0.028, 1 - v)
      );
      const borders1 = 1.0 - (borderBottomLeft * borderTopRight);

      const borderBottomLeft2 = Math.min(
        smoothstep(0, 0.06, u),
        smoothstep(0, 0.06, v)
      );
      const borderTopRight2 = Math.min(
        smoothstep(0, 0.06, 1 - u),
        smoothstep(0, 0.06, 1 - v)
      );
      const borders2 = 1.0 - (borderBottomLeft2 * borderTopRight2);

      // Green channel - displacement length (Apple Fifth Avenue approach)
      const length = borders1 + borders2 * 0.3;

      // Red channel - displacement direction (angle towards center)
      const centerX = 0.5;
      const centerY = 0.5;
      const toCenter = { x: centerX - u, y: centerY - v };
      const angle = Math.atan2(toCenter.y, toCenter.x);
      const direction = (angle / (Math.PI * 2)) + 0.5;

      const index = (y * 512 + x) * 4;
      data[index] = Math.floor(direction * 255);     // Red - direction
      data[index + 1] = Math.floor(length * 255);   // Green - length
      data[index + 2] = 0;                          // Blue - unused
      data[index + 3] = 255;                        // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Smoothstep function for displacement calculations
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Create reflection texture (Apple Fifth Avenue approach)
function createReflectionTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Create a gradient that simulates environment reflections
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.6)');
  gradient.addColorStop(0.6, 'rgba(150, 180, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(100, 150, 255, 0.2)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add deterministic subtle noise pattern for consistent reflections across all faces
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const data = imageData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4;
      // Use deterministic noise based on position instead of Math.random()
      const noise = (Math.sin(x * 0.1) * Math.cos(y * 0.1)) * 10;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Cube component with rainbow borders and stationary textures
function SpinningCube({ textures }: { textures: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Ensure we always have an array to load (use empty texture if none provided)
  const textureUrls = textures.length > 0 ? textures.slice(0, 4) : ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='];
  const loadedTextures = useLoader(TextureLoader, textureUrls);

  // We'll create individual mask textures for each material

  console.log('SpinningCube textures:', textures);
  console.log('Loaded textures:', loadedTextures);
  console.log('Has texture0:', !!loadedTextures[0]);
  console.log('Has texture1:', !!loadedTextures[1]);

  // Configure textures following Apple Fifth Avenue approach
  useMemo(() => {
    loadedTextures.forEach(texture => {
      if (texture) {
        // Clean texture settings to prevent distortion
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.flipY = false; // Don't flip - handle in shader if needed
        texture.premultiplyAlpha = false; // Prevent alpha bleeding
        texture.unpackAlignment = 1; // Prevent alignment issues
        console.log('Configured texture:', texture);
      }
    });
  }, [loadedTextures]);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.001;

      // Update time uniform for rainbow animation across all materials
      const materials = meshRef.current.material as THREE.ShaderMaterial[];
      if (Array.isArray(materials)) {
        materials.forEach(material => {
          if (material.uniforms) {
            material.uniforms.time.value = state.clock.elapsedTime;

            // Update resolution based on canvas size
            const canvas = state.gl.domElement;
            material.uniforms.u_resolution.value.set(canvas.width, canvas.height);
          }
        });
      }
    }
  });

  // Vertex shader with world positions for displacement (Apple Fifth Avenue approach)
  const vertexShader = `
    attribute vec3 center;
    uniform mat4 u_world;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 v_center;
    varying vec3 v_point;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);

      // Calculate world positions for displacement (Apple Fifth Avenue approach)
      vec4 worldPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 worldCenter = projectionMatrix * modelViewMatrix * vec4(center, 1.0);

      v_point = worldPosition.xyz;
      v_center = worldCenter.xyz;
      vViewPosition = -worldPosition.xyz;

      gl_Position = worldPosition;
    }
  `;

  // Fragment shader with multiple texture rendering, masking, and distortion
  const fragmentShader = `
    uniform float time;
    uniform sampler2D texture0;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform sampler2D texture3;
    uniform bool hasTexture0;
    uniform bool hasTexture1;
    uniform bool hasTexture2;
    uniform bool hasTexture3;
    uniform vec2 u_resolution;
    uniform sampler2D u_mask;
    uniform int u_maskId;
    uniform bool u_showContent;
    uniform sampler2D u_displacement;
    uniform sampler2D u_reflection;
    uniform float u_reflectionOpacity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 v_center;
    varying vec3 v_point;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    const float PI2 = 6.28318530718;

    vec4 radialRainbow(vec2 st, float tick) {
      vec2 toCenter = vec2(0.5) - st;
      float angle = mod((atan(toCenter.y, toCenter.x) / PI2) + 0.5 + sin(tick), 1.0);

      // colors
      vec4 a = vec4(0.15, 0.58, 0.96, 1.0);
      vec4 b = vec4(0.29, 1.00, 0.55, 1.0);
      vec4 c = vec4(1.00, 0.0, 0.85, 1.0);
      vec4 d = vec4(0.92, 0.20, 0.14, 1.0);
      vec4 e = vec4(1.00, 0.96, 0.32, 1.0);

      float step = 1.0 / 10.0;

      vec4 color = a;

      color = mix(color, b, smoothstep(step * 1.0, step * 2.0, angle));
      color = mix(color, a, smoothstep(step * 2.0, step * 3.0, angle));
      color = mix(color, b, smoothstep(step * 3.0, step * 4.0, angle));
      color = mix(color, c, smoothstep(step * 4.0, step * 5.0, angle));
      color = mix(color, d, smoothstep(step * 5.0, step * 6.0, angle));
      color = mix(color, c, smoothstep(step * 6.0, step * 7.0, angle));
      color = mix(color, d, smoothstep(step * 7.0, step * 8.0, angle));
      color = mix(color, e, smoothstep(step * 8.0, step * 9.0, angle));
      color = mix(color, a, smoothstep(step * 9.0, step * 10.0, angle));

      return color;
    }

    float borders(vec2 uv, float strokeWidth) {
      vec2 borderBottomLeft = smoothstep(vec2(0.0), vec2(strokeWidth), uv);
      vec2 borderTopRight = smoothstep(vec2(0.0), vec2(strokeWidth), 1.0 - uv);
      return 1.0 - borderBottomLeft.x * borderBottomLeft.y * borderTopRight.x * borderTopRight.y;
    }

    void main() {
      // screen coordinates (Apple Fifth Avenue approach)
      vec2 st = gl_FragCoord.xy / u_resolution;

      vec4 contentColor = vec4(0.0);
      vec4 bordersColor = radialRainbow(st, time);

      // opacity factor based on the z value (Apple Fifth Avenue approach)
      float depth = clamp(smoothstep(-1.0, 1.0, vPosition.z), 0.6, 0.9);

      // Apply borders function (Apple Fifth Avenue approach)
      float borderMask = borders(vUv, 0.011);
      vec4 stroke = bordersColor * vec4(borderMask) * depth;

      // Apple Fifth Avenue distortion effect
      vec4 displacement = texture2D(u_displacement, vUv);

      // Get the direction by taking the displacement red channel and convert it to a vector2
      const float PI2 = 6.283185307179586;
      vec2 direction = vec2(cos(displacement.r * PI2), sin(displacement.r * PI2));

      // Get the length by taking the displacement green channel
      float length = displacement.g;

      // Calculate displacement vector (Apple Fifth Avenue approach)
      vec2 displacementVector = direction * length * 0.015;

      // Apply displacement to screen coordinates for glass effect
      vec2 displacedSt = st + displacementVector;

      // Content rendering in screen space (stationary) with distortion
      vec2 contentCoord = displacedSt;

      // Center and scale content
      contentCoord = (contentCoord - 0.5) / 0.25 + 0.5;

      // Flip vertically (upside down)
      contentCoord.y = 1.0 - contentCoord.y;

      // Apple Fifth Avenue masking approach - use UV coordinates for mask
      vec4 mask = texture2D(u_mask, vUv);

      // convert the mask color from binary (rgb) to decimal (Apple Fifth Avenue approach)
      int maskId = int(mask.r * 4.0 + mask.g * 2.0 + mask.b * 1.0);

      // Determine if this is an outside-facing surface (away from camera)
      vec3 viewDirection = normalize(vViewPosition);
      float facing = dot(vNormal, viewDirection);
      bool isOutsideFacing = facing < 0.0;

      // Only show content on outside-facing surfaces (visible from outside the cube)
      if (u_showContent && isOutsideFacing &&
          contentCoord.x >= 0.0 && contentCoord.x <= 1.0 &&
          contentCoord.y >= 0.0 && contentCoord.y <= 1.0) {

        // Apple Fifth Avenue masking approach - only render on the correct face
        vec4 mask = texture2D(u_mask, vUv);
        int maskId = int(mask.r * 4.0 + mask.g * 2.0 + mask.b * 1.0);

        // Only render texture if this is the correct face (exact match)
        if (maskId == u_maskId) {
          vec4 tex = vec4(0.0);

          // Faces showing texture0: 1 (front), 4 (left), 6 (bottom)
          if ((u_maskId == 1 || u_maskId == 4 || u_maskId == 6) && hasTexture0) {
            tex = texture2D(texture0, contentCoord);
          }
          // Faces showing texture1: 2 (right), 3 (back), 5 (top)
          else if ((u_maskId == 2 || u_maskId == 3 || u_maskId == 5) && hasTexture1) {
            tex = texture2D(texture1, contentCoord);
          }

          if (tex.a > 0.01) {
            contentColor = tex;
          }
        }
      }

      // Apple Fifth Avenue reflection system
      vec4 reflectionColor = vec4(0.0);

      // Sample reflection texture with distortion
      vec2 reflectionCoord = displacedSt;
      reflectionColor = texture2D(u_reflection, reflectionCoord);

      // Apply reflection opacity and blend with content
      reflectionColor *= u_reflectionOpacity;

      // Apple Fifth Avenue final composition - borders always visible through cube
      vec4 finalColor = vec4(0.0);

      // Apple Fifth Avenue approach: subtract texture alpha from stroke
      if (stroke.a > 0.0) {
        finalColor = stroke - contentColor.a;
      } else {
        finalColor = contentColor;
      }

      // Blend reflections using screen blend mode (Apple Fifth Avenue approach)
      finalColor.rgb = finalColor.rgb + reflectionColor.rgb * (1.0 - finalColor.a);
      finalColor.a = max(finalColor.a, reflectionColor.a * 0.3);

      gl_FragColor = finalColor;
    }
  `;

  // Create shader materials for each face with different mask IDs (Apple Fifth Avenue approach)
  const shaderMaterials = useMemo(() => {
    console.log('Creating shader materials with textures:', loadedTextures);
    console.log('Original texture URLs:', textures);

    // Only use textures if we have real texture URLs (not the fallback)
    const hasRealTextures = textures.length > 0;

    // Face assignments: Show content on all visible faces
    const faceAssignments = [
      { maskId: 1, textureIndex: 0, showContent: true },  // front face - texture0
      { maskId: 2, textureIndex: 1, showContent: true },  // right face - texture1
      { maskId: 3, textureIndex: 1, showContent: true },  // back face - texture1
      { maskId: 4, textureIndex: 0, showContent: true },  // left face - texture0
      { maskId: 5, textureIndex: 1, showContent: true },  // top face - texture1
      { maskId: 6, textureIndex: 0, showContent: true },  // bottom face - texture0
    ];

    // Create shared displacement and reflection textures once for uniform distortion
    const sharedDisplacementTexture = createDisplacementTexture();
    const sharedReflectionTexture = createReflectionTexture();

    return faceAssignments.map((assignment, index) => {
      // Create individual mask texture for this face
      const faceMaskTexture = createMaskTexture(assignment.maskId);

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0.0 },
          texture0: { value: hasRealTextures && loadedTextures[0] ? loadedTextures[0] : null },
          texture1: { value: hasRealTextures && loadedTextures[1] ? loadedTextures[1] : null },
          texture2: { value: hasRealTextures && loadedTextures[2] ? loadedTextures[2] : null },
          texture3: { value: hasRealTextures && loadedTextures[3] ? loadedTextures[3] : null },
          hasTexture0: { value: hasRealTextures && !!loadedTextures[0] },
          hasTexture1: { value: hasRealTextures && !!loadedTextures[1] },
          hasTexture2: { value: hasRealTextures && !!loadedTextures[2] },
          hasTexture3: { value: hasRealTextures && !!loadedTextures[3] },
          u_resolution: { value: new THREE.Vector2(1024, 1024) },
          u_mask: { value: faceMaskTexture },
          u_maskId: { value: assignment.maskId },
          u_showContent: { value: assignment.showContent },
          u_displacement: { value: sharedDisplacementTexture },
          u_reflection: { value: sharedReflectionTexture },
          u_reflectionOpacity: { value: 0.3 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      console.log(`Created material ${index} with maskId ${assignment.maskId} for texture ${assignment.textureIndex}, showContent: ${assignment.showContent}`);
      console.log(`Material ${index} - hasTexture0: ${hasRealTextures && !!loadedTextures[0]}, hasTexture1: ${hasRealTextures && !!loadedTextures[1]}`);
      return material;
    });
  }, [loadedTextures, textures, vertexShader, fragmentShader]);

  // Create geometry with center attribute for displacement
  const geometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(2, 2, 2);

    // Add center attribute for each vertex (Apple Fifth Avenue approach)
    const centers = new Float32Array(geom.attributes.position.count * 3);
    for (let i = 0; i < geom.attributes.position.count; i++) {
      centers[i * 3] = 0;     // x center
      centers[i * 3 + 1] = 0; // y center
      centers[i * 3 + 2] = 0; // z center
    }
    geom.setAttribute('center', new THREE.BufferAttribute(centers, 3));

    return geom;
  }, []);

  return (
    <mesh ref={meshRef} material={shaderMaterials} geometry={geometry} />
  );
}

// Main component
function SpinningShape({ width = 300, height = 300, textures = [] }: SpinningShapeProps) {
  return (
    <div
      style={{
        width,
        height,
        position: 'absolute',
        top: '50px',
        left: '50px',
        zIndex: 1000,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SpinningCube textures={textures} />
      </Canvas>
    </div>
  );
}

export default SpinningShape;
