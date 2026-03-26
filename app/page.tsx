// page.tsx

"use client";
import { useEffect, useRef, useState } from "react";
import initPlanet3D from "../components/planet";
import BtnAnimation from "../components/gsap/buttonAnimation";
import Image from "next/image";
import cart from "../public/earth/cart.png";

export default function Page() {
  // Oppretter en referanse til canvas-elementet
  const [count, updateCount] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef(null);
  const txtRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !btnRef.current || !txtRef.current) return;

    // Send canvasRef.current som argument til init-funksjonen din
    const { renderer } = initPlanet3D(canvasRef.current);
    const cleanup = BtnAnimation(btnRef.current, txtRef.current);

    return () => {
      try {
        const gl = renderer.getContext();
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch (e) {
        console.warn("WEBGL_lose_context feilet", e);
      }

      renderer.dispose();

      cleanup?.();
    };
  }, []);

  return (
    <div className="page">
      <nav className="img">
        <p className="counter">{count}</p>
        <a href="#">
          <Image src={cart} alt="cart" loading="eager" width={40} height={40} />
        </a>
      </nav>
      <section className="hero_main">
        <div className="content">
          <h1>Welcome To The New World</h1>

          <p>
            AI agents that actually bring value to businesses and elevate
            workers productivity.
          </p>

          <button
            onClick={() => {
              setTimeout(() => {
                updateCount(count + 1);
              }, 1000);
            }}
            ref={btnRef}
            className="cta_btn"
          >
            <span ref={txtRef} className="btn_text">
              Order Now
            </span>
          </button>
        </div>

        <canvas className="planet-3D" ref={canvasRef} />
      </section>
    </div>
  );
}

//! https://demos.gsap.com/demo/cursor-driven-perspective-tilt/

//! https://threejs.org/docs/#MathUtils
// https://www.youtube.com/watch?v=RdyZnB6ElLs
// 41:15

// Shaders
// https://www.youtube.com/watch?v=oci7hOzUwww
