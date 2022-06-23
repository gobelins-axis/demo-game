import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';

import vertexShader from '../../shaders/CustomBasicMaterial/vertex.glsl';
import fragmentShader from '../../shaders/CustomBasicMaterial/fragment.glsl';

import Tools from '../../utils/Tools';
import gsap from 'gsap';

import ProjectilesManager from './ProjectilesManager';

export default class Player_02 extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;
        this._timeUpdate = 0;
        this._model = AssetsManager.models.Cowboy2;
        this._playerOptions = {
            speed: 0,
            direction: 0,
            joystickAcceleration: 0,
            anglePlayer: 0,
        };

        this._setupPlayerControls();
        this._setupPlayerBoundingBox();


    }


    get projectilesQueue(){
        return this._projectilesManager.projectilesQueue;
    } 

    get projectilesManager(){
        return this._projectilesManager;
    } 
    /** 
     * Public 
    */

    build() {
        this._playerModel = this._model.scene;
        this._playerModel.position.z = 120;
        this._playerModel.position.y = -0.6;
        this._playerModel.rotation.y = Math.PI;
        this._playerModel.scale.set(0.6, 0.6, 0.6);
        AppManager.PLAYER_02 = this._playerModel;
        
        AppManager.RIGHT_CAMERA.position.x = this._playerModel.position.x;
        AppManager.RIGHT_CAMERA.position.y = 5;
        AppManager.RIGHT_CAMERA.position.z = this._playerModel.position.z + 15;
        // AppManager.RIGHT_CAMERA.lookAt(this._playerModel.position);
        this._projectilesManager = new ProjectilesManager();

        this._model.animationComponent.playAnimation({animation: 'Idle', loop: true, speed: 1});

        this.add(this._playerModel, this._projectilesManager);
    }

    update(delta) {
        this._projectilesManager.update();
        this._timeUpdate += 0.002;

        this._playerModel.position.x = Tools.clamp(this._playerModel.position.x + Math.sin(this._playerOptions.anglePlayer) * 0.2, -2.8, 2.8);
        // this._playerModel.position.z += Math.cos(this._playerOptions.anglePlayer) * 0.2;
        this._playerModel.lookAt(new THREE.Vector3(this._playerModel.position.x + Math.sin(this._playerOptions.anglePlayer), -0.5, this._playerModel.position.z + Math.cos(this._playerOptions.anglePlayer)));

        gsap.to(AppManager.RIGHT_CAMERA.position, {x: this._model.scene.position.x, y: this._model.scene.position.y + 5, z: this._model.scene.position.z + 15, duration: 1, ease:"power3.out", onUpdate: () => {
            AppManager.RIGHT_CAMERA.lookAt(this._model.scene.position);
        }});

        this._playerModel.position.x = Tools.clamp(this._playerModel.position.x += this._playerOptions.direction, -4.5, 4.5);
        
        this._playerBox.copy(this._box).applyMatrix4( this._playerModel.matrixWorld );
        if((this._playerOptions.anglePlayer > 0 || this._playerOptions.anglePlayer < 0) && this._model.animationComponent.getCurrentAnim() !== "Walk") {
            this._model.animationComponent.animFade({from: this._model.animationComponent.getCurrentAnim(), to:"Walk", loop: true, duration: 0.1, speed: 3});
        }
        if(this._playerOptions.anglePlayer === 0 && this._model.animationComponent.getCurrentAnim() !== "Idle"){
            this._model.animationComponent.animFade({from:"Walk", to:"Idle", loop: true, duration: 0.1, speed: 1});
        }
    }

    /** 
     * Private 
    */

    _setupPlayerControls(){
        AppManager.AXIS.registerKeys("q", "a", 2);
        AppManager.AXIS.registerKeys("s", "x", 2);
        AppManager.AXIS.registerKeys("d", "i", 2);
        AppManager.AXIS.registerKeys("f", "s", 2);

        const player2 = AppManager.AXIS.createPlayer({
            id: 2,
            joysticks: AppManager.AXIS.joystick1,
            buttons: AppManager.AXIS.buttonManager.getButtonsById(2),
        });


        player2.addEventListener("keydown", (e) => this._keyDownHandler(e));
        player2.addEventListener("keyup", (e) => this._keyUpHandler(e));
        player2.joysticks[0].addEventListener("joystick:move", (e) => this._joystickMoveHandler(e));
    }

    _setupPlayerBoundingBox() {
        this._boundingBoxMin = new THREE.Vector3(-1, 0, -0.3);
        this._boundingBoxMax = new THREE.Vector3(1, 2, 0.3 );
        this._box = new THREE.Box3( this._boundingBoxMin, this._boundingBoxMax);

        this._playerBox = new THREE.Box3().setFromObject(this._model.scene);

        const helper = new THREE.Box3Helper( this._playerBox, 0xffff00 );
        // this.add( helper );
    }

    _keyDownHandler(e) {
        if(e.key === "a"){
            this._model.animationComponent.animFade({from:"Idle", to:"Punch", loop: false, duration: 0.1, speed: 3});
            setTimeout(() => {
                this._projectilesManager.launchProjectile();
            }, 200);
        }
    }

    _keyUpHandler() {
        this._playerOptions.direction = 0;

        setTimeout(() => {
            this._model.animationComponent.animFade({ from:"Punch", to:"Idle", loop: true, duration: 1 });
        }, 300);

    }
  
    _joystickMoveHandler(e) {
        this._playerOptions.anglePlayer = Math.atan2(-e.position.x, -e.position.y);
    }

    resetPlayerOnCollision(body) {
        body.position.x = (Math.random()- 0.5) * 2 - 30;
        body.position.y = 0;
        body.position.z = (Math.random()- 0.5) * 2;

    }

    touchStartHandler() {
    }
}