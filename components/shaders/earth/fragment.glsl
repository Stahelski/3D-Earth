// "Uniforms" er data som sendes fra selve programmet til shaderen (bilder og farger)
uniform sampler2D uDayTexture;           // Bildet av planeten på dagtid
uniform sampler2D uNightTexture;         // Bildet av planeten med lys om natten
uniform sampler2D uSpecularCloudsTexture;// Et kart over skyer og hvor havet reflekterer lys
uniform sampler2D uNormalMap; // NormalMap
uniform sampler2D uSpeculareMap; // speculareMap
uniform vec3 uSunDirection;              // Retningen sola skinner fra
uniform vec3 uAtmosphereDayColor;        // Fargen på atmosfæren om dagen (blåaktig)
uniform vec3 uAtmosphereTwilightColor;   // Fargen på atmosfæren i soloppgang/nedgang (oransje)
uniform vec3 uSunColor; // Farge på solens gjennskinn

// "Varyings" er informasjon om 3D-modellens form og posisjon
varying vec2 vUv;       // Koordinater som sier hvor på bildet vi er
varying vec3 vNormal;   // Retningen overflaten peker "utover"
varying vec3 vPosition; // Posisjonen til akkurat dette punktet i rommet

void main() {


  // 1. Finn ut hvilken vei vi ser på planeten og hvilken vei overflaten peker
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = vec3(0.0); // Start med helt svart farge

  // 2. Hent farger fra bildene (texturene) basert på koordinatene
  vec3 dayColor = texture(uDayTexture, vUv).rgb * 1.6;
  vec3 nightColor = texture(uNightTexture, vUv).rgb;
  vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

  // 3. Regn ut om dette punktet peker mot sola (dag) eller bort fra sola (natt)
  float sunOrientation = dot(uSunDirection, normal);

  // 4. Lag en myk overgang mellom natt-bildet og dag-bildet basert på solretningen
  float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
  color += mix(nightColor, dayColor, dayMix);

  // 5. Legg til skyer. De skal bare være synlige der det er dagslys
  float cloudMix = smoothstep(0.5, 1.0, specularCloudsColor.g * 1.1);
  cloudMix *= dayMix;
  color = mix(color, vec3(1.0), cloudMix); // mix inn hvitfarge for skyene

  // 5.1. Leg til normal map
  vec3 normalTex = texture2D(uNormalMap, vUv * 10.0).xyz * 10.0 - 1.0;
  vec3 finalNormal = normalize(normal + normalTex * 100.1); // bland bølgene med planetens normal

  // 6. Fresnel-effekt: Gjør kantene på planeten lysere for å simulere atmosfære-dybde
  float fresnel = dot(viewDirection, normal) + 0.5;
  fresnel = pow(fresnel, 2.0);

  // 7. Bland atmosfærefargene (blå/oransje) og legg dem på toppen av planeten
  float atmosphereDayMix = smoothstep(-0.4, 1.0, sunOrientation);
  vec3 atmosphereColors = mix(uAtmosphereDayColor, uAtmosphereTwilightColor, atmosphereDayMix);
  color = mix(color, atmosphereColors, fresnel * atmosphereDayMix);

  // 8. Regn ut "specular" – altså det skarpe gjenskinnet av sola i vannet
  vec3 reflection = reflect(-uSunDirection, normal);
  float specular = -dot(reflection, viewDirection);
  specular = max(specular, 0.0);
  specular = pow(specular, 1.6); // Gjør gjenskinnet mindre og skarpere
  specular *= specularCloudsColor.r * .6; // Bruk kartet for å kun ha gjenskinn i vann, ikke på land

  // 9. Legg til det hvite sol-gjenskinnet til slutt
  vec3 specularColor = uSunColor;;
  color += specular * specularColor;

    // SpeculareMap. Legger til verdi fra map
  float speculareStrength = texture2D(uSpeculareMap, vUv * 3.0).r;

  // SpeculareMap. Regn ut reflection som før
  vec3 reflectionSpecularMap = reflect(-uSunDirection, finalNormal);
  float specularMap = max(-dot(reflectionSpecularMap, viewDirection), 0.1);
  specularMap = pow(specularMap, 8.0);

  // Multipliser med specular map
  specularMap *= speculareStrength * 1.6; // juster styrke
  color += specularMap * uSunColor; // samme farge som sol farge.

  // 10. Send den ferdige fargen til skjermen og juster lysstyrken (tonemapping)
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
