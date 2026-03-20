1️⃣ Lag geometrien

Vi lager en litt større sphere rundt jorden:

const atmosphereGeometry = new THREE.SphereGeometry(2.05, 64, 64); // litt større enn jordens radius (2)
2️⃣ Lag shader-materialet

Vi lager et AdditiveBlending, transparent material som kun tegner kanten (rim-light):

import atmosphereVertex from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragment from "./shaders/atmosphere/fragment.glsl";

const atmosphereMaterial = new THREE.ShaderMaterial({
vertexShader: atmosphereVertex,
fragmentShader: atmosphereFragment,
blending: THREE.AdditiveBlending, // legger lyset oppå planeten
transparent: true, // gjør det gjennomsiktig
depthWrite: false, // hindrer z-buffer konflikter
uniforms: {
uCameraPosition: { value: new THREE.Vector3() }, // sender inn kameraets posisjon
uAtmosphereColor: { value: new THREE.Color(0x32b7dc) }, // skinnende blå
},
});
3️⃣ Atmosphere Vertex Shader

atmosphereVertex.glsl:

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
vNormal = normalize(normalMatrix _ normal); // normaler i world space
vPosition = (modelViewMatrix _ vec4(position, 1.0)).xyz;
gl_Position = projectionMatrix _ modelViewMatrix _ vec4(position, 1.0);
}
4️⃣ Atmosphere Fragment Shader

atmosphereFragment.glsl:

uniform vec3 uCameraPosition;
uniform vec3 uAtmosphereColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
// Fresnel-effekt: jo mer kant, jo mer synlig
vec3 viewDir = normalize(uCameraPosition - vPosition);
float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0); // høyere eksponent = skarpere kant

    vec3 color = uAtmosphereColor * fresnel;

    gl_FragColor = vec4(color, fresnel); // alpha = fresnel for myk blending

}

💡 Forklaring:

fresnel = pow(1.0 - dot(viewDir, normal), 3.0) gjør at kun kanten av planeten lyser.

AdditiveBlending gjør at blågløden legger seg oppå planeten uten å mørkne midten.

5️⃣ Legg til atmosfæren i scenen
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

I animasjonsloopen må du oppdatere kamera-posisjonen:

gsap.ticker.add((time) => {
earth.rotation.y = time \* 0.2;
atmosphereMaterial.uniforms.uCameraPosition.value.copy(camera.position);
renderer.render(scene, camera);
});

✅ Nå får du:

En skinnende blå horisont rundt planeten.

Horisonten følger kameraet (rim-light-effekt).

Ingen endringer i selve jord-texturen.
