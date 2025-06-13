import * as THREE from 'three';
import EventEmitter from './EventEmitter';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default class Ressources extends EventEmitter
{
    constructor(sources)
    {
        super();
        
        //options
        this.sources = sources;

        //setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }   

        setLoaders()
        {
            //loaders
            this.loaders = {};
            this.loaders.gltfLoader = new GLTFLoader();
            this.loaders.textureLoader = new THREE.TextureLoader();
            this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        }

        startLoading()
        {
            for (const sources of this.sources)
            {
                if (sources.type === 'gltfModel')
                {
                    this.loaders.gltfLoader.load(
                        sources.path,
                        (file) =>
                        {
                            this.sourceLoaded(sources, file);
                        }
                    );
                }
                else if (sources.type === 'texture')
                {
                    this.loaders.textureLoader.load(
                        sources.path,
                        (file) =>
                        {
                            this.sourceLoaded(sources, file);
                        }
                    );
                }
                else if (sources.type === 'cubeTexture')
                {
                    this.loaders.cubeTextureLoader.load(
                        sources.path,
                        (file) =>
                        {
                            this.sourceLoaded(sources, file);
                        }
                    );
                }
                else if (sources.type === 'image')
                {
                    const image = new Image();
                    image.src = sources.path;
                    image.onload = () =>
                    {
                        this.sourceLoaded(sources, image);
                    };
                }
            }
    }

        sourceLoaded(sources, file)
        {
            this.items[sources.name] = file;
            this.loaded++;
            if (this.loaded === this.toLoad)
            {
                this.trigger('ready');
            }
        }
}