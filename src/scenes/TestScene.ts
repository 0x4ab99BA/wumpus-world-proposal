import Phaser from 'phaser';
import { SpriteManager } from '../utils/SpriteManager';
import { AnimatedCharacter } from '../objects/AnimatedCharacter';
import { StaticMonster } from '../objects/StaticMonster';
import { LadyCharacter } from '../objects/LadyCharacter';

export default class TestScene extends Phaser.Scene {
    private character!: AnimatedCharacter;
    private ladyCharacter!: LadyCharacter;
    private monster!: StaticMonster;
    private spriteManager!: SpriteManager;
    private isCharacterReady: boolean = false;
    private testMarkers: Phaser.GameObjects.Rectangle[] = [];
    private testLabels: Phaser.GameObjects.Text[] = [];
    private buttons: Phaser.GameObjects.Container[] = [];
    private activeCharacter: 'girl' | 'lady' = 'girl'; // 当前选中的角色
    private characterSelectors: Phaser.GameObjects.Container[] = []; // 角色选择器

    // 测试用的移动目标
    private testPositions: { x: number; y: number; label: string }[] = [
        { x: 200, y: 300, label: '左侧' },
        { x: 600, y: 300, label: '右侧' },
        { x: 400, y: 150, label: '上方' },
        { x: 400, y: 450, label: '下方' },
        { x: 400, y: 300, label: '中心' }
    ];

    constructor() {
        super({ key: 'TestScene' });
    }

    preload(): void {
        // 初始化精灵管理器
        this.spriteManager = new SpriteManager(this);
        
        // 预加载精灵图集
        this.spriteManager.preloadSprites();
    }

    create(): void {
        // 创建背景
        this.createBackground();
        
        // 创建精灵动画
        try {
            this.spriteManager.createAnimations();
            console.log('Animations created successfully!');
        } catch (error) {
            console.error('Failed to create animations:', error);
            this.showErrorMessage('动画创建失败');
            return;
        }

        // 创建角色
        this.createCharacter();
        
        // 创建角色选择器
        this.createCharacterSelectors();
        
        // 创建测试标记点
        this.createTestMarkers();
        
        // 添加键盘控制
        this.setupKeyboardControls();

        // 添加鼠标点击移动
        this.setupMouseControls();

        // 添加测试按钮
        this.createTestButtons();
    }

    private createBackground(): void {
        // 创建渐变背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F6FF, 0xE0F6FF, 1);
        bg.fillRect(0, 0, 800, 600);
        
        // 添加网格线帮助定位
        const grid = this.add.graphics();
        grid.lineStyle(1, 0xCCCCCC, 0.5);
        
        for (let x = 0; x <= 800; x += 50) {
            grid.moveTo(x, 0);
            grid.lineTo(x, 600);
        }
        
        for (let y = 0; y <= 600; y += 50) {
            grid.moveTo(0, y);
            grid.lineTo(800, y);
        }
        
        grid.strokePath();
    }

    private createCharacter(): void {
        try {
            // 在屏幕中心创建角色
            this.character = new AnimatedCharacter(this, 400, 300);
            this.ladyCharacter = new LadyCharacter(this, 600, 300);
            this.isCharacterReady = true;
            console.log('AnimatedCharacter created successfully!');
            
            // 创建怪物（放在右上角）
            this.monster = new StaticMonster(this, 400, 500);
            console.log('Monster created successfully!');
            
            // 显示成功消息
            this.showSuccessMessage('角色创建成功！');
            
        } catch (error) {
            console.error('Failed to create characters:', error);
            this.showErrorMessage('角色创建失败，请检查精灵图文件');
        }
    }

    private createCharacterSelectors(): void {
        const selectorConfigs = [
            { text: '👧 Girl', x: 100, y: 50, character: 'girl' as const },
            { text: '👩 Lady', x: 250, y: 50, character: 'lady' as const }
        ];

        selectorConfigs.forEach(config => {
            const selector = this.add.container(config.x, config.y);
            
            const background = this.add.rectangle(0, 0, 120, 40, 
                config.character === this.activeCharacter ? 0x666666 : 0x4a4a4a)
                .setInteractive()
                .on('pointerover', () => {
                    if (config.character !== this.activeCharacter) {
                        background.setFillStyle(0x666666);
                    }
                })
                .on('pointerout', () => {
                    if (config.character !== this.activeCharacter) {
                        background.setFillStyle(0x4a4a4a);
                    }
                })
                .on('pointerdown', () => {
                    this.activeCharacter = config.character;
                    // 更新所有选择器的外观
                    this.updateCharacterSelectors();
                });
            
            const text = this.add.text(0, 0, config.text, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            selector.add([background, text]);
            this.characterSelectors.push(selector);
        });
    }

    private updateCharacterSelectors(): void {
        this.characterSelectors.forEach((selector, index) => {
            const background = selector.getAt(0) as Phaser.GameObjects.Rectangle;
            const isActive = (index === 0 && this.activeCharacter === 'girl') || 
                           (index === 1 && this.activeCharacter === 'lady');
            background.setFillStyle(isActive ? 0x666666 : 0x4a4a4a);
        });
    }

    private createTestMarkers(): void {
        const positions = [
            { x: 200, y: 300, label: 'Left' },
            { x: 600, y: 300, label: 'Right' },
            { x: 400, y: 100, label: 'Up' },
            { x: 400, y: 500, label: 'Down' },
            { x: 400, y: 300, label: 'Center' }
        ];

        positions.forEach(({ x, y, label }) => {
            // 创建标记点
            const marker = this.add.rectangle(x, y, 20, 20, 0xff0000, 0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    const character = this.activeCharacter === 'girl' ? this.character : this.ladyCharacter;
                    if (!character.getIsMoving()) {
                        character.moveToPosition(x, y);
                    }
                });

            // 创建标签
            const text = this.add.text(x, y + 20, label, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);

            this.testMarkers.push(marker);
            this.testLabels.push(text);
        });
    }

