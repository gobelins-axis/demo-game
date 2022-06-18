import * as THREE from 'three';
import AssetsManager from './AssetsManager';
import AppManager from './AppManager';
import gsap from 'gsap';

class UIManager{
    constructor() {
        this._setupPlayersLife();
        this._setupLifeAnimation();
        AppManager.EVENT_DISPATCHER.addEventListener("player_hit", (e) => this._onHitPlayer(e));
    }
    _setupPlayersLife() {
        this._lifesCount = {
            firstPlayer: 5,
            secondPlayer: 5,
        };

        this._ui = {
            firstPlayerLifes: document.querySelectorAll(".js-life-first .single__life img"),
            secondPlayerLifes: document.querySelectorAll(".js-life-second .single__life img"),
        };
    } 

    _setupLifeAnimation() {
        console.log(this._ui.firstPlayer);
        const timeline = gsap.timeline({repeat: -1});
        timeline.to(this._ui.firstPlayerLifes, {y: -5, scale: 1.1, duration: 0.4, stagger:0.1, ease: "circ.out"});
        timeline.to(this._ui.secondPlayerLifes, {y: -5, scale: 1.1, duration: 0.4, stagger:0.1, ease: "circ.out"}, 0.2);
        timeline.to(this._ui.firstPlayerLifes, {y: 0, scale: 1, duration: 0.4, stagger:0.1, ease: "circ.out"}, 0.4);
        timeline.to(this._ui.secondPlayerLifes, {y: 0, scale: 1, duration: 0.4, stagger:0.1, ease: "circ.out"}, 0.5);
        // gsap.fromTo(this._ui.secondPlayerLifes, {y: 0, duration: 1, stagger:0.1}, {y: 10, duration: 1, stagger:0.1, repeat: -1, yoyo: true});
    }

    _onHitPlayer(e) {
        // console.log(e.data);
        switch (e.data) {
            case "player_01":
                this._lifesCount.firstPlayer -= 1;
                gsap.to(this._ui.firstPlayerLifes[this._lifesCount.firstPlayer], {autoAlpha: 0, duration: 0.5});
                break;
        
            default:
                break;
        }
    }
}
export default UIManager;