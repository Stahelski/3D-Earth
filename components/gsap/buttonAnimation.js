import gsap from "gsap";

export default function BtnAnimasjon(btn) {
  if (!btn) return;

  const btnLT = gsap.timeline({ paused: true }).to(btn, {
    rotation: 720,
    duration: 2,
  });

  const handleClick = () => btnLT.play(0);
  btn.addEventListener("click", handleClick);

  return () => {
    // cleanup (viktig!)
    btn.removeEventListener("click", handleClick);
  };
}
