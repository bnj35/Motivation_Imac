import Experience from "../experience";
import * as THREE from "three";
import TestVertexShader from "../shader/testVertex.glsl";
import FragmentFboShader from "../shader/fboFragment.glsl";
import { TextureLoader } from "three";


export default class reveal {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.width = this.experience.sizes.width;
        this.height = this.experience.sizes.height;


        this.whiteTarget = new THREE.WebGLRenderTarget(this.width, this.height);
        this.realSceneTarget = new THREE.WebGLRenderTarget(this.width, this.height);
        this.realScene = new THREE.Scene();
        this.realGrass = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({ color: 0x008900 })
        );

        this.realPlanes = [];
        let RandHexacolor = () => {
            return Math.floor(Math.random() * 8388607) + 12582912;
        }
        let Randcolor = RandHexacolor();
        for (let i = 0; i < 10; i++) {
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(10, 10),
                new THREE.MeshBasicMaterial({ color: Randcolor, side: THREE.DoubleSide, transparent: true, opacity: 0.8, })
            );
            plane.material.color.setHex(RandHexacolor());
            plane.position.set(
                (Math.random() - 0.5) * 30,
                0,
                (Math.random() - 0.5) * 50
            );
            plane.scale.setScalar(Math.random() * 0.5 + 0.5);
            plane.rotation.x = Math.PI;
            
            this.realPlanes.push(plane);
        }
        this.realPlanes.forEach(plane => {
            this.realScene.add(plane);
        });

        this.realGrass.position.y = -0.1;
        this.realGrass.rotation.x = -Math.PI / 2; 
        this.realScene.add(this.realGrass);

        this.realBox = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        this.realBox.position.set(0, 0.5, 0);
        this.realScene.add(this.realBox);
        this.realScene.background = new THREE.Color(0xFFFFFF);

        this.whiteScene = new THREE.Scene();
        this.whiteBg = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.whiteBg.position.z = -1;

        this.whiteScene.add(this.whiteBg);

        console.log(this.realScene, this.whiteScene);

        this.IsPlaying = true;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.mouseEvents();
        this.setUpPipeline();


    }

    mouseEvents() {
    this.raycastPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            visible: false
        })
    );

    this.sphere = new THREE.Mesh(
        new THREE.CircleGeometry(8, 20, 20),
        new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true
            // map: new TextureLoader().load('https://threejs.org/examples/textures/sprites/circle.png'),
        })
    );


    this.scene.add(this.raycastPlane, this.sphere);

        window.addEventListener('pointermove', (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects([this.raycastPlane], true);

            if (intersects.length > 0) {
                this.sphere.position.copy(intersects[0].point);
            }

    })
    }

    setUpPipeline() {

        this.sourceTarget = new THREE.WebGLRenderTarget(this.width, this.height ) ;

        this.targetA = new THREE.WebGLRenderTarget(this.width, this.height );
        this.targetB = new THREE.WebGLRenderTarget(this.width, this.height );

        this.renderer.setRenderTarget(this.realSceneTarget);
        this.renderer.render(this.realScene, this.camera);

        this.renderer.setRenderTarget(this.whiteTarget);
        this.renderer.render(this.whiteScene, this.camera);

        this.fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.fboScene = new THREE.Scene();
        this.fboMaterial = new THREE.ShaderMaterial({
            uniforms:{
                time: { value: 0 },
                tDiffuse:{ value: null },
                tPrev:{ value: this.whiteTarget.texture },
                tReveal:{ value: this.realSceneTarget.texture },
                uProgress:{ value: 0 },
                resolution:{ value: new THREE.Vector4(this.width, this.height, 1, 1) },
            },
            vertexShader: TestVertexShader,
            fragmentShader: FragmentFboShader,
    })

    this.fboQuad = new THREE.Mesh( new THREE.PlaneGeometry(2, 2), this.fboMaterial );
    this.fboScene.add(this.fboQuad);

    this.finalScene = new THREE.Scene();
    this.finalQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({map: this.targetA.texture}));
    this.finalScene.add(this.finalQuad);

    }

}