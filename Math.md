# Smooth bane i JavaScript (med matematikk)

## 1. Lineær interpolasjon (lerp)

Den enkleste måten å bevege seg mellom to punkter på:

P(t) = (1 - t)A + tB

### Forklaring

- A = startpunkt (x1, y1)
- B = sluttpunkt (x2, y2)
- t = verdi fra 0 til 1
  - t = 0 → A
  - t = 1 → B
  - t = 0.5 → midt imellom

### Formel per koordinat

x = (1 - t)x1 + t x2  
y = (1 - t)y1 + t y2

Dette gir en rett linje.

---

## 2. Kvadratisk Bezier-kurve

For å lage en smooth kurve, legg til et kontrollpunkt C.

P(t) = (1 - t)^2 A + 2(1 - t)t C + t^2 B

### Punkter

- A = start
- C = kontrollpunkt (styrer kurven)
- B = slutt

### Hva betyr leddene?

1. (1 - t)^2 A  
   → starter sterkt, avtar mot slutten

2. 2(1 - t)t C  
   → styrer kurven mest i midten

3. t^2 B  
   → vokser mot slutten

---

## 3. Eksempel (regn selv)

A = (0, 0)  
C = (5, 10)  
B = (10, 0)  
t = 0.5

### Steg 1: vekter

(1 - t)^2 = 0.25  
2(1 - t)t = 0.5  
t^2 = 0.25

### Steg 2: regn ut

x = 0.25 _ 0 + 0.5 _ 5 + 0.25 _ 10 = 5  
y = 0.25 _ 0 + 0.5 _ 10 + 0.25 _ 0 = 5

Resultat: (5, 5)

---

## 4. JavaScript-implementasjon

```javascript
function quadraticBezier(A, C, B, t) {
  const x = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * C.x + t * t * B.x;

  const y = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * C.y + t * t * B.y;

  return { x, y };
}
```
