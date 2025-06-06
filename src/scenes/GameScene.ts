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
    wumpusAlive: boolean;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default class GameScene extends Phaser.Scene {
    private gameState: GameState;
    private gridSize: number = 4;
    private cellSize: number = 120;
    private offsetX: number = 160;
    private offsetY: number = 30;

    // UI elements
    private lady!: LadyCharacter;
    private wumpus!: StaticMonster;

    private gridGraphics!: Phaser.GameObjects.Graphics;
    private perceptText!: Phaser.GameObjects.Text;
    private spriteManager!: SpriteManager;
    
    // Grid visualization
    private gridCells: Phaser.GameObjects.Rectangle[][] = [];
    private perceptIcons: Phaser.GameObjects.Text[][] = [];
    private attackIcons: { [key in Direction]?: Phaser.GameObjects.Text } = {};
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
            foundGold: false,
            wumpusAlive: true
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
        
        // 创建攻击图标
        this.createAttackIcons();
        
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
        // 感知信息
        this.perceptText = this.add.text(160, 520, '', {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#FF9800',
            padding: { x: 10, y: 5 }
        });

        // 添加攻击说明
        this.add.text(160, 550, '🗡️ 攻击说明：当感知到恶臭时，点击攻击图标可攻击相邻格子的Wumpus', {
            fontSize: '12px',
            color: '#ffffff',
            backgroundColor: '#2196F3',
            padding: { x: 10, y: 5 }
        });
    }

    private createAttackIcons(): void {
        const directions: Direction[] = ['up', 'down', 'left', 'right'];
        const attackIconStyle = {
            fontSize: '28px',
            backgroundColor: '#FF5722',
            padding: { x: 6, y: 4 }
        };

        directions.forEach(direction => {
            const attackIcon = this.add.text(0, 0, '⚔️', attackIconStyle)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .setVisible(false);

            // 设置攻击图标事件
            attackIcon.on('pointerdown', () => this.handleAttack(direction));

            // 悬停效果
            attackIcon.on('pointerover', () => {
                attackIcon.setStyle({ backgroundColor: '#D32F2F' });
            });
            attackIcon.on('pointerout', () => {
                attackIcon.setStyle({ backgroundColor: '#FF5722' });
            });

            this.attackIcons[direction] = attackIcon;
        });
    }

    private updateAttackIcons(): void {
        if (!this.attackIcons) return;

        const playerScreenPos = this.gridToScreenPosition(this.gameState.playerGridX, this.gameState.playerGridY);
        const iconOffset = 60;

        // 定义每个方向的偏移位置
        const iconPositions: { [key in Direction]: { x: number; y: number } } = {
            up: { x: playerScreenPos.x, y: playerScreenPos.y - iconOffset },
            down: { x: playerScreenPos.x, y: playerScreenPos.y + iconOffset + 30 },
            left: { x: playerScreenPos.x - iconOffset, y: playerScreenPos.y + 15 },
            right: { x: playerScreenPos.x + iconOffset, y: playerScreenPos.y + 15 }
        };

        // 检查是否感知到恶臭（这表示Wumpus在相邻位置）
        const hasStench = this.gameState.wumpusAlive && 
            this.isAdjacent(
                this.gameState.playerGridX, 
                this.gameState.playerGridY, 
                this.gameState.wumpusGridX, 
                this.gameState.wumpusGridY
            );

        // 更新每个方向的攻击图标
        (['up', 'down', 'left', 'right'] as Direction[]).forEach(direction => {
            const icon = this.attackIcons[direction];
            if (!icon) return;

            // 更新图标位置
            icon.setPosition(iconPositions[direction].x, iconPositions[direction].y);

            // 只要感知到恶臭且该方向在边界内，就显示攻击图标
            // 让玩家通过逻辑推理来判断Wumpus的具体位置
            const canShowAttack = hasStench && this.isDirectionInBounds(direction);

            // 显示/隐藏攻击图标
            icon.setVisible(canShowAttack);
        });
    }

    private canAttackDirection(direction: Direction): boolean {
        const { playerGridX, playerGridY } = this.gameState;
        let targetX = playerGridX;
        let targetY = playerGridY;

        switch (direction) {
            case 'up':
                targetY = playerGridY + 1;
                break;
            case 'down':
                targetY = playerGridY - 1;
                break;
            case 'left':
                targetX = playerGridX - 1;
                break;
            case 'right':
                targetX = playerGridX + 1;
                break;
        }

        // 检查目标位置是否在边界内
        if (targetX < 1 || targetX > this.gridSize || targetY < 1 || targetY > this.gridSize) {
            return false;
        }

        // 检查目标位置是否有Wumpus
        return targetX === this.gameState.wumpusGridX && 
               targetY === this.gameState.wumpusGridY && 
               this.gameState.wumpusAlive;
    }

    private isDirectionInBounds(direction: Direction): boolean {
        const { playerGridX, playerGridY } = this.gameState;

        switch (direction) {
            case 'up':
                return playerGridY < this.gridSize;
            case 'down':
                return playerGridY > 1;
            case 'left':
                return playerGridX > 1;
            case 'right':
                return playerGridX < this.gridSize;
        }
    }

    private async handleAttack(direction: Direction): Promise<void> {
        if (this.isMoving || this.gameState.gameOver || this.gameState.foundGold || !this.gameState.wumpusAlive) {
            return;
        }

        this.isMoving = true;

        // 根据攻击方向调整角色朝向
        this.adjustCharacterFacing(direction);

        // 播放攻击动画
        await this.lady.playAttack();

        // 检查攻击是否命中Wumpus
        if (this.canAttackDirection(direction)) {
            // 攻击命中，杀死Wumpus
            this.killWumpus();
            this.showMessage('⚔️ 攻击命中！成功击杀Wumpus！', 0x4CAF50);
        } else {
            // 攻击落空
            this.showMessage(`🎯 ${this.getDirectionName(direction)}方向攻击落空！Wumpus不在那里！`, 0xFF9800);
        }

        this.isMoving = false;
    }

    private adjustCharacterFacing(direction: Direction): void {
        // 根据攻击方向调整角色的朝向
        switch (direction) {
            case 'left':
                this.lady.setFlipX(true); // 朝左
                break;
            case 'right':
                this.lady.setFlipX(false); // 朝右
                break;
            // 上下方向保持当前朝向
        }
    }

    private getDirectionName(direction: Direction): string {
        const directionNames: { [key in Direction]: string } = {
            up: '上',
            down: '下',
            left: '左',
            right: '右'
        };
        return directionNames[direction];
    }

    private killWumpus(): void {
        if (!this.gameState.wumpusAlive) return;

        // 标记Wumpus为死亡
        this.gameState.wumpusAlive = false;

        // 在Wumpus位置显示死亡特效
        const wumpusScreenPos = this.gridToScreenPosition(this.gameState.wumpusGridX, this.gameState.wumpusGridY);
        
        // 显示Wumpus并播放死亡特效
        this.wumpus.setVisible(true);
        this.wumpus.setTint(0x666666); // 变灰表示死亡

        // 创建击杀特效
        const killEffect = this.add.circle(wumpusScreenPos.x, wumpusScreenPos.y, 20, 0xFF0000, 0.8);
        this.tweens.add({
            targets: killEffect,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => killEffect.destroy()
        });

        // 添加击杀文字效果
        const killText = this.add.text(wumpusScreenPos.x, wumpusScreenPos.y - 50, '💀 WUMPUS\n击杀！', {
            fontSize: '20px',
            color: '#FF0000',
            align: 'center',
            fontStyle: 'bold',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                fill: true
            }
        }).setOrigin(0.5);

        // 文字动画效果
        this.tweens.add({
            targets: killText,
            y: wumpusScreenPos.y - 80,
            alpha: 0,
            duration: 2000,
            ease: 'Power2.easeOut',
            onComplete: () => killText.destroy()
        });

        // 显示击杀消息（只在killWumpus内部显示，避免重复）
        // this.showMessage('⚔️ 成功击杀Wumpus！现在可以安全探索了！', 0x4CAF50);

        // 隐藏攻击图标
        this.updateAttackIcons();
        
        // 更新显示
        this.updateDisplay();

        // 延迟后隐藏Wumpus尸体
        this.time.delayedCall(3000, () => {
            this.wumpus.setVisible(false);
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
        this.updateAttackIcons();
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

        // 检查是否遇到Wumpus（只有在Wumpus还活着的时候）
        if (playerGridX === this.gameState.wumpusGridX && 
            playerGridY === this.gameState.wumpusGridY && 
            this.gameState.wumpusAlive) {
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

        // 检查恶臭（相邻房间有活着的Wumpus）
        if (this.gameState.wumpusAlive && 
            this.isAdjacent(playerGridX, playerGridY, this.gameState.wumpusGridX, this.gameState.wumpusGridY)) {
            percepts.push('🤢 恶臭');
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
        
        // 更新感知信息
        if (percepts.length > 0) {
            this.perceptText.setText(`感知: ${percepts.join(', ')}`);
        } else {
            this.perceptText.setText('感知: 无异常');
        }

        // 如果Wumpus已死，显示额外信息
        if (!this.gameState.wumpusAlive) {
            this.perceptText.setText(this.perceptText.text + ' | ⚔️ Wumpus已击杀');
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
                if (percept.includes('恶臭')) iconText += '🤢';
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