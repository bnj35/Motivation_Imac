import * as THREE from 'three';
import Experience from '../experience.js';
import Environment from './environment.js'; // Import Environment

export default class RevealScene {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        // Renderer is not needed here directly, World will manage it.

        this.contentScene = new THREE.Scene(); // This scene holds the content for the reveal texture
        this.environment = new Environment(this.contentScene); // Environment for this specific scene

        this.resources.on('ready', () => {
            const buildingPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(100, 100),
                new THREE.MeshBasicMaterial({ color: 0x008900 })
            );
            buildingPlane.position.y = -0.1;
            buildingPlane.rotation.x = -Math.PI / 2;
            buildingPlane.name = 'buildingPlane';
            this.contentScene.add(buildingPlane);

            // Add other elements previously in Reveal.js's realScene here
            this.addContentElements();

            console.log('Reveal content scene ready');
            console.log(this.contentScene);
        });
    }

    addContentElements() {
        const realGrass = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({ color: 0x008900 })
        );
        realGrass.position.y = -0.1;
        realGrass.rotation.x = -Math.PI / 2;
        this.contentScene.add(realGrass);

        const realPlanes = [];
        let RandHexacolor = () => Math.floor(Math.random() * 16777215);

        for (let i = 0; i < 10; i++) {
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(10, 10),
                new THREE.MeshBasicMaterial({ color: RandHexacolor(), side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
            );
            plane.material.color.setHex(RandHexacolor());
            plane.position.set(
                (Math.random() - 0.5) * 30,
                0,
                (Math.random() - 0.5) * 50
            );
            plane.scale.setScalar(Math.random() * 0.5 + 0.5);
            plane.rotation.x = Math.PI;
            realPlanes.push(plane);
        }
        realPlanes.forEach(plane => {
            this.contentScene.add(plane);
        });

        const realBox = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        realBox.position.set(0, 0.5, 0);
        this.contentScene.add(realBox);
        this.contentScene.background = new THREE.Color(0xFFFFFF);
    }
}