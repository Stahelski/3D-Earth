import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function btnAnimation(btn, txt) {
  if (!btn || !txt) return;

  // Lag interpolert path med 50 punkter
  const path = [
    { x: 0, y: 0 }, // start
    { x: 124, y: -124 },
    { x: 280, y: -234 },
    { x: 427, y: -332 },
    { x: 561, y: -415 },
    { x: 724, y: -474 },
    { x: 920, y: -500 }, // slutt
  ];

  // Array til interpolere punkter
  const smoothPath = [];
  // Antall steg for hvert punkt
  // Antall punkter vi ønsker mellom hvert segment
  const stepsPerSegment = 6; // du kan øke for mer smoothness

  // Gå gjennom hvert segment mellom punktene
  for (let i = 0; i < path.length - 1; i++) {
    const p0 = path[i];
    const p1 = path[i + 1];

    // Lag flere punkter mellom p0 og p1
    for (let j = 0; j < stepsPerSegment; j++) {
      const t = j / stepsPerSegment; // 0 → 1
      const x = p0.x + (p1.x - p0.x) * t; // lineær interpolasjon
      const y = p0.y + (p1.y - p0.y) * t; // lineær interpolasjon
      smoothPath.push({ x, y });
    }
  }

  // Legg til siste punkt til slutt
  smoothPath.push(path[path.length - 1]);

  // const steps = 50;
  // const xMin = xPoints[0];
  // const xMax = xPoints[xPoints.length - 1];
  // const stepSize = (xMax - xMin) / steps;

  // for (let i = 0; i <= steps; i++) {
  //   const x = xMin + i * stepSize;
  //   const y = interpolateY(x);
  //   path.push({ x, y });
  // }

  // Lag timeline
  const tl = gsap.timeline({ paused: true });

  tl.to(btn, {
    rotation: 720,
    width: "42px",
    height: "50px",
    borderRadius: "100%",
    duration: 1.8,
    ease: "power2.inOut",
  }).to(
    txt,
    {
      color: "transparent",
      duration: 0.2,
    },
    0,
  );

  tl.to(btn, {
    duration: 3.5,
    motionPath: {
      path: path,
      curviness: 1.5,
      autoRotate: false,
    },
    ease: "power2.out",
  });

  // Dots animation (samme som før)
  const dotQuantity = 25;
  const emitterSize = 100;
  const dotSizeMin = 10;
  const dotSizeMax = 20;

  function explosion(btn) {
    const tlDots = gsap.timeline({ paused: true });

    for (let i = 0; i < dotQuantity; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      btn.appendChild(dot);

      const size = gsap.utils.random(dotSizeMin, dotSizeMax, 1);
      gsap.set(dot, {
        width: size,
        height: size,
        xPercent: -50,
        yPercent: -50,
        background: "#0e0e0c",
        borderRadius: "50%",
        position: "absolute",
        left: "50%",
        top: "50%",
      });

      const angle = Math.random() * Math.PI * 2;
      const distance = gsap.utils.random(50, emitterSize);

      tlDots.to(
        dot,
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          duration: 1 + Math.random(),
          ease: "power2.out",
        },
        0,
      );
    }

    tlDots.eventCallback("onComplete", () => {
      btn.querySelectorAll(".dot").forEach((d) => d.remove());
    });

    return tlDots;
  }

  const handleClick = () => {
    tl.restart();
    const dotsTimeline = explosion(btn);
    dotsTimeline.play();
  };

  btn.addEventListener("click", handleClick);

  return () => btn.removeEventListener("click", handleClick);
}
