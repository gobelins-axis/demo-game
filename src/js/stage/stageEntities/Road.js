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
        this._roadOptions = {
            roadSize: 19,
            numberOfRoads: 20,
            roadOffset: 0,
        };

        this._roadOptions.roadOffset -= this._roadOptions.roadSize;

        this._roadMeshes = [];

        this._model = AssetsManager.models.Road;

    }


    /** 
     * Public 
    */

    build() {
        this._setupRoads();
    }

    update(delta) {
        // this._checkRoadReplace();
    }

    /** 
     * Private 
    */

    _setupRoads() {
        for (let index = 0; index < this._roadOptions.numberOfRoads; index++) {
            let mesh = this._model.scene.clone();

            this._roadOptions.roadOffset += this._roadOptions.roadSize;
            mesh.rotation.y += Math.PI / 2;
            mesh.position.z += this._roadOptions.roadOffset;
            
            this._roadMeshes.push(mesh);
            
            this.add(mesh);
        }

    }

    _checkRoadReplace() {
        for (let index = 0; index < this._roadMeshes.length; index++) {
            let roadElm = this._roadMeshes[index];
            if(roadElm.position.z + this._roadOptions.roadSize * 2 < AppManager.PLAYER.position.z) {
                roadElm.position.z += this._roadOptions.roadOffset;
            }
            
        }
    }
}