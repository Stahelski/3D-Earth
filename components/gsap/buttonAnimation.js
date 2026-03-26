// buttonAnimation.ts
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const emitterSize = 100;
const dotQuantity = 25;
const dotSizeMax = 20;
const dotSizeMin = 10;
// const speed = 3;
// const gravity = 3;

export default function btnAnimation(btn, txt) {
  if (!btn || !txt) return;

  function explosion(btn) {
    const tl = gsap.timeline({ paused: true, delay: 5.4 });

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
        overflow: "visible",
        position: "absolute",
        left: "50%",
        top: "50%",
      });

      // tilfeldig vektor
      const angle = Math.random() * Math.PI * 2;
      const distance = gsap.utils.random(50, emitterSize);

      tl.to(
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

    tl.eventCallback("onComplete", () => {
      btn.querySelectorAll(".dot").forEach((d) => d.remove());
    });

    return tl;
  }

  // Lag en timeline for click-animasjonen (paused, start ved klikk)
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
    x: -40,
    y: 5,
    duration: 0.6,
    ease: "elastic.out",
  });

  tl.to(btn, {
    duration: 3.5,
    motionPath: {
      path: [
        { x: 10, y: -10 },
        { x: 100, y: -80 },
        { x: 220, y: -200 },
        { x: 290, y: -300 },
        { x: 370, y: -400 },
        { x: 600, y: -550 },
        { x: 920, y: -625 },
      ],
      curviness: 1.5,
      autoRotate: false,
    },
    ease: "power2.out",
  });

  // tl.to(btn, {
  //   x: 80,
  //   y: -70,
  //   ease: "elastic.out",
  // });
  // tl.to(btn, {
  //   duration: 2,
  //   motionPath: {
  //     path: "M0,0 C100,40 200,60 300,100",
  //     align: "self",
  //     alignOrigin: [0.5, 0.5],
  //   },
  //   ease: "elastic.out",
  // });

  // const resetAnimation = () => {
  //   gsap.to(btn, {
  //     rotation: 0,
  //     width: "180px",
  //     height: "40px",
  //     borderRadius: "11px",
  //     fontSize: "1.35rem",
  //     duration: 1.4,
  //     ease: "power2.inOut",
  //   });

  //   gsap.to(txt, {
  //     color: "white",
  //     duration: 1.4,
  //   });
  // };

  const handleClick = () => {
    tl.restart();
    const dotsTimeline = explosion(btn); // Lag timeline for dot-animasjonen
    dotsTimeline.play(); // Spill den
  };

  btn.addEventListener("click", handleClick);

  return () => {
    btn.removeEventListener("click", handleClick);
  };
}
