.cardWrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.glassCard {
  width: 400px;
  height: 250px;
  border-radius: 40px;
  padding: 35px;
  position: relative;
  overflow: hidden;
  
  /* Apple Glass Effekt */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  /* Warping-illusjon i kantene (35px inn) */
  box-shadow: 
    inset 0 0 35px rgba(255, 255, 255, 0.1),
    0 8px 32px 0 rgba(0, 0, 0, 0.37);
  
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.iceText {
  font-family: sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  
  /* Ice-glass effekt på tekst */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #a0c4ff 100%);
  -webkit-background-clip: text;  /* Klipper bakgrunnsfargen slik at den kun vises inni bokstavene */
  -webkit-text-fill-color: transparent; /* Gjør selve tekstfargen usynlig så gradienten vises */
  filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.2));
  letter-spacing: -1px;
}
