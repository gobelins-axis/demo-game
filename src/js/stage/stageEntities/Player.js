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
    }


    /** 
     * Public 
    */

    build() {
        this._model.animationComponent.playAnimation({animation: 'Run', loop: true});

        this.add( this._model.scene);
    }

    update(delta) {
        this._timeUpdate += 0.02;
        // this._modelTalk.scene.getObjectByName("Human").material.uniforms.uTime.value = this._timeUpdate;
        // this._modelTalk.scene.getObjectByName("Human").material.uniforms.uTimeCos.value = Math.cos(this._timeNoiseUpdate) * 5;
    }

    /** 
     * Private 
    */

}