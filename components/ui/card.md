import React from "react";
import styles from "./ui.css";

interface About {
  id: number;
  title: string;
  description: string;
  image: string;
  children?: ReactNode;
}

// Vi definerer hva slags "input" (props) komponenten kan ta imot
const CardAbout: React.FC<About> = ({
  id,
  title,
  description,
  image,
  children, // Mulighet for å legge andre ting inni kortet
}) => {
  return (
    <>
      <div className={styles.cardWrapper}>
        <div className={styles.glassCard}>
          {/* Hvis det er en tittel, vis den med is-effekt */}
          {title && <h1 className={styles.iceText}>{title}</h1>}
          {children}
        </div>
      </div>
    </>
  );
};

export default CardAbout;

//! -Card med Glass effekt
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_effects_stereo.html
