import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("india", "assets/india.jpeg");
        this.load.image("indonesia", "assets/indonesia.jpeg");
        this.load.image("japan", "assets/japan.jpeg");
        this.load.image("thailand", "assets/thailand.jpeg");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        this.scene.start("IndiaScene");
    }
}
