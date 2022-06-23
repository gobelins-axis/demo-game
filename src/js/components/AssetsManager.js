import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import AnimationComponent from './AnimationComponent';
import px from "../../assets/images/hdr/px.png";
import nx from "../../assets/images/hdr/nx.png";
import py from "../../assets/images/hdr/py.png";
import ny from "../../assets/images/hdr/ny.png";
import pz from "../../assets/images/hdr/pz.png";
import nz from "../../assets/images/hdr/nz.png";
const ASSETS = {
    models: {},
    sounds: {},
    textures: {},
    hdrTextures: {},
    videos: {},
};

class AssetsManager{
    constructor() {
        this._promises = [];

        this._gltfLoader = new GLTFLoader();
        this._textureLoader = new THREE.TextureLoader();
        this._cubeTextureLoader = new THREE.CubeTextureLoader();

        this._additionalTextures = {};
    }

    loadFont(fonts, callback) {
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

    loadAssets() {
        this._loadTextures();
        // this._loadHdrTextures();
        this._loadVideos();
        this._loadModels();
        this._loadSounds();

        return Promise.all(this._promises);
    }

    _loadHdrTextures() {
        let cubeTextureCache = [];
        let textures = [px, nx, py, ny, pz, nz];
        // for (const texture in cubeTextureCache) {
        //     textures.push(cubeTextureCache[texture].file.default);
        // }

        let promise = new Promise((resolve, reject) => {
            this._cubeTextureLoader.load(textures, resolve);
        }).then((result) => {
            result.encoding = THREE.sRGBEncoding;
            result.flipY = false;
            ASSETS.hdrTextures["background"] = result;
        });

        this._promises.push(promise);
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

    _loadVideos() {
        let videoCache = [];
 
        this.importAll(
            require.context(
                "../../assets/videos/",
                true,
                /\.(?:mp4)$/i,
            ),
            videoCache,
        );
        for (const video in videoCache) {
            const videoFile = videoCache[video].file.default;
            const videoHTML = document.createElement('video');
            videoHTML.src = videoFile;

            videoHTML.autoplay = true;
            videoHTML.loop = true;
            videoHTML.muted = true;
            videoHTML.playsinline = true;
    
            const promise = new Promise((resolve) => {
                videoHTML.addEventListener('canplay', () => {
                    const videoTexture = new THREE.VideoTexture(videoHTML);
                    videoTexture.flipY = false;
                    videoHTML.play();
    
                    // setTimeout(() => {
                    //     videoHTML.pause();
                    // }, 1);
    
                    resolve(videoTexture);
                });
            }).then((result) => {
                ASSETS.videos[videoCache[video].name] = result;
            });;
    

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

    get GLTFLoader() {
        return this._gltfLoader;
    }

    get TextureLoader() {
        return this._textureLoader;
    }

    get models() {
        return ASSETS.models;
    }

    get videos() {
        return ASSETS.videos;
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
