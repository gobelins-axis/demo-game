//vendors
import * as THREE from 'three';
import gsap from 'gsap';

// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

//components
import GPUParticles from '../components/GPUParticles';

//sceneEntities
import Lights from './stageEntities/Lights';
import Road from './stageEntities/Road';
import SkyBox from './stageEntities/SkyBox';
import Clouds from './stageEntities/Clouds';
import Ennemies from './stageEntities/Ennemies';
import Player from './stageEntities/Player';

//utils
import Tools from "../utils/Tools";

import AssetsManager from '../components/AssetsManager';
import AppManager from '../components/AppManager';

class Stage {
    constructor() {
        this._createEntities();
    
        AppManager.CAMERA.lookAt(0, 1, 0);
    }

    /** 
     * Public 
    */

    onStartStage() {
    }

    onPauseStage() {
    }

    onCreateStage() {
    }

    onResizeStage() {
    }

    onTick() {
        if(AppManager.STATUS.isPaused) return;

        this.elapsedTime = AppManager.CLOCK.getElapsedTime();

        for (let entity in this.sceneEntities) {
            this.sceneEntities[entity].update(AppManager.DELTA_TIME, AppManager.STATUS.isReady);
        }   
    }

    /** 
     * Private 
    */

    _createEntities() {
        this.sceneEntities = {
            lights: new Lights(),
            road: new Road(),
            skyBox: new SkyBox(),
            clouds: new Clouds(),
            ennemies: new Ennemies(),
            player: new Player(),
        };
        for (let model in this.sceneEntities) {
            this.sceneEntities[model].build(this._models);
            AppManager.SCENE.add(this.sceneEntities[model]);
        }
    }

    _setupParticleSystem() {
        this.particlesStartTime = -2;
        this.options = {
            position: new THREE.Vector3(0, 2, 0),
            velocity: new THREE.Vector3(0.0, -10.0, 0.0),
            acceleration: new THREE.Vector3(0.0, 0.0, 0.0),
            color: new THREE.Color(1.0, 1.0, 1.0),
            endColor: new THREE.Color(0.5, 0.5, 0.5),
            colorRandomness: 0.0,
            lifetime: 200,
            fadeIn: 0.01,
            fadeOut: 0.3,
            size: 1.8,
            sizeRandomness: 5.0,
        };

        this.particlesSystem = new GPUParticles({
            maxParticles: 2000,
            particleSpriteTex: AssetsManager.textures.points,
            // blending: THREE.AdditiveBlending,
            onTick: (system, time) => {
                if (this.particlesStartTime === -1) this.particlesStartTime = time;
                if (time < this.particlesStartTime + 0.07) {
                    for (let i = 0; i < 100; i++) {
                        this.options.position.set(Tools.rand(-20, 20), Tools.rand(-20, 20), Tools.rand(-20, 20));
                        system.spawnParticle(this.options);
                    }
                }
            },
        });

        AppManager.SCENE.add(this.particlesSystem);
    }
}

export default Stage;