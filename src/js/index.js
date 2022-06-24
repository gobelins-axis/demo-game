import AssetsManager from "./components/AssetsManager";

import AppManager from "./components/AppManager";
import "../style/app.scss";

import gsap from "gsap";

const init = () => {
    AssetsManager.loadAssets().then(() => {
        AssetsManager.hideLoadingScreen();
        AppManager.setup();
        AppManager.createLevel();
    });
};

const start = () => {
    AppManager.start();
};

const resize = () => {
    AppManager.resize();
};

//START
gsap.delayedCall(0.2, init);
window.addEventListener("resize", resize);
gsap.delayedCall(4, start);
