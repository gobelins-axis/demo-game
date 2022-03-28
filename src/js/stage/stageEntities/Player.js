import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';

import vertexShader from '../../shaders/CustomBasicMaterial/vertex.glsl';
import fragmentShader from '../../shaders/CustomBasicMaterial/fragment.glsl';

import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class Humans extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;
        this._timeUpdate = 0;
        this._model = AssetsManager.models.Player;
        this._options = {
            playerSpeed: 0.1,
        };

        this._turnAcceleration = 0;

        this._playerControls = {
            turnLeft: false,
            turnRight: false,
        }; 


        window.__arcadeFeu.registerKey('a', 'ArrowLeft');
        window.__arcadeFeu.registerKey('b', 'ArrowRight');
    
        window.__arcadeFeu.addEventListener("keydown", (e) => {
            if(e.machineKey === "a"){
                this._playerControls.turnLeft = true;
            }else {
                this._playerControls.turnRight = true;
            }
        });
        
        window.__arcadeFeu.addEventListener("keyup", (e) => {
            this._playerControls.turnLeft = false;
            this._playerControls.turnRight = false;
        });
        
        // window.addEventListener("keydown", (e) => this._keyDownHandler(e) );
        // window.addEventListener("keyup", (e) => this._keyUpHandler(e) );
    }


    /** 
     * Public 
    */

    build() {
        this._model.animationComponent.playAnimation({animation: 'Run', loop: true, speed: this._options.playerSpeed * 10});
        this._playerModel = this._model.scene;
        
        AppManager.PLAYER = this._playerModel;

        this.add(this._playerModel);
    }

    update(delta) {
        this._timeUpdate += 0.02;
        this._playerModel.position.z += this._options.playerSpeed;

        gsap.to(AppManager.CAMERA.position, {x: this._model.scene.position.x, y: this._model.scene.position.y + 5, z: this._model.scene.position.z - 15, onUpdate: () => {
            AppManager.CAMERA.lookAt(this._model.scene.position);
        }});
        
        // gsap.to(this._playerModel.rotation, {y: Tools.clamp(this._playerModel.rotation.y += 0.3, -0.9, 0.9)});
        
        if(this._playerControls.turnLeft) {
            this._playerModel.position.x = Tools.clamp(this._playerModel.position.x += 0.3, -4.5, 4.5);
        }
        if(this._playerControls.turnRight) {
            this._playerModel.position.x = Tools.clamp(this._playerModel.position.x -= 0.3, -4.5, 4.5);
        }
        
    }

    /** 
     * Private 
    */

    _setupPlayerControls(){

    } 
    _keyDownHandler(e) {
        switch (e.keyCode) {
            case 37:
                this._playerControls.turnLeft = true;
                break;
            case 39:
                this._playerControls.turnRight = true;
                break;
        }
    }

    _keyUpHandler() {
        this._playerControls.turnLeft = false;
        this._playerControls.turnRight = false;

    }
}