import * as THREE from 'three';
import { Object3D } from 'three';
import AppManager from '../../components/AppManager';
import AssetsManager from '../../components/AssetsManager';
import fragmentShader from "../../shaders/Rails/fragment.glsl";
import vertexShader from "../../shaders/Rails/vertex.glsl";
import AnimationComponent from '../../components/AnimationComponent';
import Tools from '../../utils/Tools';
import gsap from 'gsap';

export default class Rails extends Object3D{
    constructor(options) {
        super();
        this.is3dModel = true;
        this._railsOptions = {
            railsSize: 3.5,
            numberOfRails: 55,
            railsOffset: 0,
        };

        this._railsOptions.railsOffset -= this._railsOptions.railsSize;

        this._railsMeshes = [];

        this._model = AssetsManager.models.Rails;

    }


    /** 
     * Public 
    */

    build() {
        // this._setupRails();
        this._setupInstances();
    }

    update(delta) {
        // this._checkrailsReplace();
    }

    /** 
     * Private 
    */

    _setupRails() {
        // for (let index = 0; index < this._railsOptions.numberOfRails; index++) {

        //     let mesh = this._model.scene.clone();

        //     this._railsOptions.railsOffset += this._railsOptions.railsSize;
        //     // mesh.rotation.y += Math.PI / 2;
        //     mesh.position.z += this._railsOptions.railsOffset;
            
        //     this._railsMeshes.push(mesh);
            
        //     this.add(mesh);
        // }

    }

    _setupInstances() {
        const uniforms = {
            uTime: {value: 0},
            uColor: {value: new THREE.Color(0xff0000)},
        };

        let railsModel = AssetsManager.models.Rails.scene;
        let instancedGeometry = new THREE.InstancedBufferGeometry().copy(railsModel.children[0].geometry);

        let pos = [];
        let speed = [];

        for (let i = 0; i < this._railsOptions.numberOfRails; i++) {
            this._railsOptions.railsOffset += this._railsOptions.railsSize;
            let posVector = new THREE.Vector3(0, 0, this._railsOptions.railsOffset);
            pos.push(posVector.x ,posVector.y, posVector.z);
        }          

        this.posBuffer = new Float32Array(pos);
        this.speedBuffer = new Float32Array(speed);
        instancedGeometry.instanceCount = this._railsOptions.numberOfRails;
        this._mat = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: uniforms,
            // transparent: true, 
            side: THREE.DoubleSide,

        });
        this.railsInstance = new THREE.Mesh(instancedGeometry,  this._mat);
        this.railsInstance.frustumCulled = false;
        instancedGeometry.setAttribute(
            "aPosition",
            new THREE.InstancedBufferAttribute(this.posBuffer, 3, false),
        );
        this.railsInstance.position.x = -12.7;
        this.railsInstance.position.y = -0.6;
        this.add(this.railsInstance);
    }
}