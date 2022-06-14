import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';
import GPUParticles from '../../components/GPUParticles';
import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class World extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;


        this._model = AssetsManager.models.World;
        this._setupDustParticleSystem();
        setInterval(() => {
            this.particlesStartTime = -1;
        }, 1000);

    }


    /** 
     * Public 
    */

    build() {
        // this._setupRoads();
        const trainMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.Train, side: THREE.DoubleSide});
        this._trainObject = this._model.scene.getObjectByName("Locomotive");
        this._trainObject.material = trainMaterial;

        const groundMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.Ground, side: THREE.DoubleSide});
        // AssetsManager.textures.Ground.repeat.set( 4, 4 );
        const groundObject = this._model.scene.getObjectByName("Ground");
        groundObject.material = groundMaterial;

        const houseMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.House, side: THREE.DoubleSide});
        const houseObject = this._model.scene.getObjectByName("House");
        houseObject.material = houseMaterial;

        this.add(this._model.scene);
        this._moveTrain();
    }

    update(delta) {
        // this._checkRoadReplace();
        this.particlesSystem.update(delta);
    }

    /** 
     * Private 
    */

    _moveTrain() {
        gsap.to(this._trainObject.position, {z: 350, duration: 50, repeat: -1});
        // gsap.to(this._trainObject.position, {z: 250, duration: 2, repeat: -1});
    }

    _setupDustParticleSystem() {
        this.particlesStartTime = -2;
        this.options = {
            position: new THREE.Vector3(0, 2, 0),
            velocity: new THREE.Vector3(0.0, 0.0, 0.0),
            acceleration: new THREE.Vector3(0.0, 0.0, 0.0),
            color: new THREE.Color(0xfcca50),
            endColor: new THREE.Color(0xfcca50),
            colorRandomness: 0.0,
            lifetime: 200,
            fadeIn: 0.01,
            fadeOut: 0.3,
            size: 2.2,
            sizeRandomness: 1.0,
        };

        this.particlesSystem = new GPUParticles({
            maxParticles: 2000,
            particleSpriteTex: AssetsManager.textures.Dust,
            blending: THREE.AdditiveBlending,
            onTick: (system, time) => {
                if (this.particlesStartTime === -1) this.particlesStartTime = time;
                if (time < this.particlesStartTime + 0.07) {
                    for (let i = 0; i < 50; i++) {
                        this.options.velocity.set(Tools.rand(-1.5, 1.5), Tools.rand(-1.5, 1.5), Tools.rand(-1.5, 1.5));
                        this.options.position.set(Tools.rand(-200, 200), Tools.rand(0, 50), Tools.rand(-500, 500));
                        system.spawnParticle(this.options);
                    }
                }
            },
        });

        this.add(this.particlesSystem);
    }
}