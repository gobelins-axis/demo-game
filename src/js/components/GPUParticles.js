import * as THREE from 'three';
import fragmentShader from '../shaders/GPUParticles/frag.glsl';
import vertexShader from '../shaders/GPUParticles/vert.glsl';
import Tools from "../utils/Tools";
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

const UPDATEABLE_ATTRIBUTES = [
    'positionStart', 'startTime',
    'velocity', 'acceleration',
    'color', 'endColor',
    'size', 'lifeTime'];

export default class GPUParticles extends THREE.Object3D {
    constructor(options) {
        super();
        options = options || {};

        this.blending = options.blending? options.blending : THREE.NormalBlending;
        this.PARTICLE_COUNT = options.maxParticles || 100;
        this.PARTICLE_CURSOR = 0;
        this.time = 0;
        this.offset = 0;
        this.count = 0;
        this.DPR = window.devicePixelRatio ;
        this.particleUpdate = false;
        this.onTick = options.onTick;

        this.reverseTime = options.reverseTime;
        this.fadeIn = options.fadeIn || 1;
        if(this.fadeIn === 0) this.fadeIn = 0.001;
        this.fadeOut = options.fadeOut || 1;
        if(this.fadeOut === 0) this.fadeOut = 0.001;

        this.rand = [];
        let i;
        for (i = 1e5; i>0; i--) {
            this.rand.push( Math.random() - 0.5 );
        }
        this.i = i;

        //setup the texture
        this.sprite = options.particleSpriteTex || null;
        if(!this.sprite) throw new Error("No particle sprite texture specified");
        this.sprite.wrapS = this.sprite.wrapT = THREE.RepeatWrapping;

        this._createMaterial();
        this._createGeometry();
        this._createMesh();

    }

    /** 
     * Public 
    */

    update( delta, pos ) {
        this.time += delta;
        this.material.uniforms.uTime.value = this.time;
        if(this.onTick) this.onTick(this,this.time);
        this._geometryUpdate();
    }

    spawnParticle( options ) {
        let position = new THREE.Vector3();
        let velocity = new THREE.Vector3();
        let acceleration = new THREE.Vector3();
        let color = new THREE.Color();
        let endColor = new THREE.Color();

        const positionStartAttribute = this.geometry.getAttribute('positionStart');
        const startTimeAttribute = this.geometry.getAttribute('startTime');
        const velocityAttribute = this.geometry.getAttribute('velocity');
        const accelerationAttribute = this.geometry.getAttribute('acceleration');
        const colorAttribute = this.geometry.getAttribute('color');
        const endcolorAttribute = this.geometry.getAttribute('endColor');
        const sizeAttribute = this.geometry.getAttribute('size');
        const lifeTimeAttribute = this.geometry.getAttribute('lifeTime');

        options = options || {};

        position = options.position !== undefined ? position.copy(options.position) : position.set(0, 0, 0);
        velocity = options.velocity !== undefined ? velocity.copy(options.velocity) : velocity.set(0, 0, 0);
        acceleration = options.acceleration !== undefined ? acceleration.copy(options.acceleration) : acceleration.set(0, 0, 0);
        color = options.color !== undefined ? color.copy(options.color) : color.set(0xffffff);
        endColor = options.endColor !== undefined ? endColor.copy(options.endColor) : endColor.copy(color);

        const lifetime = options.lifetime !== undefined ? options.lifetime : 5;
        let size = options.size !== undefined ? options.size : 10;
        const sizeRandomness = options.sizeRandomness !== undefined ? options.sizeRandomness : 0;

        if (this.DPR !== undefined) size *= this.DPR;

        const i = this.PARTICLE_CURSOR;

        // position
        positionStartAttribute.array[i * 3 + 0] = position.x;
        positionStartAttribute.array[i * 3 + 1] = position.y;
        positionStartAttribute.array[i * 3 + 2] = position.z;

        velocityAttribute.array[i * 3 + 0] = velocity.x;
        velocityAttribute.array[i * 3 + 1] = velocity.y;
        velocityAttribute.array[i * 3 + 2] = velocity.z;

        accelerationAttribute.array[i * 3 + 0] = acceleration.x;
        accelerationAttribute.array[i * 3 + 1] = acceleration.y;
        accelerationAttribute.array[i * 3 + 2] = acceleration.z;

        colorAttribute.array[i * 3 + 0] = color.r;
        colorAttribute.array[i * 3 + 1] = color.g;
        colorAttribute.array[i * 3 + 2] = color.b;

        endcolorAttribute.array[i * 3 + 0] = endColor.r;
        endcolorAttribute.array[i * 3 + 1] = endColor.g;
        endcolorAttribute.array[i * 3 + 2] = endColor.b;

        //size, lifetime and starttime
        sizeAttribute.array[i] = size + this._random() * sizeRandomness;
        lifeTimeAttribute.array[i] = lifetime;
        startTimeAttribute.array[i] = this.time + this._random() * 2e-2;

        // offset
        if (this.offset === 0) this.offset = this.PARTICLE_CURSOR;
        // counter and cursor
        this.count++;
        this.PARTICLE_CURSOR++;
        //wrap the cursor around
        if (this.PARTICLE_CURSOR >= this.PARTICLE_COUNT) this.PARTICLE_CURSOR = 0;
        this.particleUpdate = true;
    };

