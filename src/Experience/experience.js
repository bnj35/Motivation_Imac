import Sizes from './Utils/sizes.js';
import Time from './Utils/time.js';
import * as THREE from 'three';
import Camera from './camera.js';
import Renderer from './renderer.js';
import World from './World/world.js';
import Resources from './Utils/Resources.js';
import Sources from './sources.js';
import Debug from './Utils/Debug.js';
import StatsPannel from './Utils/stats.js';

let instance = null;

export default class Experience {

    constructor(canvas) {

        if(instance){
            return instance;
        }
        instance = this;

        //global access
        window.experience = this;

        //options 
        this.canvas = canvas;
        //setup
        
        this.resources = new Resources(Sources);
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();

        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        this.renderer.setReveal(this.world.reveal);
        this.stats = new StatsPannel();


        this.sizes.on('resize', () => {
            this.resize();
        });

        this.time.on('tick', () => {
            this.update();
    
        });

        if(this.debug.active)
    {
        this.debugFolder = this.debug.ui.addFolder('experience');
        this.debugFolder.close();
    }
        
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        // this.camera.update();
        this.world.update();
        this.renderer.update();
        this.stats.update();

    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');
        this.scene.traverse((child)=>
        {
            child.geometry.dispose();
            for(const key in child.material)
            {
                const value = child.material[key];
                if(value && typeof value.dispose === 'function')
                {
                    value.dispose();
                }
            }
        }
    )
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    }
}