import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';

import vertexShader from '../../shaders/CustomBasicMaterial/vertex.glsl';
import fragmentShader from '../../shaders/CustomBasicMaterial/fragment.glsl';

import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class Player_01 extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;
        this._timeUpdate = 0;
        this._model = AssetsManager.models.Player;
        this._playerOptions = {
            speed: 0,
            direction: 0,
            joystickAcceleration: 0,
        };

        this._playerControls = {
            turnLeft: false,
            turnRight: false,
        };

        this._setupPlayerControls();

    }


    /** 
     * Public 
    */

    build() {
        this._model.animationComponent.playAnimation({animation: 'Run', loop: true, speed: this._playerOptions.speed * 10});
        this._playerModel = this._model.scene;
        
        AppManager.PLAYER_01 = this._playerModel;

        this.add(this._playerModel);
    }

    update(delta) {
        this._timeUpdate += 0.002;
        this._playerModel.position.z += this._playerOptions.speed;

        // gsap.to(AppManager.CAMERA.position, {x: this._model.scene.position.x, y: this._model.scene.position.y + 5, z: this._model.scene.position.z - 15, duration: 1, ease:"power3.out", onUpdate: () => {
        // AppManager.CAMERA.lookAt(this._model.scene.position);
        // }});

        this._playerModel.position.x = Tools.clamp(this._playerModel.position.x += this._playerOptions.direction, -4.5, 4.5);
        // this._playerModel.rotation.y = Tools.clamp(this._playerOptions.direction * 3, -Math.PI /2, Math.PI /2);
        gsap.to(this._playerModel.rotation, {y: Tools.clamp(this._playerOptions.direction * 2, -Math.PI /2, Math.PI /2), duration: 0.2});
    }

    /** 
     * Private 
    */

   
    _setupPlayerControls(){
        AppManager.AXIS.registerKeys("ArrowLeft", "a", 1);
        AppManager.AXIS.registerKeys("ArrowRight", "b", 1);
        // AppManager.AXIS.registerKeys("e", "c", 1);
        // AppManager.AXIS.registerKeys("r", "d", 1);

        const player1 = AppManager.AXIS.createPlayer({
            id: 1,
            joystick: AppManager.AXIS.joystick1,
            buttons: AppManager.AXIS.buttonManager.getButtonsById(1),
        });


        player1.addEventListener("keydown", (e) => this._keyDownHandler(e));
        player1.addEventListener("keyup", (e) => this._keyUpHandler(e));
    }

    _keyDownHandler(e) {
        if(e.key === "a") {
            this._playerOptions.direction = 0.2;
        }
        if(e.key === "b") {
            this._playerOptions.direction = -0.2;
        }
    }

    _keyUpHandler() {
        this._playerOptions.direction = 0;
    }

    _joystickMoveHandler(e) {
        if(e.joystickId === 1) {
            this._playerOptions.speed = e.position.x * 0.2;
            this._playerOptions.direction = e.position.y * 0.2;
        } 
        if(e.joystickId === 2) {
            // AppManager.CAMERA.lookAt(e.position.y, e.position.x, 0);
        }
        // this._playerPosition.x += speed * e.x;
    }
}