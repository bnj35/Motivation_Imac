import Experience from "./experience";
import * as THREE from "three";


export default class Renderer {
  constructor() {
    this.Experience = new Experience();
    this.canvas = this.Experience.canvas;
    this.scene = this.Experience.scene;
    this.camera = this.Experience.camera;
    this.sizes = this.Experience.sizes;

    this.reveal = null;

    this.customRenderFunction = null; 

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor("#000000");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelratio, 2));
  }

    setReveal(revealInstance) {
        this.reveal = revealInstance
    }



    setCustomRenderFunction(renderFunction) {
    this.customRenderFunction = renderFunction;
  }


  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelratio, 2));
  }

  update() {


            this.instance.setRenderTarget(this.reveal.sourceTarget)
            this.instance.render(this.scene, this.camera.instance)

            this.instance.setRenderTarget(this.reveal.targetA)
            this.instance.render(this.reveal.fboScene, this.reveal.fboCamera)
            this.reveal.fboMaterial.uniforms.tDiffuse.value = this.reveal.sourceTarget.texture
            this.reveal.fboMaterial.uniforms.tPrev.value = this.reveal.targetA.texture
            this.reveal.fboMaterial.uniforms.time.value = this.Experience.time.elapsed / 1000;


            this.reveal.finalQuad.material.map = this.reveal.targetA.texture
            this.instance.setRenderTarget(null)
            this.instance.render(this.reveal.finalScene, this.reveal.fboCamera)

            
            // Swap targets
            let temp = this.reveal.targetA
            this.reveal.targetA = this.reveal.targetB
            this.reveal.targetB = temp;

  }
}
