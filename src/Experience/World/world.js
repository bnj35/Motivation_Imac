import Experience from "../experience";
import Environment from "./environment";
import reveal from "./reveal";
import RevealScene from "./revealScene";


export default class World {

    constructor() {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer;
        this.reveal = new reveal();

        this.resources.on('ready', () => {
            this.environment = new Environment();
        }
        );
    }

    update()
    {

    }

}