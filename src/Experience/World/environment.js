import * as THREE from 'three';
import Experience from '../experience.js';

export default class Environment {
    constructor() {
        
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.debug = this.experience.debug;

        // this.setSunlight();
        // this.setEnvironmentMap();
        this.setAmbientLight();

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment');
            this.debugFolder.close();
            this.debugFolder.add(this.sunlight, 'intensity').min(0).max(10).step(0.001).name('sunlightIntensity');
            this.debugFolder.add(this.environmentMap, 'intensity').min(0).max(10).step(0.001).name('environmentMapIntensity').onChange(() => {
                this.setEnvironmentMap.updateMaterial();
            }
            );
            this.debugFolder.add(this.sunlight.position, 'x').min(-5).max(5).step(0.001).name('sunlightX');
            this.debugFolder.add(this.sunlight.position, 'y').min(-5).max(5).step(0.001).name('sunlightY');
            this.debugFolder.add(this.sunlight.position, 'z').min(-5).max(5).step(0.001).name('sunlightZ');
        }
    }
    
    setSunlight() {
        this.sunlight = new THREE.DirectionalLight('#ffffff', 4);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.mapSize.set(1024, 1024);
        this.sunlight.shadow.camera.far = 15;
        this.sunlight.shadow.normalBias = 0.05;
        this.sunlight.position.set(3.5, 2, -1.25);
        this.scene.add(this.sunlight);
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.5;
        
        this.environmentMap.texture = this.experience.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.environment = this.experience.resources.items.environmentMapTexture;

        this.setEnvironmentMap.updateMaterial = () => 
            {
            this.scene.traverse((child) =>
                {
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) 
                    {
                        child.material.envMap = this.environmentMap.texture;
                        child.material.envMapIntensity = this.environmentMap.intensity;
                        child.material.needsUpdate = true;
                    }
                
            })
        }

        this.setEnvironmentMap.updateMaterial();
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('#ffffff', 100);
        this.scene.add(this.ambientLight);
    }
}