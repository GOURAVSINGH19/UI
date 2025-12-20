import Image from "next/image"
import Link from "next/link"

export const ThreedScrollAnimation = () => {
    return (
        <div className="w-full h-full p-2">
            <Link href="https://lapeproject.vercel.app/" target="blank">
                <Image src="/Lapes.png" alt="lapes-img" width={600} height={600} className="object-cover w-full h-full" loading="lazy" />
            </Link>
        </div>
    )
}
export const HTML = () => {
    return (
        <div className="loading">
            <div id="app">
                <section className="webgl-container">
                    <canvas className="webgl-canvas" id="canvas"></canvas>
                </section>
                <section className="section_1">
                    <div className="hero-text z-[-1] absolute">
                        <h1 className="main-title">Experience</h1>
                    </div>
                </section>
                <section className="section_2">
                    <span className="text_fade_1">
                        Fashions fade ,<br />style is External
                    </span>
                    <span className="text_fade_2">
                        In Difficult Times ,<br />Fashions is <br />Always Outrageous
                    </span>
                </section>
            </div>
        </div>
    )
}
export const Style = () => {
    return (
        <div className="Style">
            {/*         
            * {
                margin: 0;
            padding: 0;
              }

            html,
            body {
                overflow - x: hidden;
            background-color: #fff;
            width: 100%;
            stroke-width: none;
             Remove height: 100vh to allow scrolling 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            ::-webkit-scrollbar {
                display: none;
              }

            .js .loading::before,
            .js .loading::after {
                content: "";
            position: fixed;
            z-index: 10000;
              }

            .js .loading::before {
                top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:#fff;
              }

            .js .loading::after {
                top: 50%;
            left: 50%;
            width: 100px;
            height: 1px;
            margin: 0 0 0 -50px;
            background: #000;
            animation: loaderAnim 1.5s ease-in-out infinite alternate forwards;
              }

            @keyframes loaderAnim {
                0 % {
                    transform: scaleX(0);
                    transform- origin: 0% 50%;
                }
            50% {
                transform: scaleX(1);
            transform-origin: 0% 50%;
                }
            50.1% {
                transform: scaleX(1);
            transform-origin: 100% 50%;
                }
            100% {
                transform: scaleX(0);
            transform-origin: 100% 50%;
                }
              }

            #webgl-canvas {
                outline: none;
              }

            .webgl-container {
                position: fixed;  Change from sticky to fixed 
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 10;
            overflow: hidden;
              }

            #canvas {
                width: 100%;
            height: 100%;
              }

            /* Hape.io style hero text 
            .hero-text {
                position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            z-index: -1;
            pointer-events: none;
              }

            .main-title {
                font - size: 15rem;
            font-weight: 700;
            margin-bottom: 1rem;
            opacity: 0.9;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            color: red;
              }

            .subtitle {
                font - size: 1.2rem;
            opacity: 0.7;
            font-weight: 300;
            letter-spacing: 0.1em;
              }

            .section_1 {
                position: relative;
            width: 100%;
            height: 100vh;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
              }

            .section_2 {
                position: relative;
            width: 100%;
            height: 100vh;
            background-color: transparent;
            z-index: 0;
            display: flex;
            align-items: center;
            justify-content: center;
              }

            .section_3 {
                position: relative;
            width: 100%;
            height: 100vh;
            background-color: transparent;
            z-index: 0;
            display: flex;
            align-items: center;
            justify-content: center;
              }

            /* Hape.io style content 
            .content {
                text - align: center;
            color: white;
            max-width: 600px;
            padding: 2rem;
              }

            .content h2 {
                font - size: 3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            opacity: 0.9;
              }

            .content p {
                font - size: 1.1rem;
            opacity: 0.7;
            line-height: 1.6;
            font-weight: 300;
              }

            /* Responsive design 
            @media (max-width: 768px) {
                .main - title {
                font - size: 2.5rem;
                }

            .content h2 {
                font - size: 2rem;
                }

            .content p {
                font - size: 1rem;
                }
              }

            .text_fade_1 {
                position: absolute;
            right: 20%;
            top: 50%;
            font-size: 1.5rem;
            font-weight: 400;
            color: black;
            opacity: 0.7;
            margin: 1rem;
            animation: fadeInOut 4s infinite;
              }
            .text_fade_2 {
                position: absolute;
            left: 20%;
            top: 50%;
            font-size: 1.5rem;
            font-weight: 400;
            color: black;
            opacity: 0.7;
            margin: 1rem;
            animation: fadeInOut 4s infinite;
            }  
            */}

        </div>
    )
}

export const Script = () => {
    return (
        <div className="Script">
            {/* import "./style.css";
            import * as THREE from "three";
            import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
            import gsap from "gsap";
            import {ScrollTrigger} from "gsap/ScrollTrigger";
            import Lenis from "lenis";

            gsap.registerPlugin(ScrollTrigger);

            const section2 = document.querySelector(".section_2");

            const lenis = new Lenis({
                lerp: 0.1,
            smoothWheel: true,
     });

            === Scene Setup ===
            const scene = new THREE.Scene();
            const canvas = document.getElementById("canvas");

            === Camera Setup ===
            const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
            );

            === Renderer ===
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
            antialias: true,
            alpha: true,
     });
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            === Floor ===
            const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshStandardMaterial({color: "#fff" })
            );
            floor.receiveShadow = true;
            floor.rotation.x = -Math.PI * 0.5;
            scene.add(floor);

            === Lights ===
            const ambientLight = new THREE.AmbientLight("white", 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight("white", 3);
            directionalLight.position.set(5, 10, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const directionalLight2 = new THREE.DirectionalLight("white", 0.8);
            directionalLight2.position.set(-5, 8, -5);
            scene.add(directionalLight2);

            const rectAreaLight = new THREE.RectAreaLight("white", 0.5, 50, 50);
            rectAreaLight.position.set(-20, -40, 10);
            rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
            scene.add(rectAreaLight);

            === Load Model ===
            gsap.set(camera.position, {x: 0, y: 5.2, z: 3 });
            gsap.set(camera.rotation, {x: 0, y: 0, z: 0 });

            const gltfLoader = new GLTFLoader();
            let model = null;
            let mixer = null;

     gltfLoader.load("untitled.glb", (gltf) => {
                model = gltf.scene;
            model.scale.set(3.2, 3.2, 3.2);

         if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
         }

            gsap.to(model.rotation, {
                y: 7,
            ease: "linear",
            scrollTrigger: {
                trigger: section2,
            start: "10% bottom",
            end: "+=100%",
            scrub: true,
             },
         });

            gsap.to(model.position, {
                z: -20,
            scrollTrigger: {
                trigger: section2,
            start: "top bottom",
            end: "+=200%",
            scrub: true,
             },
            ease: "linear",
         });

            scene.add(model);
            document.body.classList.remove("loading");
     });

            === Animate Loop ===
            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            renderer.render(scene, camera);
     }
            animate();

            === Resize Handling ===
            function handleResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
     }

            window.addEventListener("resize", handleResize);
            window.scrollTo({top: 0, behavior: "smooth" });

            function lenisLoop() {
                lenis.raf(performance.now());
            requestAnimationFrame(lenisLoop);
     }

            lenisLoop(); */}
        </div>
    )
}