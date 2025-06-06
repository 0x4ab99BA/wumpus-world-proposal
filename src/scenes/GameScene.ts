import Phaser from 'phaser';
import { LadyCharacter } from '../objects/LadyCharacter';
import { StaticMonster } from '../objects/StaticMonster';
import { SpriteManager } from '../utils/SpriteManager';

interface GameState {
    playerGridX: number;
    playerGridY: number;
    wumpusGridX: number;
    wumpusGridY: number;
    goldGridX: number;
    goldGridY: number;
    pits: { x: number; y: number }[];
    gameOver: boolean;
    foundGold: boolean;
}

export default class GameScene extends Phaser.Scene {
    private gameState: GameState;
    private gridSize: number = 4;
    private cellSize: number = 120;
    private offsetX: number = 160;
    private offsetY: number = 80;

    // UI elements
    private lady!: LadyCharacter;
    private wumpus!: StaticMonster;

    private gridGraphics!: Phaser.GameObjects.Graphics;
    private statusText!: Phaser.GameObjects.Text;
    private perceptText!: Phaser.GameObjects.Text;
    private spriteManager!: SpriteManager;
    
    // Grid visualization
    private gridCells: Phaser.GameObjects.Rectangle[][] = [];
    private perceptIcons: Phaser.GameObjects.Text[][] = [];
    private isMoving: boolean = false;

    constructor() {
        super({ key: 'GameScene' });
        
        // 初始化游戏状态
        this.gameState = {
            playerGridX: 1,
            playerGridY: 1,
            wumpusGridX: 0,
            wumpusGridY: 0,
            goldGridX: 0,
            goldGridY: 0,
            pits: [],
            gameOver: false,
            foundGold: false
        };
    }

    preload(): void {
        // 加载精灵管理器
        this.spriteManager = new SpriteManager(this);
        this.spriteManager.preloadSprites();
    }

    create(): void {
        // 创建动画
        this.spriteManager.createAnimations();
        
        // 生成游戏世界
        this.generateWorld();
        
        // 创建网格
        this.createGrid();
        
        // 创建角色
        this.createPlayer();
        
        // 创建 Wumpus
        this.createWumpus();
        
        // 创建UI
        this.createUI();
        
        // 设置鼠标点击事件
        this.setupMouseInput();
        
        // 更新显示
        this.updateDisplay();
    }

    private generateWorld(): void {
        // 随机生成Wumpus位置（不能在玩家起始位置）
        do {
            this.gameState.wumpusGridX = Phaser.Math.Between(1, this.gridSize);
            this.gameState.wumpusGridY = Phaser.Math.Between(1, this.gridSize);
        } while (this.gameState.wumpusGridX === 1 && this.gameState.wumpusGridY === 1);

        // 随机生成金子位置（不能在玩家起始位置或Wumpus位置）
        do {
            this.gameState.goldGridX = Phaser.Math.Between(1, this.gridSize);
            this.gameState.goldGridY = Phaser.Math.Between(1, this.gridSize);
        } while ((this.gameState.goldGridX === 1 && this.gameState.goldGridY === 1) || 
                 (this.gameState.goldGridX === this.gameState.wumpusGridX && this.gameState.goldGridY === this.gameState.wumpusGridY));

        // 生成2-3个陷阱
        const numPits = Phaser.Math.Between(2, 3);
        this.gameState.pits = [];
        
        for (let i = 0; i < numPits; i++) {
            let pitX: number, pitY: number;
            do {
                pitX = Phaser.Math.Between(1, this.gridSize);
                pitY = Phaser.Math.Between(1, this.gridSize);
            } while (
                (pitX === 1 && pitY === 1) || // 不在起始位置
                (pitX === this.gameState.wumpusGridX && pitY === this.gameState.wumpusGridY) || // 不在Wumpus位置
                (pitX === this.gameState.goldGridX && pitY === this.gameState.goldGridY) || // 不在金子位置
                this.gameState.pits.some(pit => pit.x === pitX && pit.y === pitY) // 不重复
            );
            
            this.gameState.pits.push({ x: pitX, y: pitY });
        }

        console.log('World generated:');
        console.log('Wumpus at:', this.gameState.wumpusGridX, this.gameState.wumpusGridY);
        console.log('Gold at:', this.gameState.goldGridX, this.gameState.goldGridY);
        console.log('Pits at:', this.gameState.pits);
    }

