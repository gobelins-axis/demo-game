import * as THREE from 'three';
import AppManager from './AppManager';
import gsap from 'gsap';

class AnimationComponent {
    constructor(options) {
        this.model = options.model;
        this.animations = options.animations;
        this.actions = [];
        this.actionType = {};
        this.mixer = null;
        this.currentAnim = null;
        this._firstPlaying = true;
        this._weight = {
            val: 0,
        },
        this._setupMixer(options.skinnedMesh);

        for (let index = 0; index < this.animations.length; index++) {
            let animation = this.animations[index];
            this._setupMultipleAnimations(animation, animation.name, index);
        }

        this._activateAllActions();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    
    playAnimation(options) {
        this.currentAnim = this.actionType[options.animation].getClip();
        this.actionType[options.animation].time = 0;

        if (!options.loop) {
            this.actionType[options.animation].clampWhenFinished = true;
            this.actionType[options.animation].loop = THREE.LoopOnce;
        }else{
            this.actionType[options.animation].loop = THREE.LoopRepeat;

        }
        if(options.yoyo) {
            this.actionType[options.animation].clampWhenFinished = true;
            this.actionType[options.animation].loop = THREE.LoopPingPong;
            this.actionType[options.animation].repetitions = 2;
        }


        this._setWeight(this.actionType[options.animation], 1);

        this.actionType[options.animation].paused = false;
        this.actionType[options.animation].play();
        this.actionType[options.animation].timeScale = options.speed ? options.speed : 1;

        this.actionType[options.animation].time = options.delay ? options.delay : 0;
        if(this._firstPlaying) {
            this._firstPlaying = false;
            gsap.ticker.add(() =>  this._update()); 
        }
 

    }

    revertAnimation(options){
        this.actionType[options.animation].timeScale = -1;
        this.actionType[options.animation].loop = THREE.LoopOnce;
    }

    pauseAnimation(options) {
        this.actionType[options.animation].paused = true;
    }

    pauseAllActions() {
        this.actions.forEach((action) => {
            action.paused = true;
        });
    }

    unPauseAllActions() {
        this.actions.forEach((action) => {
            action.paused = false;
        });
    }

    animFade(options) {
        if (!options.loop) {
            this.actionType[options.to].loop = THREE.LoopOnce;
            this.actionType[options.to].clampWhenFinished = true;
        }
        this.unPauseAllActions();
        this._setWeight(this.actionType[options.to], 1);
        this.actionType[options.to].time = options.delay ? options.delay : 0;
        this.actionType[options.from].crossFadeTo(this.actionType[options.to], options.duration ? options.duration : 1, true);
        this.playAnimation({animation: options.to, loop: options.loop, speed: options.speed});
    }

    setAnimationProgress(options) {
        this.playAnimation(options);
        
        const duration = this.currentAnim.duration;
        const progress = duration * options.progress;
        this.actionType[options.animation].paused = true;

        options.animation.time = progress;
    }

    getAnimationProgress(options) {
        return options.animation.time;
    }

    getCurrentAnim() {
        return this.currentAnim.name;
    }
    
    onAnimationComplete(func) {
        this.completeCallback = func;
    }
    

    /**
     * Private
     */

    _setupMixer(skinnedMesh) {
        this.mixer = new THREE.AnimationMixer(skinnedMesh || this.model.scene);
    }

    _setupMultipleAnimations(action, actionName, animationNumber) {
        this.actionType[actionName] = this.mixer.clipAction(this.animations[animationNumber]);
        this.actions.push(this.actionType[actionName]);
    }

    _setupAnimations(animations) {
        animations.forEach(animation => {
            this.actionType[animation.name] = this.mixer.clipAction(animation);
            this.actions.push(this.actionType[animation.name]);
        });
    }

    _setWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    _activateAllActions(action, actionWeight) {
        this.actions.forEach((action) => {
            this._setWeight(action, 1.0);
            // action.play();
            // action.paused = true;
        });
    }

    _setupEventListeners() {
        this.mixer.addEventListener('finished', (e) => {
            if (this.completeCallback) {
                this.completeCallback(e);
            }
        });
    }

    _update() {
        if(!AppManager.DELTA_TIME) return;
        this.mixer.update(AppManager.DELTA_TIME);
    }
}

export default AnimationComponent;
