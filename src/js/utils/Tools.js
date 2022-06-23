import * as THREE from 'three';
import AppManager from "../components/AppManager";

class Tools{
    constructor() {

    }

    rand(min,max){ 
        return Math.random()*(max-min) + min;
    };

    mod(value, n){ 
        return ((value % n) + n) % n;
    };

    clamp(number, min, max){ 
        return Math.min(Math.max(number, min), max);
    };

    
    distance3d(p0, p1) {
        return Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.z - p0.z) * (p1.z - p0.z));
    }

    hitTest(a, b) {
        return this.distance3d({ x: a.position.x, z: 0 }, { x: b.position.x, z: 0 }) < a.size.x / 2 + b.size.x / 2 &&
            this.distance3d({ x: 0, z: a.position.z }, { x: 0, z: b.position.z }) < a.size.z / 2 + b.size.z / 2 ? { x: a.position.x < b.position.x ? -1 : a.position.x > b.position.x ? 1 : 0, z: a.position.z < b.position.z ? 1 : a.position.z > b.position.z ? -1 : 0 } : false;
    }
    
    getClonedModel(Object) {

        let clonedGltf = this.cloneGltf(Object);

        let clonedMesh = !this.isModelAnimated
            ? clonedGltf.scene.children[0]
            : clonedGltf.scene.getObjectByName("ctrl_catapult");
        return { clonedGltf, clonedMesh };
    }

    cloneGltf(Gltf) {
        const clone = {
            animations: Gltf.animations,
            scene: Gltf.scene.clone(true),
        };

        const skinnedMeshes = {};

        Gltf.scene.traverse((node) => {
            if (node.isSkinnedMesh) {
                skinnedMeshes[node.name] = node;
            }
        });

        const cloneBones = {};
        const cloneSkinnedMeshes = {};

        clone.scene.traverse((node) => {
            if (node.isBone) {
                cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
                cloneSkinnedMeshes[node.name] = node;
            }
        });

        for (let name in skinnedMeshes) {
            const skinnedMesh = skinnedMeshes[name];
            const skeleton = skinnedMesh.skeleton;
            const cloneSkinnedMesh = cloneSkinnedMeshes[name];

            const orderedCloneBones = [];

            for (let i = 0; i < skeleton.bones.length; ++i) {
                const cloneBone = cloneBones[skeleton.bones[i].name];
                orderedCloneBones.push(cloneBone);
            }

            cloneSkinnedMesh.bind(
                new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
                cloneSkinnedMesh.matrixWorld,
            );
        }
        return clone;
    }

    angleToPoint(e, anglePlayer, oldPos) {
        let X  = (e.position.x / window.innerWidth) * 2 - 1;
        let Y = - (e.position.y / window.innerHeight) * 2 + 1;
        let vector = new THREE.Vector3(X, Y, 0.5);
        vector.unproject( AppManager.LEFT_CAMERA );
        let dir = vector.sub( AppManager.LEFT_CAMERA.position ).normalize();
        let distance = - AppManager.LEFT_CAMERA.position.y / dir.y;
        let pos = AppManager.LEFT_CAMERA.position.clone().add( dir.multiplyScalar( distance ));
        let dx = pos.x - oldPos.x;
        let dy = pos.z - oldPos.z;
        let len = Math.sqrt(dx * dx + dy * dy);
        dx /= len ? len : 1.0; dy /= len ? len : 1.0;
        let dirx = Math.cos(anglePlayer),
            diry = Math.sin(anglePlayer);
        dirx += (dx - dirx) * 0.1;
        diry += (dy - diry) * 0.1;
        anglePlayer = Math.atan2(diry, dirx);
        oldPos.x = pos.x;
        oldPos.z = pos.z;
        console.log(anglePlayer);
        return {anglePlayer, pos, oldPos};
    }
    
    isFunc(funcName){
        return typeof funcName !== "undefined";
    };

    clean(displayObject) {
        if (!displayObject) {
            return;
        }

        if (displayObject.isMesh) {
            displayObject.parent && displayObject.parent.remove(displayObject);
            displayObject.geometry.dispose();
            displayObject.material.dispose();
        } else {
            while (displayObject.children.length > 0) {
                let obj = displayObject.children[0];
                if (obj.isMesh) {
                    displayObject.remove(obj);
                    obj.geometry.dispose();
                    obj.material.dispose();
                } else if (obj.children && obj.children.length > 0) {
                    this.clean(obj);
                } else {
                    displayObject.remove(obj);
                }
            }
        }

    }

    getInstances(mesh, arr, count, shadow = true) {

        var mat = mesh.material;
        var geo = mesh.geometry;

        var _dummy = new Object3D();
        var _mesh = new InstancedMesh(geo, mat, count);
        _mesh.castShadow = shadow;
        _mesh.receiveShadow = shadow;

        _mesh.update = (arr, isQuaternion = false) => {
            if (!arr) {
                return;
            }

            arr.splice(0, arr.length - count);

            _mesh.count = arr.length;
            _mesh.childrenArr = arr;


            for (let i = 0; i < arr.length; i++) {

                _dummy.position.copy(arr[i].position);
                if (isQuaternion) {
                    _dummy.quaternion.copy(arr[i].rotation);
                }else{
                    _dummy.rotation.copy(arr[i].rotation);
                }
                _dummy.scale.copy(arr[i].scale);

                _dummy.updateMatrix();
                _mesh.setMatrixAt(i, _dummy.matrix);

            }


            _mesh.instanceMatrix.needsUpdate = true;

        };

        _mesh.clear = () => {
            _mesh.count = 0;
        };

        _mesh.update(arr);

        return _mesh;

    }
}

export default new Tools();