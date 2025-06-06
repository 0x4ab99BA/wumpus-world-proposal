import { Scene } from 'phaser';
import { LadyCharacter } from '../objects/LadyCharacter';
import { SpriteManager } from '../utils/SpriteManager';

export class TestScene extends Scene {
    private lady!: LadyCharacter;
    private stateText!: Phaser.GameObjects.Text;
    private debugText!: Phaser.GameObjects.Text;
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

        // 创建说明文字
        this.createInstructions();

        // 创建测试按钮
        this.createTestButtons();

        // 创建状态指示器
        this.createStateIndicator();

        // 创建调试信息
        this.createDebugInfo();
    }

    update() {
        // 更新状态文本
        if (this.stateText) {
            const isMoving = this.lady.getIsMoving();
            const isJumping = (this.lady as any).isJumping;
            const isAttacking = (this.lady as any).isAttacking;
            const isDead = (this.lady as any).isDead;
            
            let state = '待机';
            if (isAttacking) {
                state = '攻击中';
            } else if (isJumping) {
                state = '跳跃中';
            } else if (isMoving) {
                state = '移动中';
            } else if (isDead) {
                state = '死亡';
            }
            
            this.stateText.setText([
                '角色状态:',
                state
            ]);
        }

        // 更新调试信息
        if (this.debugText) {
            this.debugText.setText([
                '调试信息:',
                `位置: (${Math.round(this.lady.x)}, ${Math.round(this.lady.y)})`,
                `状态: ${this.lady.currentState}`,
                `朝向: ${(this.lady as any).facingRight ? '右' : '左'}`,
                `移动中: ${(this.lady as any).isMoving}`,
                `攻击中: ${(this.lady as any).isAttacking}`,
                `跳跃中: ${(this.lady as any).isJumping}`,
                `死亡: ${(this.lady as any).isDead}`
            ]);
        }
    }

    private createInstructions() {
        const instructions = [
            '死亡动画测试说明:',
            '- 点击"播放死亡动画"测试基本死亡动画',
            '- 点击"测试死亡状态"测试死亡状态下的其他动作',
            '- 点击"测试连续死亡"测试快速连续播放死亡动画',
            '- 点击"测试死亡后重置"测试死亡后重置功能',
            '- 点击"测试死亡中断"测试在死亡动画播放过程中尝试其他动作'
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
            fixedWidth: 150,
            align: 'center'
        };

        const buttonConfig = [
            { 
                text: '播放死亡动画', 
                y: 200, 
                action: async () => {
                    console.log('开始播放死亡动画');
                    await this.lady.playDead();
                    console.log('死亡动画播放完成');
                }
            },
            { 
                text: '测试死亡状态', 
                y: 250, 
                action: async () => {
                    console.log('测试死亡状态下的其他动作');
                    await this.lady.playDead();
                    console.log('尝试在死亡状态下移动');
                    await this.lady.moveToPosition(this.lady.x + 100, this.lady.y);
                    console.log('尝试在死亡状态下攻击');
                    await this.lady.playAttack();
                    console.log('尝试在死亡状态下跳跃');
                    await this.lady.performJump();
                }
            },
            { 
                text: '测试连续死亡', 
                y: 300, 
                action: async () => {
                    console.log('测试快速连续播放死亡动画');
                    for (let i = 0; i < 3; i++) {
                        console.log(`第 ${i + 1} 次播放死亡动画`);
                        await this.lady.playDead();
                    }
                }
            },
            { 
                text: '测试死亡后重置', 
                y: 350, 
                action: async () => {
                    console.log('测试死亡后重置');
                    await this.lady.playDead();
                    console.log('重置角色');
                    this.lady.resetCharacter();
                    console.log('尝试移动确认重置成功');
                    await this.lady.moveToPosition(this.lady.x + 100, this.lady.y);
                }
            },
            { 
                text: '测试死亡中断', 
                y: 400, 
                action: async () => {
                    console.log('测试死亡动画播放过程中尝试其他动作');
                    this.lady.playDead();  // 不等待完成
                    console.log('立即尝试移动');
                    await this.lady.moveToPosition(this.lady.x + 100, this.lady.y);
                    console.log('立即尝试攻击');
                    await this.lady.playAttack();
                    console.log('立即尝试跳跃');
                    await this.lady.performJump();
                }
            }
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
        this.stateText = this.add.text(10, 450, ['角色状态:', '待机'], {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.stateText.setScrollFactor(0);
        this.stateText.setDepth(1000);
    }

    private createDebugInfo() {
        this.debugText = this.add.text(10, 500, '', {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.debugText.setScrollFactor(0);
        this.debugText.setDepth(1000);
    }
}