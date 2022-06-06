import Stage from '../stage/Stage';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import gsap from 'gsap';
import SoundManager from './SoundManager';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

import Axis from 'axis-api';

const DEBUG = false; 
const FPS = 60; 

class AppManager{
    constructor() {

        this._canvas = document.querySelector('.canvas');

        gsap.ticker.fps(FPS);

        this._eventDispatcher = new THREE.EventDispatcher();

        this._appStatus = {
            isReady: false,
            isStarted: false,
            isPaused: false,
            isReset: false,
            isDebug: DEBUG,
            FPS: FPS,
        };
        
        this._delta = 0;
        this._clock = new THREE.Clock();
        this._elapsedTime = 0;
        //mouse params
        this._touchValues = {
            mousePosition: {x: 0, y: 0},
            oldPos: {x: 0, z: 0},
            isUserTouch: false,
            lastTouch: {x: 0, y:0},
            velocity: 0,
        };
        this._scrollPercent = 0;
     
    }
    
    get EVENT_DISPATCHER() {
        return this._eventDispatcher;
    }
    
    get RENDERER() {
        return this._renderer;
    }

    get SCENE() {
        return this._renderTargetScene;
    }

    get MAIN_CAMERA(){
        return this._mainCamera;
    } 

    get CAMERA_LEFT() {
        return this._leftCamera;
    }

    get CAMERA_RIGHT() {
        return this._rightCamera;
    }

    get STATUS() {
        return this._appStatus;
    }

    get DELTA_TIME() {
        return this.delta;
    }

    get CLOCK() {
        return this._clock;
    }

    get SOUND_MANAGER() {
        return this._soundManager;
    }

    get PLAYER_01() {
        return this._player01;
    }
    
    get PLAYER_02() {
        return this._player02;
    }

    get AXIS() {
        return Axis;
    }

    set PLAYER_01(value) {
        this._player01 = value;
    }
    set PLAYER_02(value) {
        this._player02 = value;
    }
    /** 
     * Public 
    */

    setup() {
        this._renderer =  this._setupRenderer();

        this._mainScene =  this._setupMainScene();
        this._renderTargetScene = this._setupRenderTargetScene();

        this._mainCamera = this._setupMainCamera();
        this._leftCamera =  this._setupLeftCamera();
        this._rightCamera =  this._setupRightCamera();

        this._leftRenderTarget = this._setupRenderTarget();
        this._rightRenderTarget = this._setupRenderTarget();
        
        this._plane = this._setupPlane();

        // this._soundManager =  this._setupSoundManager();
        this._renderPass = this._setupRenderPass();

        this._setupOrbitControls();

        if(this.STATUS.isDebug) this._setupStats();
        
        this._stage = this._setupStage();

        this.resize();

        this._setupEventListeners();

        this.STATUS.isReady = true;
    }

    createLevel() {

    }
    
    start() {
        this.STATUS.isStarted = true;

        this._stage?.onStartStage();
    }

    pause(paused) {
        this.STATUS.isPaused = paused;
        this._soundManager.pauseAllSounds();
    }

    resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._canvas.width = this._width;
        this._canvas.height = this._height;

        this._resizeMainCamera(this._width, this._height);

        this._leftCamera.aspect =  (this._width / 2) /  this._height;
        this._leftCamera.updateProjectionMatrix();

        this._rightCamera.aspect = (this._width / 2) / this._height;
        this._rightCamera.updateProjectionMatrix();
        
        this._renderer.setSize(this._width, this._height);
        this._resizeRenderTargets(this._width, this._height);

