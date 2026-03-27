import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function btnAnimation(btn, txt) {
  if (!btn || !txt) return;
  //! https://gsap.com/docs/v3/Plugins/MotionPathPlugin/

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
    x: -45,
    y: 15,
    duration: 0.4,
    ease: "elastic.in",
  });

  tl.to(btn, {
    duration: 0.25,
    motionPath: {
      path: [
        { x: 90, y: -90 },
        { x: 260, y: -225 },
        { x: 500, y: -420 },
        { x: 925, y: -550 },
      ],
      type: "cubic",
      curviness: 2,
      autoRotate: false,
    },
    ease: "expoScale",
  });

  // Dots animation (samme som før)
  const dotQuantity = 25;
  const emitterSize = 100;
  const dotSizeMin = 10;
  const dotSizeMax = 20;

  function explosion(btn) {
    const tlDots = gsap.timeline({ paused: true, delay: 2.37 });

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
          duration: 0.8 + Math.random(),
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

  tl.to(btn, {
    x: 0,
    y: 0,
    delay: 1.5,
    duration: 0.0,
    ease: "circ",
  });

  const handleClick = () => {
    tl.restart();
    gsap.to(btn, {
      opacity: 0,
      duration: 0,

      delay: 2.5,
    });
    const dotsTimeline = explosion(btn);
    dotsTimeline.play();
  };

  btn.addEventListener("click", handleClick);

  return () => btn.removeEventListener("click", handleClick);
}
