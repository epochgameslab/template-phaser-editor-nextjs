// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import StartGame from '../main';
/* END-USER-IMPORTS */

export default class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    editorCreate(): void {

        // background
        this.add.image(512, 384, "background");

        // rectangle_1
        const rectangle_1 = this.add.rectangle(512, 550, 256, 64);
        rectangle_1.isFilled = false;
        // rectangle_1.fillColor = 0xfff;
        rectangle_1.alpha = .1;
        rectangle_1.lineWidth = 5;
        

        // text_mint
        const text_mint = this.add.text(512, 550, "", {});
        text_mint.text = "Start Game";
        text_mint.setOrigin(0.5, 0.5);
        text_mint.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });
        const scene = this.scene;
        rectangle_1.setInteractive();
        rectangle_1.on('pointerover', function () {
            rectangle_1.isFilled = true;
            rectangle_1.fillColor = 0x0000ff
        });
        rectangle_1.on('pointerout', function () {
            rectangle_1.isFilled = false;
            rectangle_1.fillColor = 0xff0000
        });
        rectangle_1.on('pointerdown', function () {
            scene.start('Game');
        });


        // logo
        const logo = this.add.text(512, 384, "", {});
        logo.setStyle({});

        // text
        const text = this.add.text(512, 460, "", {});
        text.setOrigin(0.5, 0.5);
        text.text = "Main Menu";
        text.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Arial Black", "fontSize": "38px", "stroke": "#000000", "strokeThickness": 8 });

        // text_1
        const text_1 = this.add.text(520, 354, "", {});
        text_1.setOrigin(0.5, 0.5);
        text_1.text = "Legends of Ledger";
        text_1.setStyle({ "align": "center", "color": "#ffffff", "fontFamily": "Impact", "fontSize": "108px", "stroke": "#000000", "strokeThickness": 8 });

        this.logo = logo;

        this.events.emit("scene-awake");
    }

    private logo!: Phaser.GameObjects.Text;

    /* START-USER-CODE */
    logoTween: Phaser.Tweens.Tween | null;

    // Write your code here
    create() {
        this.editorCreate();

        EventBus.emit('current-scene-ready', this);

    }

    openInventory() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Inventory');
    }

    moveLogo(vueCallback: ({ x, y }: { x: number, y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            }
            else {
                this.logoTween.play();
            }
        }
        else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export { MainMenu };