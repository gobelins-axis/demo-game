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
        this._model = AssetsManager.models.TheBoss;
        this._playerOptions = {
            speed: 0,
            direction: 0,
            joystickAcceleration: 0,
        };

        this._isCollide = false;

        this._playerControls = {
            turnLeft: false,
            turnRight: false,
        };

        this._setupPlayerControls();
        this._setupPlayerBoundingBox();

    }

    get playerBox() {
        return this._playerBox;
    }

    get isCollide() {
        return this._isCollide;
    }

    set isCollide(value) {
        this._isCollide = value;
    }

    /** 
     * Public 
    */

    build() {
        this._model.animationComponent.playAnimation({animation: 'Idle', loop: true});
        this._playerModel = this._model.scene;
        
        AppManager.PLAYER_01 = this._playerModel;

        this.add(this._playerModel);
    }

    update(delta) {
        this._timeUpdate += 0.002;
        this._playerModel.position.z += this._playerOptions.speed;

        gsap.to(AppManager.LEFT_CAMERA.position, {x: this._model.scene.position.x, y: this._model.scene.position.y + 5, z: this._model.scene.position.z - 15, duration: 1, ease:"power3.out", onUpdate: () => {
            AppManager.LEFT_CAMERA.lookAt(this._model.scene.position);
        }});
        this._playerBox.copy(this._box).applyMatrix4( this._playerModel.matrixWorld );
        this._playerModel.position.x = Tools.clamp(this._playerModel.position.x += this._playerOptions.direction, -4.5, 4.5);
        // this._playerModel.rotatio+n.y = Tools.clamp(this._playerOptions.direction * 3, -Math.PI /2, Math.PI /2);
        gsap.to(this._playerModel.rotation, {y: Tools.clamp(this._playerOptions.direction * 2, -Math.PI /2, Math.PI /2), duration: 0.2});
    }

    resetPlayerPos() {
        this._playerModel.position.z = 0;
    }

    /** 
     * Private 
    */

   
    _setupPlayerControls(){
        AppManager.AXIS.registerKeys("ArrowLeft", "a", 1);
        AppManager.AXIS.registerKeys("ArrowRight", "b", 1);
        AppManager.AXIS.registerKeys("ArrowUp", "c", 1);
        AppManager.AXIS.registerKeys("ArrowDown", "d", 1);
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

    _setupPlayerBoundingBox() {
        this._boundingBoxMin = new THREE.Vector3(-0.5, 0, -0.3);
        this._boundingBoxMax = new THREE.Vector3(0.5, 2, 0.3 );
        this._box = new THREE.Box3( this._boundingBoxMin, this._boundingBoxMax);

        this._playerBox = new THREE.Box3().setFromObject(this._model.scene);

        const helper = new THREE.Box3Helper( this._playerBox, 0xffff00 );
        this.add( helper );
    }

  
 
    _keyDownHandler(e) {
        if(this._model.animationComponent.getCurrentAnim() !== "Run") {
            this._model.animationComponent.animFade({from: this._model.animationComponent.getCurrentAnim(), to:"Run", loop: true, duration: 0.1, speed: 3});
        }
        if(e.key === "a") {
            this._playerOptions.direction = 0.2;
        }
        if(e.key === "b") {
            this._playerOptions.direction = -0.2;
        }
        if(e.key === "c") {
            this._playerOptions.speed = 0.2;
        }
        if(e.key === "d") {
            this._playerOptions.speed = -0.2;
        }
    }

    _keyUpHandler() {
        this._playerOptions.direction = 0;
        this._playerOptions.speed = 0;
        this._model.animationComponent.animFade({from:"Run", to:"Idle", loop: true, duration: 0.1, speed: 1});

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