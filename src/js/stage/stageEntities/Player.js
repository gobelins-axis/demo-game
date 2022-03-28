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
    }


    /** 
     * Public 
    */

    build() {
        this._model.animationComponent.playAnimation({animation: 'Run', loop: true, speed: this._options.playerSpeed * 10});
        this._playerModel = this._model.scene;
        
        AppManager.PLAYER = this._playerModel;

        this.add( this._playerModel);
    }

    update(delta) {
        this._timeUpdate += 0.02;
        this._playerModel.position.z += this._options.playerSpeed;
        AppManager.CAMERA.lookAt(this._model.scene.position);
        gsap.to(AppManager.CAMERA.position, {x: this._model.scene.position.x, y: this._model.scene.position.y + 5, z: this._model.scene.position.z - 10});

        // this._modelTalk.scene.getObjectByName("Human").material.uniforms.uTime.value = this._timeUpdate;
    }

    /** 
     * Private 
    */

}