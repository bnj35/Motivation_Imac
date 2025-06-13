import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
    constructor() {

        super();
        //options
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelratio = Math.min(window.devicePixelRatio, 2);

        //resize event
        window.addEventListener('resize', () => {
            this.resize();
            this.trigger('resize');
        });
    }

    resize() {
        //update sizes
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this .pixelratio = Math.min(window.devicePixelRatio, 2);
    }
}