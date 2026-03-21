// "Varyings" er som en stafettpinne. 
// Denne koden regner ut verdier her, og sender dem videre til farge-koden (Fragment Shaderen).
varying vec2 vUv;       // Sender videre bilde-koordinatene (hvor på kartet vi er)
varying vec3 vNormal;   // Sender videre retningen overflaten peker
varying vec3 vPosition; // Sender videre den nøyaktige posisjonen i 3D-verdenen

void main(){
    // Position 
   // 1. Posisjon: Vi tar punktets plassering og regner den om tre ganger:
    // modelMatrix: Plasserer planeten i "verden" (hvor den står og hvordan den roterer).
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // viewMatrix & projectionMatrix: Flytter punktet så det passer med hvor kameraet står,
    // og gjør det flatt slik at en 2D-skjerm kan vise det (perspektiv).
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // 2. Normalen: Vi må vite hvilken vei overflaten peker, selv om planeten roterer.
    // Vi bruker modelMatrix her også for å sørge for at "pilene" som peker ut fra 
    // overflaten følger med når planeten snurrer.
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // 3. Pakking av data: Her fyller vi "stafettpinnene" (varyings) med info.
    // Denne infoen blir nå tilgjengelig for den andre koden som regner ut farger.
   
    vNormal = modelNormal;      // Den ferdig utregnede retningen
    vPosition = modelPosition.xyz; // Den faktiske plassen i verden   
}