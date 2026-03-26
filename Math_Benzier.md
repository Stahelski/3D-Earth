## 5. Kubisk Bezier (mer kontroll)

En kubisk Bezier-kurve gir mer kontroll ved å bruke to kontrollpunkter.

### Formel

P(t) = (1 - t)^3 A

- 3(1 - t)^2 t C1
- 3(1 - t)t^2 C2
- t^3 B

---

### Punkter

- A = startpunkt
- C1 = første kontrollpunkt (styrer starten)
- C2 = andre kontrollpunkt (styrer slutten)
- B = sluttpunkt

---

### Hva betyr hvert ledd?

1. (1 - t)^3 A  
   → dominerer i starten (t nær 0)

2. 3(1 - t)^2 t C1  
   → påvirker retningen ut fra startpunktet

3. 3(1 - t)t^2 C2  
   → påvirker hvordan kurven nærmer seg slutten

4. t^3 B  
   → dominerer mot slutten (t nær 1)

---

### Eksempel (regn selv)

A = (0, 0)  
C1 = (0, 10)  
C2 = (10, 10)  
B = (10, 0)  
t = 0.5

#### Steg 1: regn vekter

(1 - t)^3 = 0.125  
3(1 - t)^2 t = 0.375  
3(1 - t)t^2 = 0.375  
t^3 = 0.125

#### Steg 2: regn ut

x = 0.125 _ 0 + 0.375 _ 0 + 0.375 _ 10 + 0.125 _ 10 = 5  
y = 0.125 _ 0 + 0.375 _ 10 + 0.375 _ 10 + 0.125 _ 0 = 7.5

Resultat: (5, 7.5)

---

### JavaScript-implementasjon

```javascript
function cubicBezier(A, C1, C2, B, t) {
  const x =
    (1 - t) ** 3 * A.x +
    3 * (1 - t) ** 2 * t * C1.x +
    3 * (1 - t) * t ** 2 * C2.x +
    t ** 3 * B.x;

  const y =
    (1 - t) ** 3 * A.y +
    3 * (1 - t) ** 2 * t * C1.y +
    3 * (1 - t) * t ** 2 * C2.y +
    t ** 3 * B.y;

  return { x, y };
}
```

# https://beziercurve.net/?utm_source=chatgpt.com
