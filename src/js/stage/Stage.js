//vendors
import * as THREE from 'three';
import gsap from 'gsap';

//components

//sceneEntities
import Lights from './stageEntities/Lights';
import Road from './stageEntities/Road';
import World from './stageEntities/World';
import SkyBox from './stageEntities/SkyBox';
import CactusInstances from './stageEntities/CactusInstances';
import Player_02 from './stageEntities/Player_02';
import Player_01 from './stageEntities/Player_01';

//utils
import Tools from "../utils/Tools";

import AssetsManager from '../components/AssetsManager';
import AppManager from '../components/AppManager';

class Stage {
    constructor() {
        this._createEntities();
        // AppManager.CAMERA.lookAt(0, 1, 0);
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
        for (let index = 0; index < this.sceneEntities.player_02.projectilesQueue.length; index++) {
            const element = this.sceneEntities.player_02.projectilesQueue[index];
            if(this.sceneEntities.player_01.playerBox.intersectsBox(element.userData.boundingBox) && !this.sceneEntities.player_01.isCollide) {
                this.sceneEntities.player_02.projectilesManager.resetProjectile(this.sceneEntities.player_02.projectilesQueue[index]);
                this.sceneEntities.player_01.isCollide = true;
                this.sceneEntities.player_01.resetPlayerPos();
                AppManager.EVENT_DISPATCHER.dispatchEvent({type: "player_hit", data: "player_01"});

                setTimeout(() => {
                    this.sceneEntities.player_01.isCollide = false;
                }, 10);
            };
        }
        if(this.sceneEntities.player_01.playerPos.z > 120 && !this.sceneEntities.player_01.isWin) {
            AppManager.EVENT_DISPATCHER.dispatchEvent({type: "player_hit", data: "player_02"});
            this.sceneEntities.player_01.winPlayer();
            this.sceneEntities.player_01.isWin = true;
            setTimeout(() => {
                this.sceneEntities.player_01.resetPlayerPos();
            }, 3000);

        }
    }

    /** 
     * Private 
    */

    _createEntities() {
        this.sceneEntities = {
            lights: new Lights(),
            road: new Road(),
            world: new World(),
            skyBox: new SkyBox(),
            cactusInstances: new CactusInstances(),
            player_01: new Player_01(),
            player_02: new Player_02(),
        };
        for (let model in this.sceneEntities) {
            this.sceneEntities[model].build(this._models);
            AppManager.SCENE.add(this.sceneEntities[model]);
        }
    }
}

export default Stage;