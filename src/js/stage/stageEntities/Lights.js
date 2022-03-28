import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';

export default class Lights extends Object3D{
    constructor(options) {
        super();
        this._setupHelpers();
    }

    /** 
     * Public 
    */
   
    build() {
        this._createAmbientLight();
        this._addToScene();
    }

    /** 
     * Private 
    */

    _createAmbientLight() {
        this._aLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 1.);
        // this._dLight = new THREE.DirectionalLight(new THREE.Color(0xffffff), 2.);

    }

    _setupHelpers() {
        // this._spotLightHelper = new THREE.SpotLightHelper(this._spotLight, 0.2, 0xffffff);
    }

    _addToScene() {
        this.add(this._aLight, this._dLight);
    }

    update(delta) {
    }
}