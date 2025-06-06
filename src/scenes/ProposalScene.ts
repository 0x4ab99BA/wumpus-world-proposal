import Phaser from 'phaser';

export default class ProposalScene extends Phaser.Scene {
    private hearts: Phaser.GameObjects.GameObject[] = [];
    private jewelry: Phaser.GameObjects.GameObject[] = [];
    private houses: Phaser.GameObjects.GameObject[] = [];
    private animals: Phaser.GameObjects.GameObject[] = [];
    private fireflies: Phaser.GameObjects.GameObject[] = [];
    private stars: Phaser.GameObjects.GameObject[] = [];
    private magicParticles: Phaser.GameObjects.GameObject[] = [];

    constructor() {
        super({ key: 'ProposalScene' });
    }

    create(): void {
        // 创建与index相同的魔法背景
        this.createMagicBackground();
        
        // 创建星空
        this.createStarfield();
        
        // 创建魔法光晕
        this.createMagicAura();
        
        // 创建萤火虫
        this.createFireflies();
        
        // 创建魔法粒子
        this.createMagicParticles();
        
        // 显示求婚动画
        this.showProposalAnimation();
        
        // 创建各种掉落效果（降低频率）
        this.createJewelryRain();
        this.createHouseRain();
        this.createAnimalRain();
        this.createHeartRain();
        
        // 创建烟花效果
        this.createFireworksShow();
        
        // 添加背景音乐提示
        this.time.delayedCall(1000, () => {
            this.showMusicNote();
        });

        // 设置点击交互效果
        this.setupClickInteraction();
    }

