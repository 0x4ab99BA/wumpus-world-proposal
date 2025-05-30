import Phaser from 'phaser';

export default class ProposalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ProposalScene' });
    }

    create(): void {
        // 求婚场景 - 后续实现
        this.add.text(400, 300, '💍 Will you marry me? 💍', {
            fontSize: '48px',
            color: '#ff69b4',
            align: 'center'
        }).setOrigin(0.5);
    }
}