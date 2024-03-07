import Phaser from "phaser";
import { updateStars, getStars } from "../starCount";

export type Collidable =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Tilemaps.Tile;

export default class ThailandScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private star?: Phaser.Physics.Arcade.Sprite;

    private starText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "ThailandScene" });
    }

    create() {
        this.add.image(400, 300, "thailand");

        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms.create(
            400,
            568,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;
        ground.setScale(2).refreshBody();

        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        this.player = this.physics.add.sprite(600, 488, "dude");
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.star = this.physics.add.sprite(700, 350, "star");
        this.star.setCollideWorldBounds(true);
        this.physics.add.collider(this.star, this.platforms);
        this.physics.add.overlap(
            this.player,
            this.star,
            this.handleCollectStar,
            undefined,
            this
        );

        this.starText = this.add.text(16, 16, `Stars: ${getStars()}`, {
            fontSize: "32px",
            color: "#000",
        });
    }

    private handleCollectStar(player: Collidable, s: Collidable) {
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);

        updateStars();
        this.starText?.setText(`Stars: ${getStars()}`);

        this.scene.start("JapanScene");
    }

    update() {
        if (!this.cursors) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.anims.play("right", true);
        } else {
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player?.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}
