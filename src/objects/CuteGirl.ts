import Phaser from 'phaser';

export class CuteGirl extends Phaser.GameObjects.Container {
    private bodySprite!: Phaser.GameObjects.Graphics;
    private faceSprite!: Phaser.GameObjects.Graphics;
    private hairSprite!: Phaser.GameObjects.Graphics;
    private dressSprite!: Phaser.GameObjects.Graphics;
    private accessoriesSprite!: Phaser.GameObjects.Graphics;
    private currentEmotion: string = 'happy';

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        
        this.createCharacterSprites();
        this.drawCuteGirl();
        this.addAnimations();
        
        scene.add.existing(this);
    }

    private createCharacterSprites(): void {
        this.bodySprite = this.scene.add.graphics();
        this.faceSprite = this.scene.add.graphics();
        this.hairSprite = this.scene.add.graphics();
        this.dressSprite = this.scene.add.graphics();
        this.accessoriesSprite = this.scene.add.graphics();
        
        this.add([
            this.dressSprite,
            this.bodySprite,
            this.hairSprite,
            this.faceSprite,
            this.accessoriesSprite
        ]);
    }

    private drawCuteGirl(): void {
        this.drawDress();
        this.drawBody();
        this.drawHair();
        this.drawFace();
        this.drawAccessories();
    }

    private drawDress(): void {
        this.dressSprite.clear();
        
        // 简单的连衣裙 - 使用柔和的粉色
        this.dressSprite.fillStyle(0xFFB6C1);
        
        // 简单的A字裙
        this.dressSprite.beginPath();
        this.dressSprite.moveTo(-15, 0);
        this.dressSprite.lineTo(-20, 20);
        this.dressSprite.lineTo(20, 20);
        this.dressSprite.lineTo(15, 0);
        this.dressSprite.closePath();
        this.dressSprite.fillPath();
        
        // 简单的上身
        this.dressSprite.fillStyle(0xFFC0CB);
        this.dressSprite.fillRect(-12, -10, 24, 15);
    }

    private drawBody(): void {
        this.bodySprite.clear();
        
        // 肤色
        this.bodySprite.fillStyle(0xFFE4C4);
        
        // 大头 - 占据更多空间
        this.bodySprite.fillCircle(0, -15, 25);
        
        // 简单的手臂
        this.bodySprite.fillEllipse(-15, 0, 8, 12);
        this.bodySprite.fillEllipse(15, 0, 8, 12);
        
        // 简单的手
        this.bodySprite.fillCircle(-15, 8, 5);
        this.bodySprite.fillCircle(15, 8, 5);
        
        // 简单的腿
        this.bodySprite.fillEllipse(-6, 20, 6, 10);
        this.bodySprite.fillEllipse(6, 20, 6, 10);
    }

    private drawHair(): void {
        this.hairSprite.clear();
        
        // 头发主色 - 柔和的棕色
        this.hairSprite.fillStyle(0xCD853F);
        
        // 主要头发 - 圆形轮廓
        this.hairSprite.fillCircle(0, -15, 28);
        
        // 简单的刘海
        this.hairSprite.fillEllipse(0, -35, 30, 15);
        
        // 简单的发饰
        this.hairSprite.fillStyle(0xFF69B4);
        this.hairSprite.fillCircle(-10, -35, 5);
        this.hairSprite.fillCircle(10, -35, 5);
    }

    private drawFace(): void {
        this.faceSprite.clear();
        this.drawFacialFeatures(this.currentEmotion);
    }

    private drawFacialFeatures(emotion: string): void {
        // 大眼睛基础
        this.faceSprite.fillStyle(0xFFFFFF);
        this.faceSprite.fillCircle(-8, -20, 8);
        this.faceSprite.fillCircle(8, -20, 8);
        
        switch (emotion) {
            case 'happy':
                this.drawHappyExpression();
                break;
            case 'surprised':
                this.drawSurprisedExpression();
                break;
            case 'confused':
                this.drawConfusedExpression();
                break;
            case 'excited':
                this.drawExcitedExpression();
                break;
            case 'scared':
                this.drawScaredExpression();
                break;
            default:
                this.drawHappyExpression();
        }
        
        // 小鼻子
        this.faceSprite.fillStyle(0xFFB6C1);
        this.faceSprite.fillCircle(0, -15, 2);
        
        // 腮红
        this.faceSprite.fillStyle(0xFFB6C1, 0.4);
        this.faceSprite.fillCircle(-15, -12, 6);
        this.faceSprite.fillCircle(15, -12, 6);
    }

    private drawHappyExpression(): void {
        // 开心的眼睛
        this.faceSprite.fillStyle(0x000000);
        this.faceSprite.fillEllipse(-8, -20, 10, 6);
        this.faceSprite.fillEllipse(8, -20, 10, 6);
        
        // 眼睛高光
        this.faceSprite.fillStyle(0xFFFFFF);
        this.faceSprite.fillCircle(-6, -22, 2);
        this.faceSprite.fillCircle(10, -22, 2);
        
        // 开心的嘴巴
        this.faceSprite.lineStyle(3, 0xFF69B4);
        this.faceSprite.beginPath();
        this.faceSprite.arc(0, -10, 8, 0.2, Math.PI - 0.2);
        this.faceSprite.strokePath();
    }

    private drawSurprisedExpression(): void {
        // 惊讶的眼睛
        this.faceSprite.fillStyle(0x000000);
        this.faceSprite.fillCircle(-8, -20, 4);
        this.faceSprite.fillCircle(8, -20, 4);
        
        // 惊讶的嘴巴
        this.faceSprite.fillStyle(0xFF69B4);
        this.faceSprite.fillCircle(0, -10, 3);
    }

    private drawConfusedExpression(): void {
        // 困惑的眼睛
        this.faceSprite.fillStyle(0x000000);
        this.faceSprite.fillCircle(-8, -20, 4);
        this.faceSprite.fillCircle(8, -20, 4);
        
        // 困惑的嘴巴
        this.faceSprite.lineStyle(3, 0xFF69B4);
        this.faceSprite.beginPath();
        this.faceSprite.moveTo(-5, -10);

        this.faceSprite.strokePath();
    }

    private drawExcitedExpression(): void {
        // 星星眼
        this.faceSprite.fillStyle(0xFFD700);
        this.drawStar(-8, -20, 5);
        this.drawStar(8, -20, 5);
        
        // 大笑
        this.faceSprite.lineStyle(3, 0xFF1493);
        this.faceSprite.beginPath();
        this.faceSprite.arc(0, -10, 10, 0.1, Math.PI - 0.1);
        this.faceSprite.strokePath();
    }

    private drawScaredExpression(): void {
        // 害怕的眼睛
        this.faceSprite.fillStyle(0x000000);
        this.faceSprite.fillCircle(-8, -20, 3);
        this.faceSprite.fillCircle(8, -20, 3);
        
        // 害怕的嘴巴
        this.faceSprite.lineStyle(3, 0x4169E1);
        this.faceSprite.beginPath();
        this.faceSprite.arc(0, -8, 6, 1.2, Math.PI - 1.2);
        this.faceSprite.strokePath();
    }

    private drawStar(x: number, y: number, size: number): void {
        const points: number[] = [];
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? size : size / 2;
            points.push(x + Math.cos(angle) * radius);
            points.push(y + Math.sin(angle) * radius);
        }
        
        this.faceSprite.fillPoints(points, true);
    }

    private drawAccessories(): void {
        this.accessoriesSprite.clear();
        
        // 简单的头饰
        this.accessoriesSprite.fillStyle(0xFF1493);
        this.accessoriesSprite.fillCircle(-10, -35, 6);
        this.accessoriesSprite.fillCircle(10, -35, 6);
        
        // 简单的项链
        this.accessoriesSprite.lineStyle(3, 0xFFD700);
        this.accessoriesSprite.beginPath();
        this.accessoriesSprite.arc(0, -5, 15, -0.5, Math.PI + 0.5);
        this.accessoriesSprite.strokePath();
        
        // 心形吊坠
        this.drawHeart(0, 0, 5, 0xFF69B4);
    }

    private drawHeart(x: number, y: number, size: number, color: number): void {
        this.accessoriesSprite.fillStyle(color);
        
        // 心形的两个圆形部分
        this.accessoriesSprite.fillCircle(x - size/2, y, size/2);
        this.accessoriesSprite.fillCircle(x + size/2, y, size/2);
        
        // 心形的尖角部分
        this.accessoriesSprite.beginPath();
        this.accessoriesSprite.moveTo(x - size, y);
        this.accessoriesSprite.lineTo(x, y + size);
        this.accessoriesSprite.lineTo(x + size, y);
        this.accessoriesSprite.closePath();
        this.accessoriesSprite.fillPath();
    }

    private addAnimations(): void {
        // 简单的呼吸动画
        this.scene.tweens.add({
            targets: this,
            scaleY: { from: 1, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 简单的摇摆动画
        this.scene.tweens.add({
            targets: this,
            rotation: { from: -0.02, to: 0.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // 公共方法：改变表情
    public setEmotion(emotion: string): void {
        this.currentEmotion = emotion;
        this.faceSprite.clear();
        this.drawFacialFeatures(emotion);
    }

    // 公共方法：播放移动动画
    public playWalkAnimation(): void {
        this.scene.tweens.add({
            targets: this,
            rotation: { from: -0.05, to: 0.05 },
            duration: 200,
            yoyo: true,
            repeat: 1
        });
    }

    // 公共方法：播放跳跃动画
    public playJumpAnimation(): void {
        this.scene.tweens.add({
            targets: this,
            scaleX: { from: 1, to: 1.2 },
            scaleY: { from: 1, to: 1.2 },
            duration: 150,
            yoyo: true
        });
    }

    // 公共方法：播放旋转庆祝动画
    public playCelebrationAnimation(): void {
        this.scene.tweens.add({
            targets: this,
            scaleX: { from: 1, to: 1.4 },
            scaleY: { from: 1, to: 1.4 },
            rotation: Math.PI * 2,
            duration: 1000,
            ease: 'Back.easeOut'
        });
    }

    // 公共方法：播放失败动画
    public playDefeatAnimation(): void {
        this.scene.tweens.add({
            targets: this,
            y: this.y + 20,
            alpha: 0.5,
            rotation: 0.2,
            duration: 1000,
            ease: 'Power2.easeOut'
        });
    }

    // 公共方法：重置角色状态
    public resetCharacter(): void {
        this.setAlpha(1);
        this.setScale(1);
        this.setRotation(0);
        this.setEmotion('happy');
    }
}