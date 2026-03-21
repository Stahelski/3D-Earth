import * as THREE from "three";
import { gsap } from "gsap";

import earthVertex from "./shaders/earth/vertex.glsl";
import earthFragment from "./shaders/earth/fragment.glsl";
import atmosphereVertex from "./shaders/atmosphere/vertex.glsl";
import atmosphereFragment from "./shaders/atmosphere/fragment.glsl";

import ScrollTrigger from "gsap/dist/ScrollTrigger";

const initPlanet3D = (
  canvasElement: HTMLCanvasElement,
): { scene: THREE.Scene; renderer: THREE.WebGLRenderer } => {
  // scene
  const scene = new THREE.Scene();

  // camera
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2), // Begrens for ytelse
  };

  const camera = new THREE.PerspectiveCamera(
    15,
    size.width / size.height,
    0.1,
    10000,
  );
  camera.position.x = 0;
  camera.position.y = 2.15;
  camera.position.z = 4.5;
  scene.add(camera);

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // texture
  const TL = new THREE.TextureLoader(); // her kan du legge inn argumenter senere for å legge til Loading screen
  const dayTexture = TL.load("/earth/April.jpg");
  const nightTexture = TL.load("/earth/EarthNight.jpg");
  const specularCloudsTexture = TL.load("/earth/specularClouds.jpg");
  const normalMap = TL.load("/earth/NormalMap.jpg"); //! NormalMap
  const speculareMap = TL.load("/earth/SpeculareMap.jpg"); //! SpeculareMap

  // Wrap
  speculareMap.wrapS = THREE.RepeatWrapping; //! ??
  speculareMap.wrapS = THREE.RepeatWrapping; //! ??

  // Color
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  //! normalMap SRGB???
  //! speculareMap SRGB??
  const atmosphereDayColor = "#31c1e9";
  const atmosphereTwilightColor = "#2bafd4";

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();
  // anisotropy, passer på at bildet man laster ikke er uklart
  dayTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;
  normalMap.anisotropy = baseAnisotropy;

  // geometry
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64); // Radius, Width, Height
  const atmosphereGeometyr = new THREE.SphereGeometry(2, 64, 64);

  // material Earth
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayTexture: new THREE.Uniform(dayTexture),
      uNightTexture: new THREE.Uniform(nightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
      uNormalMap: new THREE.Uniform(normalMap), //! normalmap
      uSpeculareMap: new THREE.Uniform(speculareMap), //! speculare Map
      uSunColor: new THREE.Uniform(new THREE.Color("#32b7dc")),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereDayColor),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(atmosphereTwilightColor),
      ),
    },
    transparent: true,
  });

  // material Atmosphere
  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uOpacity: { value: 1 },
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereDayColor),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(atmosphereTwilightColor),
      ),
    },
    depthWrite: false,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  const atmosphere = new THREE.Mesh(atmosphereGeometyr, atmosphereMaterial);
  atmosphere.scale.set(1.13, 1.13, 1.13);

  const earthGroup = new THREE.Group().add(earth, atmosphere);

  const sunSpherical = new THREE.Spherical(1, Math.PI * 0.48, -1.8);
  const sunDirection = new THREE.Vector3();

  sunDirection.setFromSpherical(sunSpherical);

  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  scene.add(earthGroup);
  gsap.registerPlugin(ScrollTrigger);

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero_main",
        start: () => "top top",
        scrub: 3,
        anticipatePin: 1,
        pin: true,
      },
    })

    .to(
      ".hero_main .content",
      {
        filter: `blur(40px)`,
        autoAlpha: 0,
        scale: 0.5,
        duration: 2,
        ease: "power1.inOut",
      },
      "setting",
    )

    .to(
      camera.position,
      {
        y: 0.1,
        z: window.innerWidth > 768 ? 19 : 30,
        x: window.innerHeight > 768 ? 0 : 0.1,
        duration: 2,
        ease: "power1.inOut",
      },
      "setting",
    );

  // animation loop
  gsap.ticker.add((time) => {
    earth.rotation.y = time * 0.2;
    renderer.render(scene, camera);
  });

  gsap.ticker.lagSmoothing(0);

  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRatio = window.devicePixelRatio;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);
  });

  return { scene, renderer };
};

export default initPlanet3D;
// https://www.youtube.com/watch?v=RdyZnB6ElLs
// 41:15

// https://science.nasa.gov/earth/earth-observatory/

// https://github.com/Robinzon100/3D_hero/blob/main/public/earth/specularClouds.jpg
