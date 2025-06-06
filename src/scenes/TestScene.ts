import { Scene } from 'phaser';
import { LadyCharacter } from '../objects/LadyCharacter';
import { SpriteManager } from '../utils/SpriteManager';

export class TestScene extends Scene {
    private lady!: LadyCharacter;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private stateText!: Phaser.GameObjects.Text;
    private spriteManager!: SpriteManager;

    constructor() {
        super({ key: 'TestScene' });
    }

    preload() {
        // 加载精灵管理器
        this.spriteManager = new SpriteManager(this);
        this.spriteManager.preloadSprites();
    }

    create() {
        // 创建精灵
        this.spriteManager.createAnimations();

        // 创建角色
        this.lady = new LadyCharacter(this, 400, 300);
        this.add.existing(this.lady);

        // 设置相机跟随
        this.cameras.main.startFollow(this.lady, true);
        this.cameras.main.setZoom(1);

        // 获取键盘输入
        const keyboard = this.input.keyboard;
        if (keyboard) {
            this.cursors = keyboard.createCursorKeys();
        }

        // 创建点击事件
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.lady.moveToPosition(pointer.worldX, pointer.worldY);
            }
        });

        // 创建说明文字
        this.createInstructions();

        // 创建测试按钮
        this.createTestButtons();

        // 创建状态指示器
        this.createStateIndicator();
    }

    update() {
        // 处理键盘输入
        if (this.cursors.left.isDown) {
            this.lady.moveToPosition(this.lady.x - 10, this.lady.y);
        } else if (this.cursors.right.isDown) {
            this.lady.moveToPosition(this.lady.x + 10, this.lady.y);
        } else if (this.cursors.up.isDown) {
            this.lady.moveToPosition(this.lady.x, this.lady.y - 10);
        } else if (this.cursors.down.isDown) {
            this.lady.moveToPosition(this.lady.x, this.lady.y + 10);
        }

        // 更新状态文本
        if (this.stateText) {
            const isMoving = this.lady.getIsMoving();
            const isJumping = (this.lady as any).isJumping;
            const isAttacking = (this.lady as any).isAttacking;
            
            let state = '待机';
            if (isAttacking) {
                state = '攻击中';
            } else if (isJumping) {
                state = '跳跃中';
            } else if (isMoving) {
                state = '移动中';
            }
            
            this.stateText.setText([
                '角色状态:',
                state
            ]);
        }
    }

    private createInstructions() {
        const instructions = [
            '测试说明:',
            '- 点击屏幕任意位置移动',
            '- 使用方向键移动',
            '- 点击测试按钮测试动画'
        ];

        const text = this.add.text(10, 10, instructions, {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        text.setScrollFactor(0);
        text.setDepth(1000);
    }

    private createTestButtons() {
        const buttonStyle = {
            fontSize: '16px',
            backgroundColor: '#4a4a4a',
            color: '#ffffff',
            padding: { x: 10, y: 5 },
            fixedWidth: 100,
            align: 'center'
        };

        const buttonConfig = [
            { text: '兴奋', y: 100, action: () => this.lady.performJump() },
            { text: '死亡动画', y: 150, action: () => this.lady.playDead() },
            { text: '失败效果', y: 200, action: () => this.lady.playDefeat() },
            { text: '重置', y: 250, action: () => this.lady.resetCharacter() },
            { text: '跑步', y: 300, action: () => this.lady.moveToPosition(this.lady.x + 200, this.lady.y) },
            { text: '攻击', y: 350, action: () => {
                if (!this.lady.getIsMoving()) {
                    this.lady.playAttack();
                }
            }}
        ];

        buttonConfig.forEach(({ text, y, action }) => {
            const button = this.add.text(10, y, text, buttonStyle)
                .setScrollFactor(0)
                .setDepth(1000)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', action)
                .on('pointerover', () => button.setStyle({ backgroundColor: '#666666' }))
                .on('pointerout', () => button.setStyle({ backgroundColor: '#4a4a4a' }));
        });
    }

    private createStateIndicator() {
        this.stateText = this.add.text(10, 350, ['角色状态:', '待机'], {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.stateText.setScrollFactor(0);
        this.stateText.setDepth(1000);
    }
}