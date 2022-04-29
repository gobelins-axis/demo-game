import * as THREE from 'three';
import vertex from '../../shaders/water/vert.glsl';
import fragment from '../../shaders/water/frag.glsl';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';

export default class WaterFloor extends Object3D{
    constructor(options) {
        super();
        this.textures = AssetsManager.textures;
        this._textureProgress = 0;
        this._textureProgress2 = 10;
        this._timeProgress = 0;
    }

    build() {
        let uniforms = {
            uTimeSin: {value: 0.0},  
            uTimeCos: {value: 0.0},
            uTime: {value: 0.0},
            uTex: {value: AssetsManager.textures.water}, 
            repeat: {value: new THREE.Vector2(2, 2)},

        };
        // console.log(AssetsManager.textures.waterTexture);
        let geometry = new THREE.PlaneBufferGeometry(500, 500, 100, 100);
        let material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms,
            
        });
        
        this._floor = new THREE.Mesh(geometry, material, 1);
        this._floor.renderOrder = -1;
        this._floor.rotation.x = Math.PI/2;
        this._floor.position.y = -0.5;
        this._floor.position.x = -120;
        // this._floor.position.z = 100;

        this._addToScene();
    }


    update(delta) {
        this._textureProgress += 0.003;
        this._textureProgress2 -= 0.03;
        

        this._floor.material.uniforms.uTimeSin.value = Math.sin(this._textureProgress) * 0.5;
        this._floor.material.uniforms.uTimeCos.value = Math.cos(this._textureProgress2) * 0.5;

        this._floor.material.uniforms.uTime.value = this._textureProgress;
    }

    /** 
     * Private 
    */

    _addToScene() {
        this.add(this._floor);
    }
}