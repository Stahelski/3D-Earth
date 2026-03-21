"use client";
import { useEffect, useRef } from "react";
import initPlanet3D from "../components/planet";

export default function Page() {
  // Oppretter en referanse til canvas-elementet
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Send canvasRef.current som argument til init-funksjonen din
    const { scene, renderer } = initPlanet3D(canvasRef.current);

    return () => {
      const gl = renderer.getContext();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="page">
      <section className="hero_main">
        <div className="content">
          <h1>Welcome To The New World</h1>

          <p>
            AI agents that actually bring value to businesses and elevate
            workers productivity.
          </p>

          <button className="cta_btn">Get started.</button>
        </div>

        <canvas className="planet-3D" ref={canvasRef} />
      </section>
    </div>
  );
}

//! https://threejs.org/docs/#MathUtils
// https://www.youtube.com/watch?v=RdyZnB6ElLs
// 41:15

// Shaders
// https://www.youtube.com/watch?v=oci7hOzUwww
