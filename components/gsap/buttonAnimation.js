// buttonAnimation.ts
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function btnAnimation(btn, txt) {
  if (!btn || !txt) return;

  const pathElement = document.getElementById("sti");
  if (!pathElement) {
    console.warn("SVG path med id='sti' ble ikke funnet");
  }

  // Lag en timeline for click-animasjonen (paused, start ved klikk)
  const tl = gsap.timeline({ paused: true });
  const svg = document.getElementById("#svg");
  const path = document.getElementById("#sti");

  tl.to(btn, {
    rotation: 720,
    width: "40px",
    height: "48px",
    borderRadius: "100%",
    duration: 1.8,
    ease: "power2.inOut",
  })
    .to(
      txt,
      {
        color: "transparent",
        duration: 0.4,
      },
      0,
    )
    .to(btn, {
      x: -40,
      y: 5,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
    });

  tl.set(svg, { opacity: 0 });
  tl.from(path, { drawSVG: "0% 0%" });
  tl.to(path, { drawSVG: "100% 100%" });

  const resetAnimation = () => {
    gsap.to(btn, {
      rotation: 0,
      width: "180px",
      height: "40px",
      borderRadius: "11px",
      fontSize: "1.35rem",
      duration: 1.4,
      ease: "power2.inOut",
    });

    gsap.to(txt, {
      color: "white",
      duration: 1.4,
    });
  };

  const handleClick = () => {
    tl.restart();

    // Tilbakestill etter ferdig animasjon (1.8 + 1 + litt buffer)
    gsap.delayedCall(10, resetAnimation);
  };

  btn.addEventListener("click", handleClick);

  return () => {
    btn.removeEventListener("click", handleClick);
  };
}
