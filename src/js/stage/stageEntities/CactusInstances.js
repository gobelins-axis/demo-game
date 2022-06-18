import gsap from "gsap/gsap-core";
import * as THREE from "three";
import fragmentShader from "../../shaders/Cactus/fragment.glsl";
import vertexShader from "../../shaders/Cactus/vertex.glsl";
import AssetsManager from '../../components/AssetsManager';
import AppManager from '../../components/AppManager';

import GUI from "../../utils/GUI";

export default class CactusInstances extends THREE.Object3D {
    constructor() {
        super();

        this.time = 0;
        this.time2 = 0.5;
        this.instanceCount = 200;     
    }

    build() {
        const uniforms = {
            uTime: {value: 0},
            uColor: {value: new THREE.Color(0xff0000)},
            uMap: {value: AssetsManager.textures.Cactus},
            fogFar: {value: 150},
            fogNear: {value: 5},
            fogColor: {value: new THREE.Color(0xfcca50)},
            fogDensity: {value: 2},
        };

        let cactusModel = AssetsManager.models.Cactus.scene;
        let worldCactusPos = AssetsManager.models.World.scene.getObjectByName("CactusEmpty");
        let instancedGeometry = new THREE.InstancedBufferGeometry().copy(cactusModel.children[0].geometry);

        let pos = [];
        let speed = [];

        for (let i = 0; i < worldCactusPos.children.length; i++) {
            
            let posVector = new THREE.Vector3(worldCactusPos.children[i].position.x, worldCactusPos.children[i].position.y, worldCactusPos.children[i].position.z);
            pos.push(posVector.x ,posVector.y, posVector.z);
            speed.push(Math.random() + 0.5);
        }          

        this.posBuffer = new Float32Array(pos);
        this.speedBuffer = new Float32Array(speed);
        instancedGeometry.instanceCount = worldCactusPos.children.length;
        this._mat = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: uniforms,
            // transparent: true, 
            side: THREE.DoubleSide,
            fog: true,
        });
        this.cactusInstance = new THREE.Mesh(instancedGeometry,  this._mat);
        this.cactusInstance.frustumCulled = false;
        instancedGeometry.setAttribute(
            "aPosition",
            new THREE.InstancedBufferAttribute(this.posBuffer, 3, false),
        );
        instancedGeometry.setAttribute(
            "aRandomSpeed",
            new THREE.InstancedBufferAttribute(this.speedBuffer, 1, false),
        );
        this.add(this.cactusInstance);
    }

    update() {
        this.time += 0.005;

        this._mat.uniforms.uTime.value = this.time;
        // this.mat.uniforms.uTimeCos.value = (Math.cos(this.time2) + 1) / 2;
    }
}
