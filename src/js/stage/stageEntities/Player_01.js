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
        // this._timeUpdate = 0;
        this._model = AssetsManager.models.TheBoss;
        this._playerOptions = {
            speed: 0,
            direction: 0,
            joystickAcceleration: 0,
            anglePlayer: 0,
        };

        this._pos = {
            x: 0,
            y: 0,
        };

        this._isCollide = false;

        this._isWin = false;

        this._setupPlayerControls();
        this._setupPlayerBoundingBox();

    }

    get playerBox() {
        return this._playerBox;
    }

    get isCollide() {
        return this._isCollide;
    }
    get isWin() {
        return this._isWin;
    }

    get playerPos() {
        return this._playerModel.position;
    }

    set isCollide(value) {
        this._isCollide = value;
    }

    set isWin(value) {
        this._isWin = value;
    }

    /** 
     * Public 
    */

    build() {
        this._model.animationComponent.playAnimation({animation: 'Idle', loop: true});
        this._playerModel = this._model.scene;
        this._playerModel.position.z = -80;
        this._playerModel.position.y = -0.6;
        
        AppManager.PLAYER_01 = this._playerModel;

        this.add(this._playerModel);
    }

    update(delta) {
        this._gamepadEmulator.update();
        if(this._isWin) return;
        this._playerModel.position.x = Tools.clamp(this._playerModel.position.x + this._pos.x, -2.8, 2.8);
        this._playerModel.position.z += this._pos.y;
        // this._playerModel.position.x = Tools.clamp(this._playerModel.position.x + Math.sin(this._playerOptions.anglePlayer) * 0.2, -2.8, 2.8);
        // this._playerModel.position.z += Math.cos(this._playerOptions.anglePlayer) * 0.2;
        this._playerModel.lookAt(new THREE.Vector3(this._playerModel.position.x + Math.sin(this._playerOptions.anglePlayer), -0.5, this._playerModel.position.z + Math.cos(this._playerOptions.anglePlayer)));

        gsap.to(AppManager.LEFT_CAMERA.position, {x: this._model.scene.position.x, y: this._model.scene.position.y + 5, z: this._model.scene.position.z - 15, duration: 1, ease:"power3.out", onUpdate: () => {
            AppManager.LEFT_CAMERA.lookAt(this._model.scene.position);
        }});
        this._playerBox.copy(this._box).applyMatrix4( this._playerModel.matrixWorld );

        if((this._playerOptions.anglePlayer > 0 || this._playerOptions.anglePlayer < 0) && this._model.animationComponent.getCurrentAnim() !== "Run") {
            this._model.animationComponent.animFade({from: this._model.animationComponent.getCurrentAnim(), to:"Run", loop: true, duration: 0.1, speed: 3});
        }
        if(this._playerOptions.anglePlayer === 0 && this._model.animationComponent.getCurrentAnim() !== "Idle"){
            this._model.animationComponent.animFade({from:"Run", to:"Idle", loop: true, duration: 0.1, speed: 1});
        }
    }

    winPlayer() {
        this._model.animationComponent.animFade({from: this._model.animationComponent.getCurrentAnim(), to:"Dance", loop: true, duration: 0.1, speed: 1});

    }

    resetPlayerPos() {
        this._isWin = false;
        this._playerModel.position.z = -80;
        this._model.animationComponent.animFade({from: this._model.animationComponent.getCurrentAnim(), to:"Idle", loop: true, duration: 0.1, speed: 1});

    }



    /** 
     * Private 
    */

   
    _setupPlayerControls(){
        AppManager.AXIS.registerKeys("ArrowLeft", "a", 1);
        AppManager.AXIS.registerKeys("ArrowRight", "x", 1);
        AppManager.AXIS.registerKeys("ArrowUp", "i", 1);
        AppManager.AXIS.registerKeys("ArrowDown", "s", 1);

        this._gamepadEmulator = AppManager.AXIS.createGamepadEmulator(0);
        AppManager.AXIS.joystick1.setGamepadEmulatorJoystick(this._gamepadEmulator, 0);
        AppManager.AXIS.registerGamepadEmulatorKeys(this._gamepadEmulator, 0, "a", 1);

        const player1 = AppManager.AXIS.createPlayer({
            id: 1,
            joysticks: AppManager.AXIS.joystick1,
            buttons: AppManager.AXIS.buttonManager.getButtonsById(1),
        });


        // player1.addEventListener("keydown", (e) => this._keyDownHandler(e));
        // player1.addEventListener("keyup", (e) => this._keyUpHandler(e));
        player1.joysticks[0].addEventListener("joystick:move", (e) => this._joystickMoveHandler(e));
    }

    _setupPlayerBoundingBox() {
        this._boundingBoxMin = new THREE.Vector3(-0.5, 0, -0.3);
        this._boundingBoxMax = new THREE.Vector3(0.5, 2, 0.3 );
        this._box = new THREE.Box3( this._boundingBoxMin, this._boundingBoxMax);

        this._playerBox = new THREE.Box3().setFromObject(this._model.scene);

        const helper = new THREE.Box3Helper( this._playerBox, 0xffff00 );
        // this.add( helper );
    }

    _joystickMoveHandler(e) {
        this._pos.x = -e.position.x * 0.2;
        this._pos.y = e.position.y * 0.2;
        this._playerOptions.anglePlayer = Math.atan2(-e.position.x, e.position.y);
    }
}