import * as THREE from 'three';
import AssetsManager from './AssetsManager';
import AppManager from './AppManager';
import gsap from 'gsap';

class UIManager{
    constructor() {
        this._setupPlayersLife();
        this._setupLifeAnimation();
        AppManager.EVENT_DISPATCHER.addEventListener("player_hit", (e) => this._onHitPlayer(e));
        AppManager.EVENT_DISPATCHER.addEventListener("shoot_projectile", (e) => this._onShootProjectile(e));
    }
    _setupPlayersLife() {
        this._lifesCount = {
            firstPlayer: 5,
            secondPlayer: 5,
        };
        this._projectilesCount = 50;

        this._ui = {
            firstPlayerLifes: document.querySelectorAll(".js-life-first .single__life img"),
            secondPlayerLifes: document.querySelectorAll(".js-life-second .single__life img"),
            shootNumberProjectiles: document.querySelector(".ammunition__number"),
        };
    } 

    _setupLifeAnimation() {
        const timeline = gsap.timeline({repeat: -1});
        timeline.to(this._ui.firstPlayerLifes, {y: -5, scale: 1.1, duration: 0.4, stagger:0.1, ease: "circ.out"});
        timeline.to(this._ui.secondPlayerLifes, {y: -5, scale: 1.1, duration: 0.4, stagger:0.1, ease: "circ.out"}, 0.2);
        timeline.to(this._ui.firstPlayerLifes, {y: 0, scale: 1, duration: 0.4, stagger:0.1, ease: "circ.out"}, 0.4);
        timeline.to(this._ui.secondPlayerLifes, {y: 0, scale: 1, duration: 0.4, stagger:0.1, ease: "circ.out"}, 0.5);
    }

    _onHitPlayer(e) {
        switch (e.data) {
            case "player_01":
                this._lifesCount.firstPlayer -= 1;
                gsap.to(this._ui.firstPlayerLifes[this._lifesCount.firstPlayer], {autoAlpha: 0, duration: 0.5});
                break;
            case "player_02":
                this._lifesCount.secondPlayer -= 1;
                gsap.to(this._ui.secondPlayerLifes[this._lifesCount.secondPlayer], {autoAlpha: 0, duration: 0.5});
                break;
        }
        if(this._lifesCount.firstPlayer === 0) {
            AppManager.EVENT_DISPATCHER.dispatchEvent({type: "gameLoose", data:"firstPlayer"});
        }
        if(this._lifesCount.secondPlayer === 0) {
            AppManager.EVENT_DISPATCHER.dispatchEvent({type: "gameLoose", data:"secondPlayer"});
        }
    }
    _onShootProjectile() {
        this._projectilesCount -= 1;
        this._ui.shootNumberProjectiles.innerHTML = this._projectilesCount;

        gsap.to(this._ui.shootNumberProjectiles, {scale: 1.3, duration: 0.1});
        gsap.to(this._ui.shootNumberProjectiles, {scale: 1, duration: 0.5, delay: 0.1});
    }
}
export default UIManager;