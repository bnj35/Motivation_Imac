import * as lil from 'lil-gui';

export default class Debug 
{
    constructor() {
        this.active = window.location.hash === '#debug';
        if (this.active) {
            this.ui = new lil.GUI();
        }
    }

    addEntry(name, object) {
        if (this.active) {
            this.ui.add(object, name);
        }
    }

    addFolder(name) {
        if (this.active) {
            return this.ui.addFolder(name);
        }
    }
}