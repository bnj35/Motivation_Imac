import * as THREE from "three";
import Experience from "./experience";

export default class Camera 
{
    constructor()
    {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();

    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(0,2,30);
        this.instance.lookAt(new THREE.Vector3(0, 15, 0));
        this.scene.add(this.instance);
    }
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

}