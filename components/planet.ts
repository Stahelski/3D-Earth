import * as THREE from "three";
import { gsap } from "gsap";

import earthVertex from "./shaders/earth/vertex.glsl";
import earthFragment from "./shaders/earth/fragment.glsl";

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
  camera.position.y = 0.1;
  camera.position.z = 19;
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

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();
  // anisotropy, passer på at bildet man laster ikke er uklart
  dayTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;
  normalMap.anisotropy = baseAnisotropy;

  // geometry
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64); // Radius, Width, Height
  // const atmosphereGeometyr = new THREE.SphereGeometry(2, 64, 64);

  // material
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
    },
    transparent: true,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

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
// 34.24

// https://science.nasa.gov/earth/earth-observatory/

// https://github.com/Robinzon100/3D_hero/blob/main/public/earth/specularClouds.jpg
