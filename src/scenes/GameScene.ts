import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        // 这里后续加载游戏资源
    }

    create(): void {
        // 临时显示文本，确保环境搭建成功
        this.add.text(400, 300, 'Wumpus World\n游戏开发中...', {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
    }

    update(): void {
        // 游戏主循环
    }
}