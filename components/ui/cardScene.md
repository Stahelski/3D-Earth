"use client"; // Forteller Next.js at denne komponenten kun skal kjøre i nettleseren (klient-side), da Three.js trenger tilgang til 'window' og GPU.

import { Canvas, useFrame } from "@react-three/fiber"; // Canvas er scenen, useFrame er "loopen" som kjører animasjonen.
import { useRef, useMemo } from "react"; // useRef gir oss direkte tilgang til 3D-objekter, useMemo lagrer data for ytelse.
import * as THREE from "three"; // Importerer kjerne-biblioteket.
import Card from "./Card"; // Din egendefinerte glass-komponent.

function FloatingSpheres() {
  // useRef fungerer som en "kobling" til 3D-gruppen vår, slik at vi kan flytte alle ballene samtidig i animasjonsloopen.
  const groupRef = useRef<THREE.Group>(null);

  // useMemo sørger for at vi bare regner ut tilfeldige posisjoner én gang (ved oppstart).
  // Uten denne ville ballene fått nye tilfeldige plasser hver gang React tegner komponenten på nytt.
  const spheres = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          Math.random() * 10 - 5, // X-posisjon mellom -5 og 5
          Math.random() * 10 - 5, // Y-posisjon
          Math.random() * 10 - 5, // Z-posisjon (dybde)
        ] as [number, number, number],
        scale: Math.random() * 0.5 + 0.1, // Tilfeldig størrelse på ballene
        speed: Math.random() * 0.2 + 0.05, // Variabel hastighet for mer liv
      });
    }
    return temp;
  }, []);

  // useFrame er den moderne versjonen av "function animate()".
  // Alt inni her skjer ca. 60 ganger i sekundet.
  useFrame((state) => {
    const t = state.clock.getElapsedTime(); // Henter tiden som har gått siden start.
    if (groupRef.current) {
      // Vi går gjennom alle barna i gruppen (hver enkelt ball)
      groupRef.current.children.forEach((mesh, i) => {
        // Vi bruker sinus og cosinus for å lage en rolig, flytende sirkelbevegelse.
        mesh.position.y += Math.sin(t + i) * 0.002;
        mesh.position.x += Math.cos(t + i) * 0.002;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.position} scale={s.scale}>
          {/* args defineer [radius, bredde-segmenter, høyde-segmenter] */}
          <sphereGeometry args={[1, 32, 16]} />
          {/* meshPhysicalMaterial er en avansert "shader" som simulerer ekte glass/plast bedre enn BasicMaterial */}
          <meshPhysicalMaterial
            transmission={0.9} // Gjør materialet gjennomsiktig (lys slipper gjennom)
            thickness={0.5} // Tykkelsen på materialet, påvirker hvordan lyset bøyes
            roughness={0} // 0 betyr helt glatt overflate (høy refleksjon)
            ior={1.5} // "Index of Refraction" - brytningsindeksen til ekte glass
          />
        </mesh>
      ))}
    </group>
  );
}

export default function GlassProject() {
  return (
    // Wrapper-diven tar opp hele skjermen og fungerer som container for både 3D og UI.
    <div style={{ width: "100vw", height: "100vh", background: "#050505" }}>
      {/* Canvas fungerer som vinduet inn i 3D-verdenen. */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* ambientLight gir et generelt lys til alle objekter, så de ikke blir helt svarte */}
        <ambientLight intensity={0.5} />
        {/* pointLight fungerer som en lyspære som kaster lys og skygge fra et bestemt punkt */}
        <pointLight position={[10, 10, 10]} />

        <FloatingSpheres />
      </Canvas>

      {/* Card ligger utenfor Canvas, men inni samme forelder-div. 
          Fordi den har 'position: absolute' i CSS-en vi laget, vil den legge seg 
          sentrert "oppå" 3D-scenen uten å forstyrre den. */}
      <Card title="ICE GLASS" />
    </div>
  );
}