    private setupKeyboardControls(): void {
        const cursors = this.input.keyboard!.createCursorKeys();
        const moveDistance = 50;

        this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
            const character = this.activeCharacter === 'girl' ? this.character : this.ladyCharacter;
            if (character.getIsMoving()) return;

            let targetX = character.x;
            let targetY = character.y;
            let direction: 'left' | 'right' | 'up' | 'down' | null = null;

            switch (event.code) {
                case 'ArrowLeft':
                    targetX -= moveDistance;
                    direction = 'left';
                    break;
                case 'ArrowRight':
                    targetX += moveDistance;
                    direction = 'right';
                    break;
                case 'ArrowUp':
                    targetY -= moveDistance;
                    direction = 'up';
                    break;
                case 'ArrowDown':
                    targetY += moveDistance;
                    direction = 'down';
                    break;
            }

            if (direction) {
                character.setDirection(direction);
                character.moveToPosition(targetX, targetY);
            }
        });
    }

    private setupMouseControls(): void {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // 检查是否点击了测试标记点
            const clickedMarker = this.testMarkers.find(marker => 
                marker.getBounds().contains(pointer.x, pointer.y)
            );
            
            if (clickedMarker) return; // 如果点击了标记点，不处理移动

            const character = this.activeCharacter === 'girl' ? this.character : this.ladyCharacter;

            // 计算移动方向
            const dx = pointer.x - character.x;
            const dy = pointer.y - character.y;
            const angle = Math.atan2(dy, dx);
            const degrees = (angle * 180 / Math.PI + 360) % 360;
            
            let direction: 'left' | 'right' | 'up' | 'down';
            if (degrees >= 225 && degrees < 315) {
                direction = 'up';
            } else if (degrees >= 135 && degrees < 225) {
                direction = 'left';
            } else if (degrees >= 45 && degrees < 135) {
                direction = 'down';
            } else {
                direction = 'right';
            }

            // 移动角色
            if (!character.getIsMoving()) {
                character.setDirection(direction);
                character.moveToPosition(pointer.x, pointer.y);
            }
        });
    }

    private createTestButtons(): void {
        const buttonStyle = {
            fontSize: '20px',
            backgroundColor: '#4a4a4a',
            padding: { x: 10, y: 5 },
            fixedWidth: 120,
            align: 'center'
        };

        const buttonConfigs = [
            { text: '🎉 Celebration', x: 100, y: 550, action: () => {
                const character = this.activeCharacter === 'girl' ? this.character : this.ladyCharacter;
                if (!character.getIsMoving()) {
                    character.playCelebration();
                }
            }},
            { text: '😢 Defeat', x: 250, y: 550, action: () => {
                const character = this.activeCharacter === 'girl' ? this.character : this.ladyCharacter;
                if (!character.getIsMoving()) {
                    character.playDefeat();
                }
            }},
            { text: '🔄 Reset', x: 400, y: 550, action: () => {
                const character = this.activeCharacter === 'girl' ? this.character : this.ladyCharacter;
                character.resetCharacter();
            }}
        ];

        buttonConfigs.forEach(config => {
            const button = this.add.container(config.x, config.y);
            
            const background = this.add.rectangle(0, 0, 120, 40, 0x4a4a4a)
                .setInteractive()
                .on('pointerover', () => background.setFillStyle(0x666666))
                .on('pointerout', () => background.setFillStyle(0x4a4a4a))
                .on('pointerdown', config.action);
            
            const text = this.add.text(0, 0, config.text, {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            button.add([background, text]);
            this.buttons.push(button);
        });
    }

    private showSuccessMessage(text: string): void {
        const message = this.add.text(400, 30, text, {
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#008000',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: message,
            alpha: 0,
            y: 0,
            duration: 2000,
            ease: 'Power2.easeOut',
            onComplete: () => message.destroy()
        });
    }

    private showErrorMessage(text: string): void {
        const message = this.add.text(400, 30, text, {
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#FF0000',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: message,
            alpha: 0,
            y: 0,
            duration: 2000,
            ease: 'Power2.easeOut',
            onComplete: () => message.destroy()
        });
    }
}