import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import fragmentShader from "../../shaders/Road/fragment.glsl";
import vertexShader from "../../shaders/Road/vertex.glsl";
import AnimationComponent from '../../components/AnimationComponent';
import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class Rails extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;


        this._model = AssetsManager.models.Rails;

    }


    /** 
     * Public 
    */

    build() {
        // this._setupRails();
        this._setupRoad();
    }

    update(delta) {
        // this._checkrailsReplace();
        this.road.material.uniforms.uTime.value += 0.001;
        // this.road.position.z = AppManager.PLAYER_01.position.z;
    }

    /** 
     * Private 
    */


    _setupRoad() {
        const uniforms = {
            uTime: {value: 0},
            uMap: {value: AssetsManager.textures.Road},
            fogFar: {value: 350},
            fogNear: {value: 50},
            fogColor: {value: new THREE.Color(0xfcca50)},
            fogDensity: {value: 2},
        };

        let geometry = new THREE.PlaneBufferGeometry(6.2, 500, 32, 32);

        this._mat = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms,
            // transparent: true, 
            side: THREE.DoubleSide,
            fog: true,
 
        });
        this.road = new THREE.Mesh(geometry,  this._mat);
        this.road.rotation.x = Math.PI / 2;
        this.road.position.y = -0.65;
        this.add(this.road);
    }
}