    private createMagicBackground(): void {
        // 创建浪漫梦幻的渐变背景
        const bg = this.add.graphics();
        
        // 创建星空渐变效果
        for (let y = 0; y < 600; y++) {
            const distanceFromBottom = (600 - y) / 600;
            let color: number;
            
            if (distanceFromBottom > 0.33) {
                // 从底部33%到100%：深紫色到玫瑰金
                const t = (distanceFromBottom - 0.33) / 0.67;
                const r = Math.round(188 + (147 - 188) * t);  // 玫瑰金到深紫色
                const g = Math.round(143 + (112 - 143) * t);
                const b = Math.round(143 + (219 - 143) * t);
                color = Phaser.Display.Color.GetColor(r, g, b);
            } else {
                // 从0%到33%：深紫色到深蓝色
                const t = distanceFromBottom / 0.33;
                const r = Math.round(25 + (147 - 25) * t);    // 深蓝色到深紫色
                const g = Math.round(25 + (112 - 25) * t);
                const b = Math.round(112 + (219 - 112) * t);
                color = Phaser.Display.Color.GetColor(r, g, b);
            }
            
            bg.fillStyle(color);
            bg.fillRect(0, y, 800, 1);
        }

        // 添加梦幻光晕效果
        const glow1 = this.add.circle(200, 150, 150, 0xFF69B4, 0.1);
        const glow2 = this.add.circle(600, 450, 200, 0x9370DB, 0.1);
        const glow3 = this.add.circle(400, 300, 180, 0x87CEEB, 0.1);

        // 光晕动画
        this.tweens.add({
            targets: [glow1, glow2, glow3],
            alpha: { from: 0.1, to: 0.2 },
            scaleX: { from: 1, to: 1.2 },
            scaleY: { from: 1, to: 1.2 },
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createStarfield(): void {
        // 创建更多更亮的星星
        for (let i = 0; i < 200; i++) {
            const size = Phaser.Math.Between(1, 3);
            const star = this.add.circle(
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(0, 600),
                size,
                0xFFFFFF
            );
            
            // 更明显的闪烁动画
            this.tweens.add({
                targets: star,
                alpha: { from: 0.4, to: 1 },
                scaleX: { from: 1, to: 1.2 },
                scaleY: { from: 1, to: 1.2 },
                duration: Phaser.Math.Between(1500, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
            
            this.stars.push(star);
        }

        // 添加一些较大的星星
        for (let i = 0; i < 20; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(0, 600),
                4,
                0xFFFFFF
            );
            
            // 大星星的动画
            this.tweens.add({
                targets: star,
                alpha: { from: 0.6, to: 1 },
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 3000)
            });
            
            this.stars.push(star);
        }
    }

    private createMagicAura(): void {
        // 创建紫色光晕效果
        const auraColors = [
            { color: 0x8A2BE2, alpha: 0.1, radius: 200 }, // 138, 43, 226
            { color: 0x4B0082, alpha: 0.1, radius: 150 }, // 75, 0, 130
            { color: 0x483D8B, alpha: 0.1, radius: 100 }  // 72, 61, 139
        ];
        
        auraColors.forEach((aura, index) => {
            const circle = this.add.circle(
                Phaser.Math.Between(100, 700),
                Phaser.Math.Between(100, 500),
                aura.radius,
                aura.color,
                aura.alpha
            );
            
            // 光晕移动和变化动画
            this.tweens.add({
                targets: circle,
                x: { from: circle.x, to: circle.x + Phaser.Math.Between(-100, 100) },
                y: { from: circle.y, to: circle.y + Phaser.Math.Between(-50, 50) },
                alpha: { from: aura.alpha, to: aura.alpha * 1.5 },
                duration: 20000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 2000
            });
        });
    }

    private createFireflies(): void {
        // 创建12只萤火虫
        for (let i = 0; i < 12; i++) {
            const firefly = this.add.circle(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(50, 550),
                4,
                0xFFEB3B
            );
            
            // 萤火虫发光效果
            const glow = this.add.circle(firefly.x, firefly.y, 8, 0xFFEB3B, 0.6);
            const glow2 = this.add.circle(firefly.x, firefly.y, 12, 0xFFC107, 0.4);
            const glow3 = this.add.circle(firefly.x, firefly.y, 16, 0xFF9800, 0.2);
            
            // 发光动画
            this.tweens.add({
                targets: [firefly, glow, glow2, glow3],
                alpha: { from: 0.4, to: 1 },
                scaleX: { from: 1, to: 1.2 },
                scaleY: { from: 1, to: 1.2 },
                duration: Phaser.Math.Between(1800, 2800),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // 萤火虫移动轨迹
            const path = new Phaser.Curves.Path(firefly.x, firefly.y);
            for (let j = 0; j < 6; j++) {
                path.lineTo(
                    Phaser.Math.Between(50, 750),
                    Phaser.Math.Between(50, 550)
                );
            }
            path.closePath();
            
            // 沿路径移动
            this.tweens.add({
                targets: [firefly, glow, glow2, glow3],
                duration: Phaser.Math.Between(15000, 25000),
                repeat: -1,
                rotateToPath: true,
                ease: 'Sine.easeInOut',
                motionPath: {
                    path: path,
                    autoRotate: false
                }
            });
            
            this.fireflies.push(firefly);
        }
    }

    private createMagicParticles(): void {
        // 定期创建魔法粒子
        this.time.addEvent({
            delay: 800,
            callback: () => {
                if (this.magicParticles.length < 15) {
                    const particle = this.add.circle(
                        Phaser.Math.Between(0, 800),
                        650, // 从底部开始
                        2,
                        0x87CEEB, // 天蓝色
                        0.8
                    );
                    
                    // 添加白色内核
                    const core = this.add.circle(particle.x, particle.y, 1, 0xFFFFFF);
                    
                    this.magicParticles.push(particle);
                    
                    // 向上飘动动画
                    this.tweens.add({
                        targets: [particle, core],
                        y: -50,
                        x: particle.x + Phaser.Math.Between(-50, 50),
                        rotation: Phaser.Math.PI2,
                        alpha: { from: 0.8, to: 0 },
                        duration: Phaser.Math.Between(8000, 12000),
                        ease: 'Linear',
                        onComplete: () => {
                            const index = this.magicParticles.indexOf(particle);
                            if (index > -1) {
                                this.magicParticles.splice(index, 1);
                            }
                            particle.destroy();
                            core.destroy();
                        }
                    });
                }
            },
            repeat: -1
        });
    }

    private showProposalAnimation(): void {
        // 显示名字 - 使用更艺术的字体和渐变效果
        this.add.text(400, 150, '李晨琳', {
            fontSize: '56px',
            fontFamily: 'Georgia, "Times New Roman", "Microsoft YaHei", serif',
            color: '#FFE4E1',
            align: 'center',
            fontStyle: 'italic bold',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#9370DB',
                blur: 12,
                fill: true
            }
        }).setOrigin(0.5);

        // 添加名字的光晕效果
        const nameGlow = this.add.circle(400, 150, 80, 0xFFE4E1, 0.2);
        this.tweens.add({
            targets: nameGlow,
            alpha: { from: 0.2, to: 0.4 },
            scaleX: { from: 1, to: 1.2 },
            scaleY: { from: 1, to: 1.2 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 求婚文字 - 更华丽的艺术字体
        const proposalText = this.add.text(400, 250, '你愿意嫁给我吗？', {
            fontSize: '52px',
            fontFamily: 'Georgia, "Brush Script MT", "Times New Roman", "Microsoft YaHei", serif',
            color: '#FFD700',
            align: 'center',
            fontStyle: 'italic bold',
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#B8860B',
                blur: 15,
                fill: true
            }
        }).setOrigin(0.5);

        // 添加求婚文字的多层光晕效果
        const textGlow1 = this.add.circle(400, 250, 120, 0xFFD700, 0.15);
        const textGlow2 = this.add.circle(400, 250, 90, 0xFFA500, 0.25);
        const textGlow3 = this.add.circle(400, 250, 60, 0xFFFF00, 0.1);

        // 更复杂的脉动动画
        this.tweens.add({
            targets: proposalText,
            scaleX: { from: 1, to: 1.15 },
            scaleY: { from: 1, to: 1.15 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 光晕动画
        this.tweens.add({
            targets: [textGlow1, textGlow2, textGlow3],
            alpha: { from: 0.15, to: 0.35 },
            scaleX: { from: 1, to: 1.3 },
            scaleY: { from: 1, to: 1.3 },
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 创建响应按钮
        this.time.delayedCall(1000, () => {
            this.createResponseButtons();
        });
    }

    private createJewelryRain(): void {
        const jewelryTypes = ['💎', '💍', '🔶', '🔷', '👑', '💰'];
        
        this.time.addEvent({
            delay: 8000, // 增加延迟从3000到8000
            callback: () => {
                if (this.jewelry.length < 3) { // 减少数量从5到3
                    const jewelry = this.add.text(
                        Phaser.Math.Between(0, 800),
                        -50,
                        jewelryTypes[Phaser.Math.Between(0, jewelryTypes.length - 1)],
                        { fontSize: '32px' }
                    );
                    
                    // 添加金色光晕
                    const glow = this.add.circle(jewelry.x, jewelry.y, 20, 0xFFD700, 0.3);
                    
                    this.jewelry.push(jewelry);
                    
                    this.tweens.add({
                        targets: [jewelry, glow],
                        y: 700,
                        rotation: Phaser.Math.PI2,
                        duration: Phaser.Math.Between(10000, 15000), // 增加持续时间
                        ease: 'Linear',
                        onUpdate: () => {
                            glow.x = jewelry.x;
                            glow.y = jewelry.y;
                        },
                        onComplete: () => {
                            const index = this.jewelry.indexOf(jewelry);
                            if (index > -1) {
                                this.jewelry.splice(index, 1);
                            }
                            jewelry.destroy();
                            glow.destroy();
                        }
                    });
                }
            },
            repeat: -1
        });
    }

    private createHouseRain(): void {
        const houseTypes = ['🏠', '🏡', '🏘️', '🏰', '🏛️'];
        
        this.time.addEvent({
            delay: 15000, // 增加延迟从6000到15000
            callback: () => {
                if (this.houses.length < 1) { // 减少数量从2到1
                    const house = this.add.text(
                        Phaser.Math.Between(0, 800),
                        -80,
                        houseTypes[Phaser.Math.Between(0, houseTypes.length - 1)],
                        { fontSize: '40px' }
                    );
                    
                    // 添加粉色光晕
                    const glow = this.add.circle(house.x, house.y, 25, 0xFFB6C1, 0.4);
                    
                    this.houses.push(house);
                    
                    this.tweens.add({
                        targets: [house, glow],
                        y: 700,
                        rotation: Phaser.Math.Between(-0.3, 0.3),
                        scaleX: { from: 0.5, to: 1.2 },
                        scaleY: { from: 0.5, to: 1.2 },
                        duration: Phaser.Math.Between(15000, 20000), // 增加持续时间
                        ease: 'Linear',
                        onUpdate: () => {
                            glow.x = house.x;
                            glow.y = house.y;
                        },
                        onComplete: () => {
                            const index = this.houses.indexOf(house);
                            if (index > -1) {
                                this.houses.splice(index, 1);
                            }
                            house.destroy();
                            glow.destroy();
                        }
                    });
                }
            },
            repeat: -1
        });
    }

    private createAnimalRain(): void {
        const animalTypes = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🦄'];
        
        this.time.addEvent({
            delay: 10000, // 增加延迟从4000到10000
            callback: () => {
                if (this.animals.length < 2) { // 减少数量从3到2
                    const animal = this.add.text(
                        Phaser.Math.Between(0, 800),
                        -50,
                        animalTypes[Phaser.Math.Between(0, animalTypes.length - 1)],
                        { fontSize: '32px' }
                    );
                    
                    // 添加白色光晕
                    const glow = this.add.circle(animal.x, animal.y, 18, 0xFFFFFF, 0.4);
                    
                    this.animals.push(animal);
                    
                    this.tweens.add({
                        targets: [animal, glow],
                        y: 700,
                        rotation: Phaser.Math.PI2,
                        duration: Phaser.Math.Between(12000, 18000), // 增加持续时间
                        ease: 'Linear',
                        onUpdate: () => {
                            glow.x = animal.x;
                            glow.y = animal.y;
                        },
                        onComplete: () => {
                            const index = this.animals.indexOf(animal);
                            if (index > -1) {
                                this.animals.splice(index, 1);
                            }
                            animal.destroy();
                            glow.destroy();
                        }
                    });
                }
            },
            repeat: -1
        });
    }

    private createHeartRain(): void {
        const heartTypes = ['💖', '💕', '💝', '💗', '💓'];
        
        this.time.addEvent({
            delay: 4000, // 增加延迟从1600到4000
            callback: () => {
                if (this.hearts.length < 4) { // 减少数量从8到4
                    const heart = this.add.text(
                        Phaser.Math.Between(0, 800),
                        -50,
                        heartTypes[Phaser.Math.Between(0, heartTypes.length - 1)],
                        { fontSize: '24px' }
                    );
                    
                    // 添加粉色光晕
                    const glow = this.add.circle(heart.x, heart.y, 15, 0xFFB6C1, 0.5);
                    
                    this.hearts.push(heart);
                    
                    this.tweens.add({
                        targets: [heart, glow],
                        y: 700,
                        rotation: Phaser.Math.PI2,
                        duration: Phaser.Math.Between(8000, 12000), // 增加持续时间
                        ease: 'Linear',
                        onUpdate: () => {
                            glow.x = heart.x;
                            glow.y = heart.y;
                        },
                        onComplete: () => {
                            const index = this.hearts.indexOf(heart);
                            if (index > -1) {
                                this.hearts.splice(index, 1);
                            }
                            heart.destroy();
                            glow.destroy();
                        }
                    });
                }
            },
            repeat: -1
        });
    }

    private createFireworksShow(): void {
        // 定期创建烟花
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.launchFirework();
                
                // 随机同时发射多个烟花
                if (Phaser.Math.Between(0, 100) > 70) {
                    this.time.delayedCall(200, () => this.launchFirework());
                }
                if (Phaser.Math.Between(0, 100) > 90) {
                    this.time.delayedCall(400, () => this.launchFirework());
                }
            },
            repeat: -1
        });
    }

    private launchFirework(): void {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 400);
        const colors = [0xFFD700, 0xFF1493, 0x87CEEB, 0x9370DB, 0xFFB6C1, 0xFFC0CB];
        
        // 创建烟花爆炸粒子
        for (let i = 0; i < 12; i++) {
            const particle = this.add.circle(x, y, 2, colors[Phaser.Math.Between(0, colors.length - 1)]);
            const angle = (i / 12) * Phaser.Math.PI2;
            const distance = Phaser.Math.Between(50, 100);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scaleX: { from: 1, to: 2 },
                scaleY: { from: 1, to: 2 },
                duration: 1500,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    private createResponseButtons(): void {
        // "我愿意"按钮
        const yesButton = this.add.text(400, 350, '我愿意', {
            fontSize: '36px',
            fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
            color: '#FFFFFF',
            backgroundColor: '#FF69B4',
            padding: { x: 40, y: 20 },
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#C71585',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5).setInteractive();

        // 按钮出现动画
        this.tweens.add({
            targets: yesButton,
            alpha: 1,
            y: 330,
            duration: 1000,
            ease: 'Back.easeOut'
        });

        // 按钮交互效果
        yesButton.on('pointerover', () => {
            this.tweens.add({
                targets: yesButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200
            });
            
            // 创建心形粒子
            this.createHeartParticles(yesButton.x, yesButton.y);
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
    }

    private createHeartParticles(x: number, y: number): void {
        // 创建心形粒子效果
        for (let i = 0; i < 5; i++) {
            const heart = this.add.text(x, y, '💕', {
                fontSize: '16px'
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: heart,
                x: x + Phaser.Math.Between(-30, 30),
                y: y - Phaser.Math.Between(20, 40),
                alpha: 0,
                scaleX: { from: 1, to: 0.5 },
                scaleY: { from: 1, to: 0.5 },
                duration: 1000,
                ease: 'Power2.easeOut',
                delay: i * 100,
                onComplete: () => heart.destroy()
            });
        }
    }

    private showYesResponse(): void {
        // 清除所有UI元素
        this.children.list.forEach((child: any) => {
            if (child.type === 'Text' || (child.getData && child.getData('isUI'))) {
                child.destroy();
            }
        });
        
        // 停止所有掉落效果
        this.time.removeAllEvents();
        
        // 创建彩虹庆祝背景
        this.createCelebrationBackground();

        // 创建从地面升起爆炸的烟花秀
        this.createGroundFireworksShow();
        
        // 创建金色粒子爆炸效果
        this.time.delayedCall(3000, () => {
            this.createGoldenParticleExplosion();
        });
    }

    private createGroundFireworksShow(): void {
        // 创建多个从地面升起的烟花
        const launchPositions = [100, 200, 300, 400, 500, 600, 700];
        const colors = [
            0xFF1493, // 深粉色
            0xFFD700, // 金色
            0x87CEEB, // 天蓝色
            0x9370DB, // 紫色
            0xFF6347, // 橙红色
            0x32CD32, // 绿色
            0xFF69B4  // 热粉色
        ];

        // 第一波烟花
        launchPositions.forEach((x, index) => {
            this.time.delayedCall(index * 300, () => {
                this.launchGroundFirework(x, colors[index % colors.length]);
            });
        });

        // 第二波烟花（更密集）
        this.time.delayedCall(3000, () => {
            launchPositions.forEach((x, index) => {
                this.time.delayedCall(index * 150, () => {
                    this.launchGroundFirework(x + 50, colors[(index + 3) % colors.length]);
                });
            });
        });

        // 第三波烟花（最终高潮）
        this.time.delayedCall(6000, () => {
            for (let i = 0; i < 15; i++) {
                this.time.delayedCall(i * 100, () => {
                    const x = Phaser.Math.Between(100, 700);
                    const color = colors[Phaser.Math.Between(0, colors.length - 1)];
                    this.launchGroundFirework(x, color);
                });
            }
        });
    }

    private launchGroundFirework(startX: number, color: number): void {
        // 创建火箭轨迹
        const rocket = this.add.circle(startX, 600, 3, color);
        const trail: Phaser.GameObjects.GameObject[] = [];
        
        // 创建上升轨迹
        const targetY = Phaser.Math.Between(150, 300);
        const riseTime = Phaser.Math.Between(800, 1200);
        
        // 火箭上升动画
        this.tweens.add({
            targets: rocket,
            y: targetY,
            x: startX + Phaser.Math.Between(-30, 30), // 轻微的左右摆动
            duration: riseTime,
            ease: 'Power2.easeOut',
            onUpdate: () => {
                // 创建尾迹效果
                if (Phaser.Math.Between(0, 100) > 70) {
                    const trailParticle = this.add.circle(rocket.x, rocket.y, 2, color, 0.6);
                    trail.push(trailParticle);
                    
                    this.tweens.add({
                        targets: trailParticle,
                        alpha: 0,
                        scaleX: 0.1,
                        scaleY: 0.1,
                        duration: 500,
                        onComplete: () => {
                            trailParticle.destroy();
                            const index = trail.indexOf(trailParticle);
                            if (index > -1) trail.splice(index, 1);
                        }
                    });
                }
            },
            onComplete: () => {
                // 火箭到达最高点，开始爆炸
                rocket.destroy();
                this.createFireworkExplosion(rocket.x, rocket.y, color);
                
                // 清理尾迹
                trail.forEach(particle => {
                    if (particle && !particle.destroy) {
                        particle.destroy();
                    }
                });
            }
        });
    }

    private createFireworkExplosion(x: number, y: number, baseColor: number): void {
        const particleCount = Phaser.Math.Between(20, 30);
        const color = new Phaser.Display.Color(baseColor);
        const explosionColors = [
            baseColor,
            Phaser.Display.Color.GetColor(
                Math.min(255, color.red + 50),
                Math.min(255, color.green + 50),
                Math.min(255, color.blue + 50)
            ),
            0xFFFFFF // 白色闪光
        ];

        // 创建中心闪光
        const flash = this.add.circle(x, y, 30, 0xFFFFFF);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            onComplete: () => flash.destroy()
        });

        // 创建爆炸粒子
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Phaser.Math.PI2;
            const distance = Phaser.Math.Between(50, 120);
            const particleColor = explosionColors[Phaser.Math.Between(0, explosionColors.length - 1)];
            const particleSize = Phaser.Math.Between(2, 5);
            
            const particle = this.add.circle(x, y, particleSize, particleColor);
            
            // 粒子爆炸动画
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance + Phaser.Math.Between(20, 60), // 重力效果
                alpha: 0,
                scaleX: { from: 1, to: 0.1 },
                scaleY: { from: 1, to: 0.1 },
                duration: Phaser.Math.Between(1000, 2000),
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });

            // 添加小的火花效果
            if (Phaser.Math.Between(0, 100) > 60) {
                const spark = this.add.circle(x, y, 1, 0xFFFFFF);
                this.tweens.add({
                    targets: spark,
                    x: x + Math.cos(angle + 0.2) * (distance * 0.7),
                    y: y + Math.sin(angle + 0.2) * (distance * 0.7) + 30,
                    alpha: 0,
                    duration: 800,
                    ease: 'Power2.easeOut',
                    onComplete: () => spark.destroy()
                });
            }
        }

        // 创建光环效果
        const ring = this.add.circle(x, y, 10, baseColor, 0.5);
        ring.setStrokeStyle(2, baseColor);
        
        this.tweens.add({
            targets: ring,
            scaleX: 8,
            scaleY: 8,
            alpha: 0,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => ring.destroy()
        });
    }

    private createCelebrationBackground(): void {
        // 创建彩虹渐变背景效果
        const bg = this.add.graphics();
        const rainbowColors = [
            new Phaser.Display.Color(255, 0, 0),     // 红
            new Phaser.Display.Color(255, 165, 0),   // 橙
            new Phaser.Display.Color(255, 255, 0),   // 黄
            new Phaser.Display.Color(0, 255, 0),     // 绿
            new Phaser.Display.Color(0, 0, 255),     // 蓝
            new Phaser.Display.Color(75, 0, 130),    // 靛
            new Phaser.Display.Color(238, 130, 238)  // 紫
        ];

        for (let i = 0; i < 600; i++) {
            const colorIndex = Math.floor((i / 600) * (rainbowColors.length - 1));
            const nextColorIndex = Math.min(colorIndex + 1, rainbowColors.length - 1);
            const t = ((i / 600) * (rainbowColors.length - 1)) - colorIndex;
            
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                rainbowColors[colorIndex],
                rainbowColors[nextColorIndex],
                100,
                t * 100
            );
            
            bg.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 0.3);
            bg.fillRect(0, i, 800, 1);
        }

        // 彩虹背景动画
        this.tweens.add({
            targets: bg,
            alpha: { from: 0.3, to: 0.6 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createGoldenParticleExplosion(): void {
        // 创建金色粒子爆炸效果
        const centerX = 400;
        const centerY = 300;
        
        for (let i = 0; i < 50; i++) {
            const particle = this.add.circle(centerX, centerY, 3, 0xFFD700);
            const angle = (i / 50) * Phaser.Math.PI2;
            const distance = Phaser.Math.Between(100, 200);
            
            this.tweens.add({
                targets: particle,
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                alpha: 0,
                scaleX: { from: 1, to: 0.1 },
                scaleY: { from: 1, to: 0.1 },
                duration: 2000,
                ease: 'Power2.easeOut',
                delay: i * 20,
                onComplete: () => particle.destroy()
            });
        }
    }

    private showMusicNote(): void {
        const musicNote = this.add.text(50, 50, '🎵 🎵 🎵', {
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: '#4169E1',
            padding: { x: 10, y: 5 },
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000080',
                blur: 3,
                fill: true
            }
        }).setAlpha(0.8);

        // 音乐提示渐隐
        this.tweens.add({
            targets: musicNote,
            alpha: 0,
            duration: 5000,
            onComplete: () => musicNote.destroy()
        });
    }

    // 在create方法末尾添加点击交互效果
    private setupClickInteraction(): void {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // 在点击位置创建小型烟花
            this.createClickFirework(pointer.x, pointer.y);
        });
    }

    private createClickFirework(x: number, y: number): void {
        const colors = [0xFFD700, 0xFF1493, 0x87CEEB, 0x9370DB];
        
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 2, colors[Phaser.Math.Between(0, colors.length - 1)]);
            const angle = (i / 8) * Phaser.Math.PI2;
            const distance = 30;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                duration: 800,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
}