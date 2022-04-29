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

import Arcade from 'arcade-api';
// import Arcade from '../../../../arcade-api/build/bundle';

const DEBUG = true; 
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
        return this._scene;
    }

    get CAMERA() {
        return this._camera;
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

    get PLAYER() {
        return this._player;
    }

    get ARCADE() {
        return Arcade;
    }

    set PLAYER(value) {
        this._player = value;
    }
    /** 
     * Public 
    */

    setup() {
        this._renderer =  this._setupRenderer();
        this._scene =  this._setupScene();
        this._camera =  this._setupCamera();
        this._soundManager =  this._setupSoundManager();
        this._renderPass = this._setupRenderPass();

        // this._setupOrbitControls();

        if(this.STATUS.isDebug) {
            this._setupStats();
        }
        
        this.resize();

        this._stage = this._setupStage();
        this._setupEventListeners();

        this.STATUS.isReady = true;
    }

    createLevel() {

    }
    
    start() {
        this.STATUS.isStarted = true;

        this.stage.onStartStage();
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

        if(this.stage) {
            this.stage.onResizeStage(this._width, this._height);
        }

        this._camera.aspect =  this._width /  this._height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize( this._width,  this._height);
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
        this.stage = new Stage();
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
            sortObjects: false,
            // logarithmicDepthBuffer: true,
            
        });
        // renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._composer = new EffectComposer( renderer );
        this._composer.setSize(window.innerWidth, window.innerHeight);
        
        return renderer;
    }

    _setupScene() {
        const scene = new THREE.Scene();  

        const near = 10;
        const far = 130;
        // scene.fog = new THREE.Fog(APPManager.RANDOM_COLOR, near, far);
        return scene;
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(60, this._canvas.width / this._canvas.height, 0.001, 500);

        camera.position.x = 10;
        camera.position.y = 10;
        camera.position.z = 10;
        this._defaultCameraPosition = new THREE.Vector3();
        this._defaultCameraPosition.copy(camera.position);
        // this._camera.lookAt(-100, 0, 20);
        return camera;
    }

    _setupRenderPass() {
        const renderPass = new RenderPass( this._scene, this._camera );
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
        this.stage.onTick();

        this._renderer.render(this._scene, this._camera);
        this.stats.end();
    }

    _tick() {
        this.delta = this._clock.getDelta();

        this.stage.onTick();
        // this._controls.update();
        
        // this._composer.render();
        this._renderer.render(this._scene, this._camera);

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

    _onScrollHandler() {
        this._scrollPercent = 0;

        //calculate the current scroll progress as a percentage
        this._scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)) * 100;
        this._eventDispatcher.dispatchEvent({ type: "onScroll", data: this._scrollPercent});
        console.log(this._scrollPercent);
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
        this._controls = new OrbitControls(this._camera, this._canvas);
        this._controls.update();
        // this._controls.enableDamping = true;
        // this._controls.enabled = this.STATUS.isDebug;

        this._controls.target = new THREE.Vector3(0, 1, 0);
    }
}

export default new AppManager();