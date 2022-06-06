import * as THREE from 'three';
import AssetsManager from './AssetsManager';
import AppManager from './AppManager';

class SoundManager{
    constructor() {
        this._audioSources = [];
        this._listener = this._createSoundListener();
    }

    playSound(options) {

        const audioSource = new THREE.Audio( this._listener );

        const sound = AssetsManager.sounds[options.name];
        audioSource.setBuffer( sound );
        audioSource.setLoop( options.loop ? options.loop : false );
        audioSource.setVolume( options.volume );
        audioSource.play();
        this._audioSources.push(audioSource);
    }

    pauseAllSounds() {
        for (let index = 0; index < this._audioSources.length; index++) {
            if(this._audioSources[index]) {
                const source = this._audioSources[index];
                source.stop();
            }
        }
    }

    resetSound() {

    }

    _createSoundListener() {
        const listener = new THREE.AudioListener();
        AppManager.MAIN_CAMERA.add( listener );
        return listener;
    }
    
}
export default SoundManager;