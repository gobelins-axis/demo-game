import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import {Sky} from "three/examples/jsm/objects/Sky";

export default class SkyBox extends Object3D{
    constructor(options) {
        super();
        this._setupHelpers();
    }

    /** 
     * Public 
    */
   
    build() {
        this._setupSky();
    }

    /** 
     * Private 
    */

    _setupSky() {
       
        const sky = new Sky();
        sky.scale.setScalar( 4500 );

        const sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 0.312,
            mieCoefficient: 0.007,
            mieDirectionalG: 0.988,
            elevation: 28,
            azimuth: 180,
            exposure: 0.4851,
        };
        
        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );

        AppManager.RENDERER.toneMappingExposure = effectController.exposure;
        this.add( sky );

    }

    _setupHelpers() {
        // this._spotLightHelper = new THREE.SpotLightHelper(this._spotLight, 0.2, 0xffffff);
    }

    _addToScene() {
        this.add(this._aLight);
    }

    update(delta) {
    }
}