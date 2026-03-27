// akima.ts

/**
 * Funksjon for Akima-interpolasjon
 * x: array med x-koordinater (må være stigende)
 * y: array med tilsvarende y-koordinater
 * Returnerer en funksjon som du kan bruke for å evaluere y-verdier mellom punktene
 */
export function akimaInterpolation(x, y) {
  // ===============================
  // 1️⃣ Beregn stigningene mellom punktene
  // ===============================
  // Dette er den første nøkkelen i Akima: vi må vite hvor bratt hvert linjestykke mellom punktene er
  const m = [];
  for (let i = 0; i < x.length - 1; i++) {
    // stigning = (endring i y) / (endring i x)
    m.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  }
  // Nå har vi et array med "rå stigninger" mellom hvert datapunkt
  // f.eks. m = [2, -1, 2, -1]

  // ===============================
  // 2️⃣ Beregn Akima-stigninger for hvert punkt
  // ===============================
  // Akima-interpolasjon lager "mykere" stigninger i nodene
  const slopes = [];
  const n = m.length;

  // Vi legger til ekstra stigninger i starten og slutten for å håndtere kantene
  // Dette kalles "ekstrapolering" eller "mirroring"
  const extendedM = [m[1], m[0], ...m, m[n - 1], m[n - 2]];

  for (let i = 2; i < extendedM.length - 2; i++) {
    // Vektet gjennomsnitt basert på forskjellene til nabostigningene
    const w1 = Math.abs(extendedM[i + 1] - extendedM[i]);
    const w2 = Math.abs(extendedM[i - 1] - extendedM[i - 2]);

    // Hvis begge vekter = 0, bruk gjennomsnitt av de to stigningene
    if (w1 + w2 === 0) {
      slopes.push((extendedM[i - 1] + extendedM[i]) / 2);
    } else {
      // Standard Akima-vektet formel
      slopes.push((w1 * extendedM[i - 1] + w2 * extendedM[i]) / (w1 + w2));
    }
  }
  // Nå har vi en stigning for hvert datapunkt som gjør at kurven blir smooth

  // ===============================
  // 3️⃣ Lag kubiske polynomer for hvert intervall
  // ===============================
  // Hvert intervall [x_i, x_{i+1}] får en kubisk funksjon:
  // P(t) = a + b*t + c*t^2 + d*t^3, der t = x - x_i
  const coefs = [];
  for (let i = 0; i < x.length - 1; i++) {
    const h = x[i + 1] - x[i]; // intervallets bredde

    // Kubiske koeffisienter beregnes for å passe både endepunktene og stigningene
    const c = ((3 * (y[i + 1] - y[i])) / h - 2 * slopes[i] - slopes[i + 1]) / h;
    const d =
      ((2 * (y[i] - y[i + 1])) / h + slopes[i] + slopes[i + 1]) / (h * h);

    // a = y_i, b = stigning i punktet
    coefs.push({ a: y[i], b: slopes[i], c, d, xStart: x[i] });
  }

  // ===============================
  // 4️⃣ Funksjon for å evaluere interpolasjon
  // ===============================
  // Denne funksjonen tar en x-verdi og returnerer interpolert y-verdi
  function interpolate(xQuery) {
    // Finn intervallet der xQuery hører hjemme
    let i = coefs.length - 1; // default til siste intervall
    for (let j = 0; j < coefs.length; j++) {
      if (xQuery >= coefs[j].xStart && xQuery <= x[j + 1]) {
        i = j;
        break;
      }
    }

    // Beregn t = avstand fra intervallets start
    const t = xQuery - coefs[i].xStart;
    const { a, b, c, d } = coefs[i];

    // Evaluer kubisk polynom
    return a + b * t + c * t * t + d * t * t * t;
  }

  // Returner funksjonen som kan brukes for å finne y for hvilken som helst x i intervallet
  return interpolate;
}
