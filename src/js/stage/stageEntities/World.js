import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import AnimationComponent from '../../components/AnimationComponent';
import GPUParticles from '../../components/GPUParticles';
import Tools from '../../utils/Tools';
import gsap from 'gsap';
import vertexGroundShader from "../../shaders/Ground/vertex.glsl";
import fragmentGroundShader from "../../shaders/Ground/fragment.glsl";

import vertexWaterShader from "../../shaders/Water/vertex.glsl";
import fragmentWaterShader from "../../shaders/Water/fragment.glsl";
export default class World extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;


        this._model = AssetsManager.models.World;
        // this._setupDustParticleSystem();
        setInterval(() => {
            this.particlesStartTime = -1;
        }, 1000);

    }


    /** 
     * Public 
    */

    build() {
        // this._setupRoads();
        const groundMaterial = new THREE.ShaderMaterial({
            uniforms:
            {
                fogFar: {value: 350},
                fogNear: {value: 50},
                fogColor: {value: new THREE.Color(0xfcca50)},
                fogDensity: {value: 2},
                uMap: {value: AssetsManager.textures.Ground},
                uShadowMap: {value: AssetsManager.textures.GroundShadow},
                
            }, 
            fog: true,
            vertexShader: vertexGroundShader, 
            fragmentShader: fragmentGroundShader,
        });
        // AssetsManager.textures.Ground.repeat.set( 4, 4 );
        const groundObject = this._model.scene.getObjectByName("Ground");
        groundObject.material = groundMaterial;

        const house01Material = new THREE.MeshBasicMaterial({map: AssetsManager.textures.House_01, side: THREE.DoubleSide});
        const house01Object = this._model.scene.getObjectByName("House_01");
        house01Object.material = house01Material;

        const house02Material = new THREE.MeshBasicMaterial({map: AssetsManager.textures.House_02, side: THREE.DoubleSide});
        const house02Object = this._model.scene.getObjectByName("House_02");
        house02Object.material = house02Material;

        const house03Material = new THREE.MeshBasicMaterial({map: AssetsManager.textures.House_03, side: THREE.DoubleSide});
        const house03Object = this._model.scene.getObjectByName("House_03");
        house03Object.material = house03Material;

        const house04Material = new THREE.MeshBasicMaterial({map: AssetsManager.textures.House_04, side: THREE.DoubleSide});
        const house04Object = this._model.scene.getObjectByName("House_04");
        house04Object.material = house04Material;

        const propsMaterial = new THREE.MeshBasicMaterial({map: AssetsManager.textures.Props, side: THREE.DoubleSide});
        const propsObject = this._model.scene.getObjectByName("Props");
        propsObject.material = propsMaterial;

        let uniforms = {
            uTimeSin: {value: 0.0},  
            uTimeCos: {value: 0.0},
            uTime: {value: 0.0},
            uTex: {value: AssetsManager.textures.Water}, 
            repeat: {value: new THREE.Vector2(2, 2)},
            fogFar: {value: 150},
            fogNear: {value: 5},
            fogColor: {value: new THREE.Color(0xfcca50)},
            fogDensity: {value: 2},
        };

        let waterMaterial = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            vertexShader: vertexWaterShader,
            fragmentShader: fragmentWaterShader,
            uniforms,
            fog: true,
            
        });
        const waterObject = this._model.scene.getObjectByName("Water");
        waterObject.material = waterMaterial;

        this.add(this._model.scene);
    }

    update(delta) {
        // this._checkRoadReplace();
        // this.particlesSystem.update(delta);
    }

    /** 
     * Private 
    */

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