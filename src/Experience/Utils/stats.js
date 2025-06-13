import Stats from 'three/addons/libs/stats.module.js';

export default class StatsPannel {
    constructor() {
        this.stats = new Stats();
            this.stats.showPanel(0);
                document.body.appendChild(this.stats.dom);
                this.stats.dom.style.position = 'absolute';
                this.stats.dom.style.top = '0px';
                this.stats.dom.style.left = '0px';
                this.stats.dom.style.zIndex = '1000';
                this.stats.dom.style.pointerEvents = 'none'; 
                this.stats.begin();
        
    }

    update() {
        this.stats.update();
    }
}
