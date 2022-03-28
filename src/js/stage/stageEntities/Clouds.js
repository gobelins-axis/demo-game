import gsap from "gsap/gsap-core";
import * as THREE from "three";
import fragmentShader from "../../shaders/Clouds/fragment.glsl";
import vertexShader from "../../shaders/Clouds/vertex.glsl";
import AssetsManager from '../../components/AssetsManager';
import AppManager from '../../components/AppManager';

import GUI from "../../utils/GUI";

export default class Clouds extends THREE.Object3D {
    constructor() {
        super();

        this.sphericals = [];

        this.time = 0;
        this.time2 = 0.5;
        this.instanceCount = 200;
        for (let i = 0; i < this.instanceCount; i++) {
            const radius = 20;
            const phi = THREE.MathUtils.randFloat(0, Math.PI * 2) + 10;
            const theta = THREE.MathUtils.randFloat(0, Math.PI * 2) + 10;

            this.sphericals.push(new THREE.Spherical(radius, phi, theta));
        }



     
    }
    addGui() {
        const cloudsFolder = GUI.addFolder('Clouds');
        cloudsFolder.add(this.mat.uniforms.uRandomness1, "value", -100, 100)
            .name("uRandomness1")
            .onChange((value) => {
                this.mat.uniforms.uRandomness1.value = value;
            });
        cloudsFolder.add(this.mat.uniforms.uRandomness2, "value", -100, 100)
            .name("uRandomness2")
            .onChange((value) => {
                this.mat.uniforms.uRandomness2.value = value;
            });
        cloudsFolder.add(this.mat.uniforms.uVignettageStrength, "value", 0, 100)
            .name("uVignettageStrength")
            .onChange((value) => {
                this.mat.uniforms.uVignettageStrength.value = value;
            });
        cloudsFolder.add(this.mat.uniforms.uVignettagePower, "value", 0, 10)
            .name("uVignettagePower")
            .onChange((value) => {
                this.mat.uniforms.uVignettagePower.value = value;
            });
    }
    build() {
        const geo = new THREE.PlaneGeometry(10, 10);

        this._mat = new THREE.ShaderMaterial({
            uniforms: {
                uMap: { value: AssetsManager.textures.cloud },
                uNoise: { value: AssetsManager.textures.NoiseTexture },
                uTime: { value: 0 },
                uTimeCos: { value: 0 },
                uRandomness1: { value: 9 },
                uRandomness2: { value: -3.2 },
                uVignettageStrength: { value: 29.4 },
                uVignettagePower: { value: 4.5 },
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this.cloudsInstance = new THREE.InstancedMesh(
            geo,
            this._mat,
            this.instanceCount,
        );

        this.instanceData = [];

        for (let i = 0; i < this.instanceCount; i++) {
            const newPosition = new THREE.Vector3();
            this.instanceData.push({
                position: newPosition.setFromSpherical(this.sphericals[i]),
                // rotation: new THREE.Quaternion(1, 1, 1, 1),
                scale: new THREE.Vector3(1, 1, 1),
            });
            const dummy = new THREE.Object3D();
    
            dummy.position.copy(new THREE.Vector3(this.instanceData[i].position.x, (Math.random() - 0.5) * 2 + 20, this.instanceData[i].position.z));

            dummy.position.x *= 20;
            dummy.position.y *= 1;
            dummy.position.z *= 20;

            // dummy.scale.set(1., 1., 1.);
            dummy.scale.set(this.instanceData[i].position.x* 0.3 + 1., this.instanceData[i].position.x * 0.3 + 1., this.instanceData[i].position.x* 0.3 + 1.);


            dummy.lookAt(0, 0, 0);

            dummy.updateMatrix();
            this.cloudsInstance.setMatrixAt(i, dummy.matrix);
            this.cloudsInstance.setColorAt(
                i,
                new THREE.Color(0xffffff).setHex(Math.random() * 0xffffff),
            );
        }

        // this.plane.lookAt(0, 0, 0);
        // this.addGui();

        // const uniforms = {
        //     uTime: {value: 0},
        //     uColor: {value: new THREE.Color(0xff0000)},
        //     uMap: { value: AssetsManager.textures.cloud },
        //     uNoise: { value: AssetsManager.textures.NoiseTexture },
        //     uRotation: {value: 0}, 
        // };

        // let geometry = new THREE.PlaneBufferGeometry( 10, 10);
        // let instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry);
        // geometry.lookAt(0, 0, 0);
        // this._instanceCount = 100;
        // let pos = [];
        // let scale = [];

        // for (let i = 0; i < this._instanceCount; i++) {
        //     let posVector = new THREE.Vector3((Math.random() -0.5) * 200,  (Math.random() -0.5) * 10 + 2, (Math.random() -0.5) * 200);
        //     pos.push(posVector.x ,posVector.y, posVector.z);
        //     // aProps.push(yPos, offset, scale, opacity);
        // }          

        // this.posBuffer = new Float32Array(pos);
        // instancedGeometry.instanceCount = this._instanceCount;
        // this._mat = new THREE.ShaderMaterial({
        //     fragmentShader: fragmentShader,
        //     vertexShader: vertexShader,
        //     uniforms: uniforms,
        //     transparent: true, 
        //     depthWrite: false,
        //     side: THREE.DoubleSide,

        // });
        // this.cloudsInstance = new THREE.Mesh(instancedGeometry,  this._mat);

        // instancedGeometry.setAttribute(
        //     "aPosition",
        //     new THREE.InstancedBufferAttribute(this.posBuffer, 3, false),
        // );
        this.addToScene();
    }

    addToScene() {
        this.add(this.cloudsInstance);
    }

    killClouds() {
        gsap.to(this.cloudsInstance.scale, {x: 0, y:0, z: 0, duration: 1, onComplete: () => {

            this.remove(this.cloudsInstance);
        }} );
    }

    update() {
        this.time += 0.001;
        this.time2 += 0.001;

        // this.mat.uniforms.uTimeSin.value = (Math.sin(this.time) + 1) / 2;
        // this.mat.uniforms.uTimeCos.value = (Math.cos(this.time2) + 1) / 2;
        
        // this.cloudsInstance.rotation.z += 0.0002;
        // this.cloudsInstance.rotation.x += 0.0001;
        this.cloudsInstance.rotation.y -= 0.00005;
        // this._mat.uniforms.uRotation.value = this.cloudsInstance.rotation.y;
        this._mat.uniforms.uTime.value = this.time;
    }
}
