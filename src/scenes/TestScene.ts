import Phaser from 'phaser';
import { CuteGirl } from '../objects/CuteGirl';

export default class TestScene extends Phaser.Scene {
    private cuteGirl!: CuteGirl;
    private currentEmotion: string = 'happy';
    private emotions: string[] = ['happy', 'surprised', 'confused', 'excited', 'scared'];

    constructor() {
        super({ key: 'TestScene' });
    }

    create(): void {
        // 创建可爱的女孩
        this.cuteGirl = new CuteGirl(this, 400, 300);

        // 创建测试按钮
        this.createTestButtons();

        // 添加说明文本
        this.add.text(400, 50, '测试可爱的女孩', {
            fontSize: '24px',
            color: '#FF69B4'
        }).setOrigin(0.5);
    }

    private createTestButtons(): void {
        // 表情切换按钮
        const emotionButton = this.add.text(400, 500, '切换表情', {
            fontSize: '20px',
            color: '#FFFFFF',
            backgroundColor: '#FF69B4',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        emotionButton.on('pointerdown', () => {
            const currentIndex = this.emotions.indexOf(this.currentEmotion);
            const nextIndex = (currentIndex + 1) % this.emotions.length;
            this.currentEmotion = this.emotions[nextIndex];
            this.cuteGirl.setEmotion(this.currentEmotion);
        });

        // 动画测试按钮
        const buttons = [
            { text: '走路', action: () => this.cuteGirl.playWalkAnimation() },
            { text: '跳跃', action: () => this.cuteGirl.playJumpAnimation() },
            { text: '庆祝', action: () => this.cuteGirl.playCelebrationAnimation() },
            { text: '失败', action: () => this.cuteGirl.playDefeatAnimation() },
            { text: '重置', action: () => this.cuteGirl.resetCharacter() }
        ];

        buttons.forEach((button, index) => {
            const btn = this.add.text(200 + index * 100, 550, button.text, {
                fontSize: '16px',
                color: '#FFFFFF',
                backgroundColor: '#9370DB',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive();

            btn.on('pointerdown', button.action);
        });
    }
}