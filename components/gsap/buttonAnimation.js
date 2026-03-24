import { transcode } from "buffer";
import gsap from "gsap";

export default function BtnAnimasjon(btn, txt) {
  if (!btn || !txt) return;

  const handleClick = () => {
    gsap.killTweensOf([btn, txt]);

    // Start
    gsap.to(btn, {
      rotation: 720,
      width: "40px",
      height: "40px",
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to(txt, {
      color: "transparent",
      duration: 1,
    });

    // Back
    gsap.delayedCall(5, () => {
      gsap.to(btn, {
        rotation: 0,
        fontSize: "1.35rem",
        borderRadius: "11px",

        duration: 1.5,
        ease: "power2.inOut",
      });
      gsap.to(txt, {
        color: "white",
        duration: 1,
      });
    });
  };

  btn.addEventListener("click", handleClick);

  return () => {
    // cleanup (viktig!)
    btn.removeEventListener("click", handleClick);
  };
}
