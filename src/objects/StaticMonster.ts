import Phaser from 'phaser';

export class StaticMonster extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'chomp_idle', 0);
        
        scene.add.existing(this);
        
        // 设置怪物属性
        this.setScale(2.5);  // 调整缩放比例
        this.setOrigin(0.5, 0.5);  // 中心对齐
        
        // 设置显示层级，确保怪物在角色之上
        this.setDepth(1);
        
        // 播放待机动画
        this.play('chomp_idle');
    }
} 