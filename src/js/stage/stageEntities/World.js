import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';
import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class World extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;


        this._model = AssetsManager.models.World;

    }


    /** 
     * Public 
    */

    build() {
        // this._setupRoads();
        const trainMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.Train});
        const trainObject = this._model.scene.getObjectByName("Locomotive");
        trainObject.material = trainMaterial;

        const groundMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.Ground});
        const groundObject = this._model.scene.getObjectByName("Ground");
        groundObject.material = groundMaterial;

        const houseMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.House});
        const houseObject = this._model.scene.getObjectByName("House");
        houseObject.material = houseMaterial;

        this.add(this._model.scene);
    }

    update(delta) {
        // this._checkRoadReplace();
    }

    /** 
     * Private 
    */
}