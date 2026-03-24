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
      height: "48px",
      borderRadius: "100%",
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to(txt, {
      color: "transparent",
      duration: 0.5,
    });

    // Back
    //! Fiks detaljer
    gsap.delayedCall(5, () => {
      gsap.to(btn, {
        rotation: 0,
        fontSize: "1.35rem",
        borderRadius: "11px",
        width: "180px",
        height: "40px",
        duration: 1.5,
        ease: "power2.inOut",
      });
      gsap.to(txt, {
        color: "white",
        duration: 1.5,
      });
    });
  };

  btn.addEventListener("click", handleClick);

  return () => {
    // cleanup (viktig!)
    btn.removeEventListener("click", handleClick);
  };
}
