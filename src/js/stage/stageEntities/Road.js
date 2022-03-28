import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';
import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class Road extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;

        // this._model = AssetsManager.models.Island3;
    }


    /** 
     * Public 
    */

    build() {
        let geom = new THREE.PlaneBufferGeometry(10, 20, 1, 1);
        let material= new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color( 0xffffff),
        });
        this._mesh = new THREE.Mesh(geom, material);
        this._mesh.rotation.x += Math.PI / 2;
        this.add(this._mesh);
    }

    update(delta) {
    }

    /** 
     * Private 
    */

}