    private createGrid(): void {
        this.gridGraphics = this.add.graphics();
        this.gridCells = [];
        this.perceptIcons = [];
        
        // 创建网格背景和交互区域
        for (let x = 1; x <= this.gridSize; x++) {
            this.gridCells[x] = [];
            this.perceptIcons[x] = [];
            for (let y = 1; y <= this.gridSize; y++) {
                const screenPos = this.gridToScreenPosition(x, y);
                
                // 创建可交互的格子
                const cell = this.add.rectangle(
                    screenPos.x, 
                    screenPos.y, 
                    this.cellSize - 4, 
                    this.cellSize - 4, 
                    0x333333, 
                    0.3
                );
                cell.setInteractive();
                cell.setStrokeStyle(2, 0x666666);
                
                // 格子悬停效果
                cell.on('pointerover', () => {
                    if (!this.isMoving && this.canMoveTo(x, y)) {
                        cell.setFillStyle(0x4CAF50, 0.5);
                    } else if (!this.isMoving) {
                        cell.setFillStyle(0xF44336, 0.3);
                    }
                });
                
                cell.on('pointerout', () => {
                    cell.setFillStyle(0x333333, 0.3);
                });
                
                // 格子点击事件
                cell.on('pointerdown', () => {
                    this.handleGridClick(x, y);
                });
                
                this.gridCells[x][y] = cell;
                
                // 添加格子坐标标签
                this.add.text(screenPos.x, screenPos.y + 40, `[${x},${y}]`, {
                    fontSize: '12px',
                    color: '#888888'
                }).setOrigin(0.5);

                // 创建感知图标（初始隐藏）
                const perceptIcon = this.add.text(screenPos.x, screenPos.y - 45, '', {
                    fontSize: '24px'
                }).setOrigin(0.5).setVisible(false);
                
                this.perceptIcons[x][y] = perceptIcon;
            }
        }

        // 绘制网格线
        this.gridGraphics.lineStyle(2, 0x444444);
        for (let i = 0; i <= this.gridSize; i++) {
            // 垂直线
            this.gridGraphics.moveTo(this.offsetX + i * this.cellSize, this.offsetY);
            this.gridGraphics.lineTo(this.offsetX + i * this.cellSize, this.offsetY + this.gridSize * this.cellSize);
            
            // 水平线
            this.gridGraphics.moveTo(this.offsetX, this.offsetY + i * this.cellSize);
            this.gridGraphics.lineTo(this.offsetX + this.gridSize * this.cellSize, this.offsetY + i * this.cellSize);
        }
        this.gridGraphics.strokePath();
    }

    private createPlayer(): void {
        const screenPos = this.gridToScreenPosition(this.gameState.playerGridX, this.gameState.playerGridY);
        
        // 创建LadyCharacter角色
        this.lady = new LadyCharacter(this, screenPos.x, screenPos.y + 30);
        this.add.existing(this.lady);
        
        // 设置角色在格子中心
        this.lady.setDepth(10);
    }

    private createWumpus(): void {
        const screenPos = this.gridToScreenPosition(this.gameState.wumpusGridX, this.gameState.wumpusGridY);
        
        // 创建 Wumpus 怪物
        this.wumpus = new StaticMonster(this, screenPos.x, screenPos.y);
        this.add.existing(this.wumpus);
        
        // 初始时隐藏 Wumpus
        this.wumpus.setVisible(false);
    }

    private createUI(): void {

        // 状态文本
        this.statusText = this.add.text(50, 520, '', {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#2196F3',
            padding: { x: 10, y: 5 }
        });

        // 感知信息
        this.perceptText = this.add.text(50, 550, '', {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#FF9800',
            padding: { x: 10, y: 5 }
        });
    }

    private setupMouseInput(): void {
        // 鼠标输入已在createGrid中处理
        // 这里可以添加其他输入处理逻辑
    }

    private handleGridClick(targetX: number, targetY: number): void {
        if (this.isMoving || this.gameState.gameOver || this.gameState.foundGold) {
            return;
        }

        // 检查是否可以移动到目标位置
        if (!this.canMoveTo(targetX, targetY)) {
            this.showMessage('只能移动到相邻的格子！', 0xFF5722);
            return;
        }

        // 开始移动
        this.movePlayerTo(targetX, targetY);
    }

    private canMoveTo(targetX: number, targetY: number): boolean {
        const currentX = this.gameState.playerGridX;
        const currentY = this.gameState.playerGridY;
        
        // 检查是否在边界内
        if (targetX < 1 || targetX > this.gridSize || targetY < 1 || targetY > this.gridSize) {
            return false;
        }
        
        // 检查是否是相邻格子（只能上下左右移动一格）
        const deltaX = Math.abs(targetX - currentX);
        const deltaY = Math.abs(targetY - currentY);
        
        return (deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1);
    }

    private async movePlayerTo(targetX: number, targetY: number): Promise<void> {
        this.isMoving = true;
        
        // 更新游戏状态
        this.gameState.playerGridX = targetX;
        this.gameState.playerGridY = targetY;
        
        // 计算目标屏幕位置
        const targetScreenPos = this.gridToScreenPosition(targetX, targetY);
        
        // 移动角色到目标位置
        await this.lady.moveToPosition(targetScreenPos.x, targetScreenPos.y + 30);
        
        this.isMoving = false;
        
        // 检查游戏状态
        this.checkGameState();
        this.updateDisplay();
    }

