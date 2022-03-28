import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';
import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class Ennemies extends Object3D{
    constructor(options) {
        super();
        this.isModelAnimated = true;
        this.is3dModel = true;
        this.model = AssetsManager.models.Car;

        this._ennemies = [];
        this._ennemiesBoxes = [];

        this._boundingBoxMin = new THREE.Vector3(-1, -1, -2);
        this._boundingBoxMax = new THREE.Vector3(1, 1, 2 );
        this._box = new THREE.Box3( this._boundingBoxMin, this._boundingBoxMax);


        this._ennemyPosZ = 40;
        this._ennemyOffset = 40;
        this._ennemiesCount = 10;

        for (let index = 0; index < this._ennemiesCount; index++) {
            this._createEnnemies();            
        }

    }
    /** 
     * Public 
    */
    
    get ennemiesBoxes() {
        return this._ennemiesBoxes;
    }
    
    get ennemiesMeshes() {
        return this._ennemies;
    }

    build(models) {
    }

    update(delta, isReady) {
        for (let index = 0; index < this._ennemies.length; index++) {
            const ennemy = this._ennemies[index].scene;

            this._ennemiesBoxes[index].copy(this._box).applyMatrix4( ennemy.matrixWorld );

            if(  ennemy.position.z + 10 < AppManager.PLAYER.position.z) {
                ennemy.position.z += this._ennemyPosZ ;
            }
            ennemy.position.z -= 1;
        }
    }

    /** 
     * Private 
    */

    _createEnnemies() {
        this._ennemyPosZ += this._ennemyOffset;
        const pos = new THREE.Vector3((Math.random() - 0.5) * 8, 0, this._ennemyPosZ);
        const scale = 0.7;
        const model = Tools.cloneGltf(this.model);
        model.scene.position.copy(pos);
    
        model.scene.scale.set(1, 1, 1);

        const box = new THREE.Box3().setFromObject(model.scene);


        const helper = new THREE.Box3Helper( box, 0xffff00 );
        this.add( helper );

        this._ennemies.push(model);
        this._ennemiesBoxes.push(box);

        this.add(model.scene);
    }
}