    /** 
     * Private 
    */

    _createMaterial() {
        //setup the shader material
        this.material = new THREE.ShaderMaterial( {
            transparent: true,
            depthWrite: false,
            uniforms: {
                'uTime': {
                    value: 0.0,
                },
                'uScale': {
                    value: 1.0,
                },
                'tSprite': {
                    value: this.sprite,
                },
                reverseTime: {
                    value: this.reverseTime,
                },
                fadeIn: {
                    value: this.fadeIn,
                },
                fadeOut: {
                    value: this.fadeOut,
                },
            },
            blending: this.blending,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        } );

        // define defaults for all values
        this.material.defaultAttributeValues.particlePositionsStartTime = [ 0, 0, 0, 0 ];
        this.material.defaultAttributeValues.particleVelColSizeLife = [ 0, 0, 0, 0 ];
    }

    _createGeometry() {
        // geometry
        this.geometry = new THREE.BufferGeometry();

        //vec3 attributes
        this.geometry.setAttribute('position',      new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('velocity',      new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('acceleration',  new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('color',         new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('endColor',      new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));

        //scalar attributes
        this.geometry.setAttribute('startTime',     new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('size',          new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setUsage(THREE.DynamicDrawUsage));
        this.geometry.setAttribute('lifeTime',      new THREE.BufferAttribute(new Float32Array(this.PARTICLE_COUNT), 1).setUsage(THREE.DynamicDrawUsage));
    }

    _createMesh() {
        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.particleSystem.frustumCulled = false;
        this.add(this.particleSystem);
    }

    _geometryUpdate() {
        if (this.particleUpdate === true) {
            this.particleUpdate = false;
            UPDATEABLE_ATTRIBUTES.forEach(name => {
                const attr = this.geometry.getAttribute(name);
                if (this.offset + this.count < this.PARTICLE_COUNT) {
                    attr.updateRange.offset = this.offset * attr.itemSize;
                    attr.updateRange.count = this.count * attr.itemSize;
                } else {
                    attr.updateRange.offset = 0;
                    attr.updateRange.count = -1;
                }
                attr.needsUpdate = true;
            });
            this.offset = 0;
            this.count = 0;
        }
    }

    _random() {
        return ++ this.i >= this.rand.length ? this.rand[ this.i = 1 ] : this.rand[ this.i ];
    }

    _dispose() {
        this.material.dispose();
        this.sprite.dispose();
        this.geometry.dispose();
    }
}