    private checkGameState(): void {
        const { playerGridX, playerGridY } = this.gameState;

        // 检查是否找到金子
        if (playerGridX === this.gameState.goldGridX && playerGridY === this.gameState.goldGridY) {
            this.gameState.foundGold = true;
            this.showGoldFoundEffect();
            this.time.delayedCall(2000, () => {
                this.scene.start('ProposalScene');
            });
            return;
        }

        // 检查是否遇到Wumpus
        if (playerGridX === this.gameState.wumpusGridX && playerGridY === this.gameState.wumpusGridY) {
            this.gameState.gameOver = true;
            this.showMessage('💀 被Wumpus吃掉了！游戏结束！', 0xF44336);
            this.lady.playDead();
            // 显示 Wumpus
            const screenPos = this.gridToScreenPosition(playerGridX, playerGridY);
            this.wumpus.setPosition(screenPos.x, screenPos.y);
            this.wumpus.setVisible(true);
            this.showGameOverEffect();
            return;
        }

        // 检查是否掉入陷阱
        const hitPit = this.gameState.pits.find(pit => pit.x === playerGridX && pit.y === playerGridY);
        if (hitPit) {
            this.gameState.gameOver = true;
            this.showMessage('🕳️ 掉入陷阱！游戏结束！', 0xF44336);
            this.lady.playDead();
            this.showGameOverEffect();
            return;
        }
    }

    private getPercepts(): string[] {
        const percepts: string[] = [];
        const { playerGridX, playerGridY } = this.gameState;

        // 检查微风（相邻房间有陷阱）
        let hasBreeze = false;
        for (const pit of this.gameState.pits) {
            if (this.isAdjacent(playerGridX, playerGridY, pit.x, pit.y)) {
                hasBreeze = true;
                break;
            }
        }
        if (hasBreeze) percepts.push('💨 微风');

        // 检查恶臭（相邻房间有Wumpus）
        if (this.isAdjacent(playerGridX, playerGridY, this.gameState.wumpusGridX, this.gameState.wumpusGridY)) {
            percepts.push('🦨 恶臭');
        }

        // 检查闪光（当前房间有金子）
        if (playerGridX === this.gameState.goldGridX && playerGridY === this.gameState.goldGridY) {
            percepts.push('✨ 闪光');
        }

        return percepts;
    }

    private isAdjacent(x1: number, y1: number, x2: number, y2: number): boolean {
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    private updateDisplay(): void {
        // 隐藏所有感知图标
        this.hideAllPerceptIcons();
        
        // 获取当前感知信息
        const percepts = this.getPercepts();
        
        // 在当前格子显示感知图标
        if (percepts.length > 0) {
            this.showPerceptIcon(this.gameState.playerGridX, this.gameState.playerGridY, percepts);
        }
        
        // 更新状态文本
        this.statusText.setText(`位置: [${this.gameState.playerGridX}, ${this.gameState.playerGridY}]`);

        // 更新感知信息
        if (percepts.length > 0) {
            this.perceptText.setText(`感知: ${percepts.join(', ')}`);
        } else {
            this.perceptText.setText('感知: 无异常');
        }
    }

    private hideAllPerceptIcons(): void {
        for (let x = 1; x <= this.gridSize; x++) {
            for (let y = 1; y <= this.gridSize; y++) {
                if (this.perceptIcons[x] && this.perceptIcons[x][y]) {
                    this.perceptIcons[x][y].setVisible(false);
                }
            }
        }
    }

    private showPerceptIcon(gridX: number, gridY: number, percepts: string[]): void {
        if (this.perceptIcons[gridX] && this.perceptIcons[gridX][gridY]) {
            const icon = this.perceptIcons[gridX][gridY];
            
            // 组合所有感知图标
            let iconText = '';
            for (const percept of percepts) {
                if (percept.includes('微风')) iconText += '💨';
                if (percept.includes('恶臭')) iconText += '🤢'; // 使用恶心表情作为恶臭图标
                if (percept.includes('闪光')) iconText += '✨';
            }
            
            icon.setText(iconText);
            icon.setVisible(true);
            
            // 添加闪烁动画
            this.tweens.add({
                targets: icon,
                alpha: { from: 0.6, to: 1 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    private gridToScreenPosition(gridX: number, gridY: number): { x: number; y: number } {
        return {
            x: this.offsetX + (gridX - 1) * this.cellSize + this.cellSize / 2,
            y: this.offsetY + (this.gridSize - gridY) * this.cellSize + this.cellSize / 2
        };
    }

    private showMessage(text: string, color: number): void {
        const message = this.add.text(400, 300, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: `#${color.toString(16).padStart(6, '0')}`,
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 3000,
            onComplete: () => message.destroy()
        });
    }

    private showGoldFoundEffect(): void {
        // 在金子位置显示特效
        const screenPos = this.gridToScreenPosition(this.gameState.goldGridX, this.gameState.goldGridY);
        
        // 创建金光特效
        const goldEffect = this.add.circle(screenPos.x, screenPos.y, 30, 0xFFD700);
        this.add.text(screenPos.x, screenPos.y, '🏆', {
            fontSize: '32px'
        }).setOrigin(0.5);

        // 放大动画
        this.tweens.add({
            targets: goldEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 1500,
            ease: 'Power2'
        });

        // 显示祝贺消息
        this.showMessage('🎉 找到金子了！准备好接受惊喜吧... 💕', 0xFFD700);
    }

    private showGameOverEffect(): void {
        // 创建游戏结束遮罩
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        const restartText = this.add.text(400, 350, '点击重新开始', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        restartText.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}