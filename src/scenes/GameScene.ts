import Phaser from 'phaser';

interface GameState {
    playerX: number;
    playerY: number;
    wumpusX: number;
    wumpusY: number;
    goldX: number;
    goldY: number;
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
    private playerSprite!: Phaser.GameObjects.Arc;
    private gridGraphics!: Phaser.GameObjects.Graphics;
    private statusText!: Phaser.GameObjects.Text;
    private perceptText!: Phaser.GameObjects.Text;
    private upButton!: Phaser.GameObjects.Text;
    private downButton!: Phaser.GameObjects.Text;
    private leftButton!: Phaser.GameObjects.Text;
    private rightButton!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });
        
        // 初始化游戏状态
        this.gameState = {
            playerX: 1,
            playerY: 1,
            wumpusX: 0,
            wumpusY: 0,
            goldX: 0,
            goldY: 0,
            pits: [],
            gameOver: false,
            foundGold: false
        };
    }

    preload(): void {
        // 创建简单的颜色方块作为精灵
        this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    }

    create(): void {
        this.generateWorld();
        this.createGrid();
        this.createPlayer();
        this.createUI();
        this.updateDisplay();
    }

    private generateWorld(): void {
        // 随机生成Wumpus位置（不能在玩家起始位置）
        do {
            this.gameState.wumpusX = Phaser.Math.Between(1, this.gridSize);
            this.gameState.wumpusY = Phaser.Math.Between(1, this.gridSize);
        } while (this.gameState.wumpusX === 1 && this.gameState.wumpusY === 1);

        // 随机生成金子位置（不能在玩家起始位置或Wumpus位置）
        do {
            this.gameState.goldX = Phaser.Math.Between(1, this.gridSize);
            this.gameState.goldY = Phaser.Math.Between(1, this.gridSize);
        } while ((this.gameState.goldX === 1 && this.gameState.goldY === 1) || 
                 (this.gameState.goldX === this.gameState.wumpusX && this.gameState.goldY === this.gameState.wumpusY));

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
                (pitX === this.gameState.wumpusX && pitY === this.gameState.wumpusY) || // 不在Wumpus位置
                (pitX === this.gameState.goldX && pitY === this.gameState.goldY) || // 不在金子位置
                this.gameState.pits.some(pit => pit.x === pitX && pit.y === pitY) // 不重复
            );
            
            this.gameState.pits.push({ x: pitX, y: pitY });
        }

        console.log('World generated:');
        console.log('Wumpus at:', this.gameState.wumpusX, this.gameState.wumpusY);
        console.log('Gold at:', this.gameState.goldX, this.gameState.goldY);
        console.log('Pits at:', this.gameState.pits);
    }

    private createGrid(): void {
        this.gridGraphics = this.add.graphics();
        this.gridGraphics.lineStyle(2, 0x444444);

        // 绘制网格线
        for (let i = 0; i <= this.gridSize; i++) {
            // 垂直线
            this.gridGraphics.moveTo(this.offsetX + i * this.cellSize, this.offsetY);
            this.gridGraphics.lineTo(this.offsetX + i * this.cellSize, this.offsetY + this.gridSize * this.cellSize);
            
            // 水平线
            this.gridGraphics.moveTo(this.offsetX, this.offsetY + i * this.cellSize);
            this.gridGraphics.lineTo(this.offsetX + this.gridSize * this.cellSize, this.offsetY + i * this.cellSize);
        }
        this.gridGraphics.strokePath();

        // 绘制房间标签
        for (let x = 1; x <= this.gridSize; x++) {
            for (let y = 1; y <= this.gridSize; y++) {
                const screenX = this.offsetX + (x - 1) * this.cellSize + this.cellSize / 2;
                const screenY = this.offsetY + (this.gridSize - y) * this.cellSize + 20;
                
                this.add.text(screenX, screenY, `[${x},${y}]`, {
                    fontSize: '12px',
                    color: '#666666'
                }).setOrigin(0.5);
            }
        }
    }

    private createPlayer(): void {
        const screenPos = this.getScreenPosition(this.gameState.playerX, this.gameState.playerY);
        
        // 创建玩家角色（圆形）
        this.playerSprite = this.add.circle(screenPos.x, screenPos.y, 20, 0x4CAF50);
        this.add.text(screenPos.x, screenPos.y, '😊', {
            fontSize: '24px'
        }).setOrigin(0.5);
    }

    private createUI(): void {
        // 标题
        this.add.text(400, 30, '💕 Wumpus World Adventure 💕', {
            fontSize: '24px',
            color: '#E91E63'
        }).setOrigin(0.5);

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

        // 控制按钮
        this.createControlButtons();

        // 游戏说明
        this.add.text(600, 520, '目标：找到金子 🏆\n避免：陷阱 🕳️ 和 Wumpus 👹', {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#9C27B0',
            padding: { x: 10, y: 5 }
        });
    }

    private createControlButtons(): void {
        const buttonStyle = {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 15, y: 10 }
        };

        // 上方向键
        this.upButton = this.add.text(400, 520, '⬆️ 北', buttonStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.movePlayer(0, 1))
            .on('pointerover', () => this.upButton.setStyle({ backgroundColor: '#66BB6A' }))
            .on('pointerout', () => this.upButton.setStyle({ backgroundColor: '#4CAF50' }));

        // 下方向键
        this.downButton = this.add.text(400, 570, '⬇️ 南', buttonStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.movePlayer(0, -1))
            .on('pointerover', () => this.downButton.setStyle({ backgroundColor: '#66BB6A' }))
            .on('pointerout', () => this.downButton.setStyle({ backgroundColor: '#4CAF50' }));

        // 左方向键
        this.leftButton = this.add.text(330, 545, '⬅️ 西', buttonStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.movePlayer(-1, 0))
            .on('pointerover', () => this.leftButton.setStyle({ backgroundColor: '#66BB6A' }))
            .on('pointerout', () => this.leftButton.setStyle({ backgroundColor: '#4CAF50' }));

        // 右方向键
        this.rightButton = this.add.text(470, 545, '➡️ 东', buttonStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.movePlayer(1, 0))
            .on('pointerover', () => this.rightButton.setStyle({ backgroundColor: '#66BB6A' }))
            .on('pointerout', () => this.rightButton.setStyle({ backgroundColor: '#4CAF50' }));
    }

    private movePlayer(deltaX: number, deltaY: number): void {
        if (this.gameState.gameOver || this.gameState.foundGold) return;

        const newX = this.gameState.playerX + deltaX;
        const newY = this.gameState.playerY + deltaY;

        // 检查边界
        if (newX < 1 || newX > this.gridSize || newY < 1 || newY > this.gridSize) {
            this.showMessage('不能移出世界边界！', 0xFF5722);
            return;
        }

        // 更新玩家位置
        this.gameState.playerX = newX;
        this.gameState.playerY = newY;

        // 移动玩家精灵
        const screenPos = this.getScreenPosition(newX, newY);
        this.tweens.add({
            targets: this.playerSprite,
            x: screenPos.x,
            y: screenPos.y,
            duration: 300,
            ease: 'Power2'
        });

        // 检查游戏状态
        this.checkGameState();
        this.updateDisplay();
    }

    private checkGameState(): void {
        const { playerX, playerY } = this.gameState;

        // 检查是否找到金子
        if (playerX === this.gameState.goldX && playerY === this.gameState.goldY) {
            this.gameState.foundGold = true;
            this.showGoldFoundEffect();
            this.time.delayedCall(2000, () => {
                this.scene.start('ProposalScene');
            });
            return;
        }

        // 检查是否遇到Wumpus
        if (playerX === this.gameState.wumpusX && playerY === this.gameState.wumpusY) {
            this.gameState.gameOver = true;
            this.showMessage('💀 被Wumpus吃掉了！游戏结束！', 0xF44336);
            this.showGameOverEffect();
            return;
        }

        // 检查是否掉入陷阱
        const hitPit = this.gameState.pits.find(pit => pit.x === playerX && pit.y === playerY);
        if (hitPit) {
            this.gameState.gameOver = true;
            this.showMessage('🕳️ 掉入陷阱！游戏结束！', 0xF44336);
            this.showGameOverEffect();
            return;
        }
    }

    private getPercepts(): string[] {
        const percepts: string[] = [];
        const { playerX, playerY } = this.gameState;

        // 检查微风（相邻房间有陷阱）
        let hasBreeze = false;
        for (const pit of this.gameState.pits) {
            if (this.isAdjacent(playerX, playerY, pit.x, pit.y)) {
                hasBreeze = true;
                break;
            }
        }
        if (hasBreeze) percepts.push('💨 微风');

        // 检查恶臭（相邻房间有Wumpus）
        if (this.isAdjacent(playerX, playerY, this.gameState.wumpusX, this.gameState.wumpusY)) {
            percepts.push('🦨 恶臭');
        }

        // 检查闪光（当前房间有金子）
        if (playerX === this.gameState.goldX && playerY === this.gameState.goldY) {
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
        // 更新状态文本
        this.statusText.setText(`位置: [${this.gameState.playerX}, ${this.gameState.playerY}]`);

        // 更新感知信息
        const percepts = this.getPercepts();
        if (percepts.length > 0) {
            this.perceptText.setText(`感知: ${percepts.join(', ')}`);
        } else {
            this.perceptText.setText('感知: 无异常');
        }
    }

    private getScreenPosition(gridX: number, gridY: number): { x: number; y: number } {
        return {
            x: this.offsetX + (gridX - 1) * this.cellSize + this.cellSize / 2,
            y: this.offsetY + (this.gridSize - gridY) * this.cellSize + this.cellSize / 2
        };
    }

    private showMessage(text: string, color: number): void {
        const message = this.add.text(400, 300, text, {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: `#${color.toString(16)}`,
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
        const screenPos = this.getScreenPosition(this.gameState.goldX, this.gameState.goldY);
        
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