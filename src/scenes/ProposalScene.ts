import Phaser from 'phaser';

export default class ProposalScene extends Phaser.Scene {
    private hearts: Phaser.GameObjects.GameObject[] = [];
  

    constructor() {
        super({ key: 'ProposalScene' });
    }

    create(): void {
        // 创建浪漫的渐变背景
        this.createGradientBackground();
        
        // 创建粒子效果
        this.createParticleEffects();
        
        // 显示求婚动画
        this.showProposalAnimation();
        
        // 创建心形飘落效果
        this.createHeartRain();
        
        // 添加背景音乐提示
        this.time.delayedCall(1000, () => {
            this.showMusicNote();
        });
    }

    private createGradientBackground(): void {
        // 创建渐变背景（从深紫色到粉色）
        const bg = this.add.graphics();
        
        // 模拟渐变效果
        for (let i = 0; i < 600; i++) {
            const alpha = i / 600;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                new Phaser.Display.Color(102, 51, 153, 1), // 深紫色
                new Phaser.Display.Color(255, 105, 180, 1), // 粉色
                100,
                alpha * 100
            );
            
            bg.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
            bg.fillRect(0, i, 800, 1);
        }
    }

    private createParticleEffects(): void {
        // 创建闪烁星星效果
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(0, 600),
                Phaser.Math.Between(1, 3),
                0xFFFFFF
            );
            
            this.tweens.add({
                targets: star,
                alpha: { from: 0, to: 1 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    private showProposalAnimation(): void {
        // 标题动画
        const title = this.add.text(400, 150, '🎉 恭喜你完成了冒险！ 🎉', {
            fontSize: '32px',
            color: '#FFFFFF',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: title,
            alpha: 1,
            y: 120,
            duration: 1500,
            ease: 'Back.easeOut'
        });

        // 主要求婚信息
        this.time.delayedCall(2000, () => {
            const mainText = this.add.text(400, 250, '在这个神奇的冒险之后...', {
                fontSize: '24px',
                color: '#FFE4E1',
                align: 'center'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: mainText,
                alpha: 1,
                duration: 1000
            });
        });

        // 求婚文字
        this.time.delayedCall(4000, () => {
            const proposalText = this.add.text(400, 320, '💍 你愿意嫁给我吗？ 💍', {
                fontSize: '42px',
                color: '#FFD700',
                align: 'center',
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#8B0000',
                    blur: 8,
                    fill: true
                }
            }).setOrigin(0.5).setAlpha(0);

            // 打字机效果
            this.typewriterEffect(proposalText, '💍 你愿意嫁给我吗？ 💍');
            
            // 脉动动画
            this.tweens.add({
                targets: proposalText,
                scaleX: { from: 1, to: 1.1 },
                scaleY: { from: 1, to: 1.1 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // 浪漫副文字
        this.time.delayedCall(6000, () => {
            const romanticText = this.add.text(400, 400, '让我们一起开始\n人生最美好的冒险吧！ 💕', {
                fontSize: '20px',
                color: '#FFC0CB',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: romanticText,
                alpha: 1,
                y: 380,
                duration: 1500,
                ease: 'Power2.easeOut'
            });
        });

        // 创建响应按钮
        this.time.delayedCall(7000, () => {
            this.createResponseButtons();
        });
    }

    private typewriterEffect(textObject: Phaser.GameObjects.Text, fullText: string): void {
        textObject.setAlpha(1);
        textObject.setText('');
        
        let currentText = '';
        let charIndex = 0;
        
        const timer = this.time.addEvent({
            delay: 150,
            callback: () => {
                if (charIndex < fullText.length) {
                    currentText += fullText[charIndex];
                    textObject.setText(currentText);
                    charIndex++;
                } else {
                    timer.destroy();
                }
            },
            repeat: fullText.length - 1
        });
    }

    private createResponseButtons(): void {
        // "是的"按钮
        const yesButton = this.add.text(300, 480, '💖 是的，我愿意！ 💖', {
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#FF1493',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setAlpha(0).setInteractive();

        // "需要时间"按钮
        const maybeButton = this.add.text(500, 480, '🤔 让我想想...', {
            fontSize: '20px',
            color: '#FFFFFF',
            backgroundColor: '#9370DB',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setAlpha(0).setInteractive();

        // 按钮出现动画
        this.tweens.add({
            targets: [yesButton, maybeButton],
            alpha: 1,
            y: 460,
            duration: 1000,
            ease: 'Back.easeOut',
            stagger: 200
        });

        // 按钮交互
        yesButton.on('pointerover', () => {
            this.tweens.add({
                targets: yesButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200
            });
        });

        yesButton.on('pointerout', () => {
            this.tweens.add({
                targets: yesButton,
                scaleX: 1,
                scaleY: 1,
                duration: 200
            });
        });

        yesButton.on('pointerdown', () => {
            this.showYesResponse();
        });

        maybeButton.on('pointerover', () => {
            maybeButton.setStyle({ backgroundColor: '#8A2BE2' });
        });

        maybeButton.on('pointerout', () => {
            maybeButton.setStyle({ backgroundColor: '#9370DB' });
        });

        maybeButton.on('pointerdown', () => {
            this.showMaybeResponse();
        });
    }

    private showYesResponse(): void {
        // 清除屏幕
        this.children.removeAll();
        
        // 创建庆祝背景
        this.createCelebrationBackground();
        
        // 显示庆祝消息
        this.add.text(400, 200, '🎊 太棒了！ 🎊', {
            fontSize: '48px',
            color: '#FFD700',
        }).setOrigin(0.5);

        this.add.text(400, 280, '我们将拥有最美好的未来！', {
            fontSize: '24px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.text(400, 350, '感谢你陪我完成这个特殊的游戏\n这将是我们爱情故事的开始 💕', {
            fontSize: '18px',
            color: '#FFC0CB',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // 重新开始按钮
        const restartButton = this.add.text(400, 450, '🔄 再玩一次', {
            fontSize: '20px',
            color: '#FFFFFF',
            backgroundColor: '#4CAF50',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // 庆祝动画
        this.createFireworks();
    }

    private showMaybeResponse(): void {
        const responseText = this.add.text(400, 520, '没关系，爱情不能强求 💙\n无论如何，感谢你玩这个游戏！', {
            fontSize: '18px',
            color: '#E6E6FA',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: responseText,
            alpha: 1,
            duration: 1000
        });

        // 添加重新开始选项
        this.time.delayedCall(2000, () => {
            const restartButton = this.add.text(400, 580, '🔄 重新开始游戏', {
                fontSize: '16px',
                color: '#FFFFFF',
                backgroundColor: '#6495ED',
                padding: { x: 12, y: 6 }
            }).setOrigin(0.5).setInteractive();

            restartButton.on('pointerdown', () => {
                this.scene.start('GameScene');
            });
        });
    }

    private createHeartRain(): void {
        // 创建心形飘落效果
        this.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.hearts.length < 20) {
                    const heart = this.add.text(
                        Phaser.Math.Between(0, 800),
                        -50,
                        '💖',
                        { fontSize: '20px' }
                    );
                    
                    this.hearts.push(heart);
                    
                    this.tweens.add({
                        targets: heart,
                        y: 700,
                        rotation: Phaser.Math.PI2,
                        duration: Phaser.Math.Between(3000, 6000),
                        ease: 'Linear',
                        onComplete: () => {
                            const index = this.hearts.indexOf(heart);
                            if (index > -1) {
                                this.hearts.splice(index, 1);
                            }
                            heart.destroy();
                        }
                    });
                }
            },
            repeat: -1
        });
    }

    private createCelebrationBackground(): void {
        // 创建彩虹渐变背景
        const bg = this.add.graphics();
        const colors = [
            new Phaser.Display.Color(255, 0, 0),     // 红
            new Phaser.Display.Color(255, 165, 0),   // 橙
            new Phaser.Display.Color(255, 255, 0),   // 黄
            new Phaser.Display.Color(0, 255, 0),     // 绿
            new Phaser.Display.Color(0, 0, 255),     // 蓝
            new Phaser.Display.Color(75, 0, 130),    // 靛
            new Phaser.Display.Color(238, 130, 238)  // 紫
        ];

        for (let i = 0; i < 600; i++) {
            const colorIndex = Math.floor((i / 600) * (colors.length - 1));
            const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
            const t = ((i / 600) * (colors.length - 1)) - colorIndex;
            
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                colors[colorIndex],
                colors[nextColorIndex],
                100,
                t * 100
            );
            
            bg.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 0.3);
            bg.fillRect(0, i, 800, 1);
        }
    }

    private createFireworks(): void {
        // 创建烟花效果
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 1000, () => {
                const x = Phaser.Math.Between(100, 700);
                const y = Phaser.Math.Between(100, 400);
                
                // 创建烟花爆炸效果
                for (let j = 0; j < 12; j++) {
                    const particle = this.add.circle(x, y, 3, 0xFFD700);
                    const angle = (j / 12) * Phaser.Math.PI2;
                    const distance = Phaser.Math.Between(50, 100);
                    
                    this.tweens.add({
                        targets: particle,
                        x: x + Math.cos(angle) * distance,
                        y: y + Math.sin(angle) * distance,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2.easeOut',
                        onComplete: () => particle.destroy()
                    });
                }
            });
        }
    }

    private showMusicNote(): void {
        const musicNote = this.add.text(50, 50, '🎵 建议播放浪漫音乐 🎵', {
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: '#4169E1',
            padding: { x: 10, y: 5 },
        }).setAlpha(0.8);

        this.tweens.add({
            targets: musicNote,
            alpha: 0,
            duration: 5000
        });
    }
}