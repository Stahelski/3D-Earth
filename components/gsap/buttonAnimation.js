// buttonAnimation.ts
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function btnAnimation(btn, txt) {
  if (!btn || !txt) return;

  // Lag en timeline for click-animasjonen (paused, start ved klikk)
  const tl = gsap.timeline({ paused: true });

  tl.to(btn, {
    rotation: 720,
    width: "40px",
    height: "48px",
    borderRadius: "100%",
    duration: 1.8,
    ease: "power2.inOut",
  }).to(
    txt,
    {
      color: "transparent",
      duration: 0.4,
    },
    0,
  );

  tl.to(btn, {
    x: -40,
    y: 5,
    duration: 1,
    ease: "elastic.out",
  });
  tl.to(btn, {
    x: 80,
    y: -70,
    ease: "elastic.out",
  });
  tl.to(btn, {
    duration: 2,
    motionPath: {
      path: "M0,0 C100,40 200,60 300,100",
      align: "self",
      alignOrigin: [0.5, 0.5],
    },
    ease: "elastic.out",
  });

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

    // Tilbakestill etter ferdig animasjon (1.8 + 1 + litt buffer)
    // gsap.delayedCall(10, resetAnimation);
  };

  btn.addEventListener("click", handleClick);

  return () => {
    btn.removeEventListener("click", handleClick);
  };
}
