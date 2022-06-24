import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import AnimationComponent from './AnimationComponent';
import gsap from 'gsap';
const ASSETS = {
    models: {},
    sounds: {},
    textures: {},
    hdrTextures: {},
};

class AssetsManager{
    constructor() {
        this._promises = [];

        this._loaderScreen = document.querySelector('.js-loader');
        this._progressValue = document.querySelector('.js-mask');
        this._imageCactus = document.querySelector('.image__empty');
        
        this._loaderManager = new THREE.LoadingManager();
        
        this._loaderManager.onProgress = ( url, itemsLoaded, itemsTotal ) => {
            gsap.to(this._progressValue, {height: (itemsLoaded / itemsTotal * 110) + 'px', duration: 3, ease: "bounce.inOut"});
        };
        
        this._promises = [];
        this._gltfLoader = new GLTFLoader(this._loaderManager);
        this._textureLoader = new THREE.TextureLoader(this._loaderManager);

        this._additionalTextures = {};
    }

    hideLoadingScreen() {
        const timeline = gsap.timeline();
        timeline.to(this._loaderScreen, {autoAlpha: 0, delay: 4});
    }

    loadAssets() {
        this._loadTextures();
        this._loadModels();
        // this._loadSounds();

        return Promise.all(this._promises);
    }

    _loadTextures() {
        let textureCache = [];
 
        this.importAll(
            require.context(
                "../../assets/images/",
                true,
                /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
            ),
            textureCache,
        );

        for (const texture in textureCache) {
            let promise = new Promise((resolve, reject) => {
                this._textureLoader.load(textureCache[texture].file.default, resolve);
                ASSETS.textures[textureCache[texture].name] = {};
            }).then((result) => {
                result.encoding = THREE.sRGBEncoding;
                result.flipY = false;
                ASSETS.textures[textureCache[texture].name] = result;
            });

            this._promises.push(promise);
        }
    }

    _loadModels() {
        let modelCache = [];

        this.importAll(
            require.context("../../assets/models/", true, /\.(?:glb|gltf)$/i),
            modelCache,
        );

        for (const model in modelCache) {
            let promise = new Promise((resolve, reject) => {
                this._gltfLoader.load(modelCache[model].file.default, resolve);
                ASSETS.models[modelCache[model].name] = {};
            }).then((result) => {
                result.animations.forEach((clip) => {
                    for(var t = clip.tracks.length - 1; t >= 0; t--) {
                        var track = clip.tracks[t];
                        var animStatic = true;
                        var inc = track.name.split(".")[1] == "quaternion" ? 4 : 3;
            
                        for(var i = 0; i < track.values.length - inc; i += inc) {
                            for(var j = 0; j < inc; j++) {
                                if(Math.abs(track.values[i + j] - track.values[i + j + inc]) > 0.000001) {
                                    animStatic = false;

                                    break;
                                }
                            }
            
                            if(!animStatic)
                                break;
                        }
            
                        if(animStatic) {
                            clip.tracks.splice(t, 1);

                        }
                    }
                });
                if(result.animations[0]) {
                    result.animationComponent = new AnimationComponent({ model: result, animations: result.animations } );
                }
                ASSETS.models[modelCache[model].name] = result;
            });
            this._promises.push(promise);
        }

    }

    _loadSounds() {
        let soundCache = [];

        this.importAll(
            require.context(
                "../../assets/sounds/",
                true,
                /\.(?:ogg|mp3|wav|mpe?g)$/i,
            ),
            soundCache,
        );

        for (const sound in soundCache) {
            let promise = new Promise((resolve, reject) => {
                new THREE.AudioLoader().load(soundCache[sound].file.default,resolve);
                ASSETS.sounds[soundCache[sound].name] = {};
            }).then((result) => {
                ASSETS.sounds[soundCache[sound].name] = result;
            });
            this._promises.push(promise);
        }
    }
    _loadFont(fonts, callback) {
        if (fonts.length > 0) {
            var strTest = "giItTWQy01234&@=-i?0";
            var _noFont = document.createElement("div");
            document.body.appendChild(_noFont);
            _noFont.innerText = strTest;
            _noFont.style.display = "inline";
            _noFont.style.visibility = "hidden";
            _noFont.style.position = "fixed";
            var _myFont = document.createElement("div");
            document.body.appendChild(_myFont);
            _myFont.innerText = strTest;
            _myFont.style.display = "inline";
            _myFont.style.visibility = "hidden";
            _myFont.style.position = "fixed";
            tryLoad();
            var id = 0;
            function tryLoad(){
                var timer = setInterval(function(){
                    _myFont.style.fontFamily = fonts[id];
                    if (
                        _noFont.getBoundingClientRect().width !==
                        _myFont.getBoundingClientRect().width
                    ) {
                        console.log(fonts[id] + " loaded");
                        if (id >= fonts.length - 1) {
                            clearInterval(timer);
                            document.body.removeChild(_noFont);
                            document.body.removeChild(_myFont);
                            setTimeout(() => {
                                callback();
                            }, 200);
                        } else {
                            id++;
                        }
                    }
                }, 100);
            }
        } else {
            callback();
        }
    }

    get GLTFLoader() {
        return this._gltfLoader;
    }

    get TextureLoader() {
        return this._textureLoader;
    }

    get models() {
        return ASSETS.models;
    }

    get sounds() {
        return ASSETS.sounds;
    }

    get textures() {
        return ASSETS.textures;
    }

    get hdrTextures() {
        return ASSETS.hdrTextures;
    }

    importAll(r, cache) {
        r.keys().forEach((key) => {
            const m = key.match(/([^:\\/]*?)(?:\.([^ :\\/.]*))?$/);
            const fileName  = (m === null)? "" : m[1];
            (cache[key] = {
                file: r(key),
                name: fileName,
            });});
    }
}

export default new AssetsManager();
