import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';
import ObjectPooling from '../../utils/ObjectPooling';

import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class ProjectilesManager extends Object3D{
    constructor(options) {
        super();
        this.isModelAnimated = true;
        this.is3dModel = true;
        this.model = AssetsManager.models.Donkey;

        this._projectiles = [];
        this._projectilesQueue = [];
        this._projectilesBoxes = [];
        this._projectilesCount = 2;
        this._instanceIndex = 0;

        this._boundingBoxMin = new THREE.Vector3(-0.3, -1, -2);
        this._boundingBoxMax = new THREE.Vector3(0.3, 1, 2 );
        this._box = new THREE.Box3( this._boundingBoxMin, this._boundingBoxMax);


        this._ennemyPosZ = 40;
        this._ennemyOffset = 40;

        
        for (let index = 0; index < this._projectilesCount; index++) {
            this._createProjectiles();            
        }

        this._objectPooling = new ObjectPooling(this._projectiles);
    }
    /** 
     * Public 
    */
    
    get projectilesBoxes() {
        return this._projectilesBoxes;
    }
    
    get projectilesMeshes() {
        return this._projectiles;
    }

    get projectilesQueue() {
        return this._projectilesQueue;
    }

    build(models) {
    }

    update(delta, isReady) {
        for (let index = 0; index < this._projectilesCount; index++) {
            const ennemy = this._projectiles[index];

            this._projectilesBoxes[index].copy(this._box).applyMatrix4( ennemy.matrixWorld );

            ennemy.position.z -= 0.4 * ennemy.userData.speed;
            
            if(  ennemy.position.z < -5) {
                // ennemy.position.z = 0;
                this.resetProjectile(this._projectiles[index], index);
            }
        }
    }

    launchProjectile(object, p) {
        this._objectPooling.act((request, pool) => this._startMovePlayer(request, pool));
    }

    /** 
     * Private 
    */

    _createProjectiles() {
        // this._ennemyPosZ += this._ennemyOffset;
        const pos = new THREE.Vector3(0, 0, AppManager.PLAYER_02.position.z);
        const scale = 0.7;
        const model = Tools.cloneGltf(this.model);
        model.scene.position.copy(pos);
    
        // model.scene.rotation.y = Math.PI / 2;

        model.scene.scale.set(1.5, 1.5, 1.5);
        model.scene.userData.speed = 0;
        model.scene.visible = false;
        
        const animationController = new AnimationComponent({ model, animations: model.animations } );
        model.scene.userData.animationController = animationController;
        
        const box = new THREE.Box3().setFromObject(model.scene);
        
        model.scene.userData.boundingBox = box;
        const helper = new THREE.Box3Helper( box, 0xffff00 );
        this.add( helper );
        this._projectiles.push(model.scene);
        this._projectilesBoxes.push(box);

        this.add(model.scene);
    }

    _startMovePlayer(object, p) {
        this._projectilesQueue.push(object);

        object.userData.animationController.playAnimation({animation: "WalkHorse", loop: true, speed: 2});
        
        object.position.x = AppManager.PLAYER_02.position.x; 
        object.position.z = AppManager.PLAYER_02.position.z; 
        object.userData.speed = 2;
        object.visible = true;
    }

    resetProjectile(ennemy, index) {
        setTimeout(() => {
            ennemy.position.x = 0;
            ennemy.position.y = 0;
            ennemy.position.z = 200;
            ennemy.userData.boundingBox.copy(this._box).applyMatrix4( ennemy.matrixWorld );
            // this._projectilesBoxes[index]

            ennemy.userData.speed = 0;
            ennemy.visible = false;
        }, 1);
        this._objectPooling.add(ennemy);
        this._projectilesQueue.shift();
    }

}