        this._stage?.onResizeStage(this._width, this._height);
    }

    reset() {
        this.STATUS = {
            isReady: false,
            isStarted: false,
            isPaused: false,
            isWin: false,
            isLose: false,
            isReset: false,
            isDebug: true,
            FPS: FPS,
        };
    }

    /** 
     * Private 
    */
   
    _setupStage() {
        return new Stage();
    }
    
    _setupSoundManager() {
        const soundManager = new SoundManager();
        return soundManager;
    }

    _setupRenderer() {
        const renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            // antialias: true,
            // alpha: true,
            // sortObjects: false,
            logarithmicDepthBuffer: true,
        });
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._composer = new EffectComposer( renderer );
        this._composer.setSize(window.innerWidth, window.innerHeight);
        
        return renderer;
    }

    _setupMainScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    _setupRenderTargetScene() {
        const renderTargetScene = new THREE.Scene();
        return renderTargetScene;
    }

    _setupMainCamera() {
        const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        camera.position.z = 1;
        return camera;
    }

    _setupLeftCamera() {
        const camera = new THREE.PerspectiveCamera(60, this._canvas.width / this._canvas.height, 0.001, 500);

        camera.position.x = 0;
        camera.position.y = 4;
        camera.position.z = -10;
        camera.lookAt(0, 0, 0);
        return camera;
    }
    
    _setupRightCamera() {
        const camera = new THREE.PerspectiveCamera(60, this._canvas.width / this._canvas.height, 0.001, 500);

        camera.position.x = 0;
        camera.position.y = 4;
        camera.position.z = 100;
        camera.lookAt(0, 0, 0);

        return camera;
    }

    _setupRenderTarget() {
        const rtWidth = window.innerWidth / 2;
        const rtHeight = window.innerHeight;
        const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
        renderTarget.samples = 1;
        return renderTarget;
    }

    _setupPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uTextureLeft: { value: this._leftRenderTarget.texture },
                uTextureRight: { value: this._rightRenderTarget.texture },
            },
            vertexShader: 
            `
                // Varyings
                varying vec2 vUv;

                void main() {
                    // Output
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                    // Varyings
                    vUv = uv;
                }
            `,
            fragmentShader: 
            `
                // Uniforms
                uniform float uResolution;
                uniform sampler2D uTextureLeft;
                uniform sampler2D uTextureRight;

                // Varyings
                varying vec2 vUv;

                void main() {
                    vec4 texelLeft = texture2D(uTextureLeft, vec2(vUv.x * 2., vUv.y));
                    vec4 texelRight = texture2D(uTextureRight, vec2((1. - vUv.x) * 2., vUv.y));

                    gl_FragColor = mix(texelLeft, texelRight, 1.0 - step(vUv.x, 0.5));
                }
            `,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(window.innerWidth, window.innerHeight, 1);
        this._mainScene.add(mesh);
        return mesh;
    }

    _setupRenderPass() {
        const renderPass = new RenderPass( this._scene, this._leftCamera );
        const afterimagePass = new AfterimagePass();
        this._composer.addPass( renderPass );
        this._composer.addPass( afterimagePass );
        const filmPass = new FilmPass(
            0.35,   // noise intensity
            0.25,  // scanline intensity
            2,    // scanline count
            false,  // grayscale
        );
        filmPass.renderToScreen = true;
        this._composer.addPass( filmPass );
    }

    _resizeMainCamera(width, height) {
        this._mainCamera.left = width / -2;
        this._mainCamera.right = width / 2;
        this._mainCamera.top = height / 2;
        this._mainCamera.bottom = height / -2;

        this._mainCamera.updateProjectionMatrix();
    }

    _resizeRenderTargets(width, height) {
        this._leftRenderTarget.width = width / 2;
        this._leftRenderTarget.height = height;

        this._rightRenderTarget.width = width / 2;
        this._rightRenderTarget.height = height;
    }

    _setupEventListeners() {
        gsap.ticker.add(() =>  this._tickHandler()); 
    
        // document.addEventListener("scroll", (e) => this._onScrollHandler(e), false);

        this._canvas.addEventListener("touchstart", (e) => this._touchStartHandler(e), false);
        this._canvas.addEventListener("touchmove", (e) => this._touchMoveHandler(e), false);
        this._canvas.addEventListener("touchend", (e) => this._touchEndHandler(e), false);

        this._canvas.addEventListener("mousedown", (e) => this._touchStartHandler(e), false);
        this._canvas.addEventListener("mousemove", (e) => this._touchMoveHandler(e), false);
        this._canvas.addEventListener("mouseup", (e) => this._touchEndHandler(e), false);
    }

    _tickDebug() {
        this.delta = this._clock.getDelta();

        this.stats.begin();
        this._stage?.onTick();

        this._renderer.render(this._mainScene, this._mainCamera);
        this.stats.end();
    }

    _tick() {
        this.delta = this._clock.getDelta();

        this._stage?.onTick();
        // this._controls.update();

        // Left
        this._renderer.setRenderTarget(this._leftRenderTarget);
        this._renderer.render(this._renderTargetScene, this._leftCamera);

        // Right
        this._renderer.setRenderTarget(this._rightRenderTarget);
        this._renderer.render(this._renderTargetScene, this._rightCamera);

        // Final
        this._renderer.setRenderTarget(null);
        this._renderer.render(this._mainScene, this._mainCamera);

        this._plane.material.uniforms.uTextureLeft.value = this._leftRenderTarget.texture;
        this._plane.material.uniforms.uTextureRight.value = this._rightRenderTarget.texture;
    }

    /** 
     * Handlers 
    */

    _tickHandler() {
        this.STATUS.isDebug ?
            this._tickDebug() : 
            this._tick();
    }

    _touchStartHandler(e) {
        this._touchValues.isUserTouch = true;
        this._touchValues.mousePosition.x = e.touches ? e.touches[0].pageX : e.clientX;
        this._touchValues.mousePosition.y = e.touches ? e.touches[0].pageY : e.clientY;

        this._touchValues.oldPos.x = e.touches ? e.touches[0].pageX : e.pageX;
        this._touchValues.oldPos.y = e.touches ? e.touches[0].pageY : e.pageY;

        this._eventDispatcher.dispatchEvent({ type: "touchStart", data: this._touchValues });
    }

    _touchMoveHandler(e) {
        if(!this._touchValues.isUserTouch) return;
        this._touchValues.mousePosition.x = e.touches ? e.touches[0].pageX : e.pageX;
        this._touchValues.mousePosition.y = e.touches ? e.touches[0].pageY : e.pageY;

        if (this._touchValues.mousePosition.x < this._touchValues.oldPos.x  && this._touchValues.isUserTouch) {
            this._touchValues.velocity = (this._touchValues.mousePosition.x - this._touchValues.oldPos.x);
        } else if (this._touchValues.mousePosition.x > this._touchValues.oldPos.x && this._touchValues.isUserTouch) {
            this._touchValues.velocity = (this._touchValues.mousePosition.x - this._touchValues.oldPos.x);
        };

        this._touchValues.oldPos.x = this._touchValues.mousePosition.x; 
        this._touchValues.oldPos.y = this._touchValues.mousePosition.y;    

        this._eventDispatcher.dispatchEvent({ type: "touchMove", data: this._touchValues });
    }

    _touchEndHandler() {
        this._touchValues.isUserTouch = false;

        this._touchValues.oldPos.x = 0; 
        this._touchValues.oldPos.y = 0; 
        this._touchValues.mousePosition.x = 0;
        this._touchValues.mousePosition.y = 0;
        this._touchValues.velocity = 0;

        this._eventDispatcher.dispatchEvent({ type: "touchEnd", data: this._touchValues });
    }

    /** 
     * Debug 
    */
   
    _setupStats() {
        this.stats = new Stats();
        this.stats.showPanel( 0 );
        document.body.appendChild( this.stats.dom );
    }
    
    _setupOrbitControls() {
        this._controls = new OrbitControls(this._rightCamera, this._canvas);
        this._controls.update();
        // this._controls.enableDamping = true;
        // this._controls.enabled = this.STATUS.isDebug;

        this._controls.target = new THREE.Vector3(0, 1, 0);
    }
}

export default new AppManager();