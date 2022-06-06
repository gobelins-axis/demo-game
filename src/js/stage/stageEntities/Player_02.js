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
        this._model = AssetsManager.models.Cowboy;
        this._ennemyOptions = {
            speed: 0,
            direction: 0,
            joystickAcceleration: 0,
        };

        this._ennemyControls = {
            turnLeft: false,
            turnRight: false,
        };
        this._meshes = [];

        this._setupEnnemyControls();


    }


    /** 
     * Public 
    */

    build() {
        this._ennemyModel = this._model.scene;
        this._ennemyModel.position.z = 200;
        this._ennemyModel.rotation.y = Math.PI;
        this._ennemyModel.scale.set(0.6, 0.6, 0.6);
        AppManager.PLAYER_02 = this._ennemyModel;
        
        AppManager.CAMERA_RIGHT.position.x = this._ennemyModel.position.x;
        AppManager.CAMERA_RIGHT.position.y = 2;
        AppManager.CAMERA_RIGHT.position.z = this._ennemyModel.position.z + 5;
        // AppManager.CAMERA_RIGHT.lookAt(this._ennemyModel.position);
        this._projectilesManager = new ProjectilesManager();

        this._model.animationComponent.playAnimation({animation: 'Idle', loop: true, speed: 1});

        this.add(this._ennemyModel, this._projectilesManager);
    }

    update(delta) {
        this._projectilesManager.update();
        this._timeUpdate += 0.002;
        this._ennemyModel.position.z += this._ennemyOptions.speed;

        gsap.to(AppManager.CAMERA_RIGHT.position, {x: this._ennemyModel.position.x, duration: 1, ease:"power3.out", onUpdate: () => {

        }});

        this._ennemyModel.position.x = Tools.clamp(this._ennemyModel.position.x += this._ennemyOptions.direction, -4.5, 4.5);

        const gamepads = navigator.getGamepads();
        if (gamepads[0]) AppManager.AXIS.joystick1.setGamepadJoystick(gamepads[0], 1); // First joystick of gamepad 1
        if (gamepads[0]) AppManager.AXIS.joystick2.setGamepadJoystick(gamepads[0], 2);
        // this._ennemyModel.rotation.y = Tools.clamp(this._ennemyOptions.direction * 3, -Math.PI /2, Math.PI /2);
        // gsap.to(this._ennemyModel.rotation, {y: Tools.clamp(this._ennemyOptions.direction * 2, -Math.PI /2, Math.PI /2), duration: 0.2});
    }

    /** 
     * Private 
    */

    _setupEnnemyControls(){
        AppManager.AXIS.registerKeys("q", "a", 2);
        AppManager.AXIS.registerKeys("s", "b", 2);
        AppManager.AXIS.registerKeys("d", "c", 2);
        // AppManager.AXIS.registerKeys("f", "d", 1);

        const player1 = AppManager.AXIS.createPlayer({
            id: 2,
            joystick: AppManager.AXIS.joystick2,
            buttons: AppManager.AXIS.buttonManager.getButtonsById(2),
        });


        player1.addEventListener("keydown", (e) => this._keyDownHandler(e));
        player1.addEventListener("keyup", (e) => this._keyUpHandler(e));
        AppManager.AXIS.joystick1.addEventListener("joystick:move", (e) => this._joystick1moveHandler(e));
        AppManager.AXIS.joystick2.addEventListener("joystick:move", (e) => this._joystick2moveHandler(e));
    }

    _keyDownHandler(e) {

        if(e.key === "a") {
            this._ennemyOptions.direction = 0.2;
        }
        if(e.key === "b") {
            this._ennemyOptions.direction = -0.2;
        }

        if(e.key === "c"){
            this._model.animationComponent.animFade({from:"Idle", to:"Punch", loop: false, duration: 0.1, speed: 3});
            setTimeout(() => {
                this._projectilesManager.launchProjectile();
            }, 200);
        }
    }

    _keyUpHandler() {
        this._ennemyOptions.direction = 0;

        setTimeout(() => {
            this._model.animationComponent.animFade({ from:"Punch", to:"Idle", loop: true, duration: 1 });
        }, 300);

    }
    _joystick1moveHandler(e) {
        this._ennemyOptions.direction = e.position.x * -0.2;
        // position1.x += speed * e.position.x;
        // position1.y += speed * e.position.y;
    }
    _joystick2moveHandler(e) {
        // console.log("cc");
        // const speed = 50;
        // this._ennemyOptions.direction = -0.2;
        // position1.x += speed * e.position.x;
        // position1.y += speed * e.position.y;
    }

    resetEnnemyOnCollision(body) {
        body.position.x = (Math.random()- 0.5) * 2 - 30;
        body.position.y = 0;
        body.position.z = (Math.random()- 0.5) * 2;

    }

    touchStartHandler() {
    }
}