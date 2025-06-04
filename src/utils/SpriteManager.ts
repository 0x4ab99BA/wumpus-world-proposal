// src/utils/SpriteManager.ts
import Phaser from 'phaser';

export interface SpriteConfig {
    key: string;
    frameWidth: number;
    frameHeight: number;
    startFrame?: number;
    endFrame?: number;
}

export class SpriteManager {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * 预加载精灵图集
     * 您需要将角色图片保存到 public/assets/sprites/ 目录下
     */
    preloadSprites(): void {
        // 加载角色精灵图集 - 每个动作一个图片，包含四行动画（前、左、右、后）
        this.scene.load.spritesheet('girl_idle', 'assets/sprites/girl_idle.png', {
            frameWidth: 64,
            frameHeight: 128
        });

        this.scene.load.spritesheet('girl_walk', 'assets/sprites/girl_walking.png', {
            frameWidth: 64,
            frameHeight: 128
        });

        this.scene.load.spritesheet('girl_run', 'assets/sprites/girl_running.png', {
            frameWidth: 64,
            frameHeight: 128
        });

        // 加载lady精灵图集
        this.scene.load.spritesheet('lady_idle', 'assets/sprites/lady_idle.png', {
            frameWidth: 64,
            frameHeight: 256
        });

        this.scene.load.spritesheet('lady_walk', 'assets/sprites/lady_walking.png', {
            frameWidth: 64,
            frameHeight: 256
        });

        this.scene.load.spritesheet('lady_run', 'assets/sprites/lady_running.png', {
            frameWidth: 64,
            frameHeight: 256
        });

        // 加载怪物精灵图集
        this.scene.load.spritesheet('chomp_idle', 'assets/sprites/chomp_idle.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    /**
     * 创建角色动画
     */
    createAnimations(): void {
        // 创建girl角色动画
        this.createDirectionalAnimations('girl', 'idle', 8);
        this.createDirectionalAnimations('girl', 'walk', 12);
        this.createDirectionalAnimations('girl', 'run', 16);

        // 创建lady角色动画
        this.createDirectionalAnimations('lady', 'idle', 8);
        this.createDirectionalAnimations('lady', 'walk', 12);
        this.createDirectionalAnimations('lady', 'run', 16);

        // 创建怪物动画
        this.createMonsterAnimations();
    }

    /**
     * 为指定角色创建四个方向的动画
     * 每个动作的精灵图包含四行，分别是：正面、左侧、右侧、背面
     */
    private createDirectionalAnimations(character: string, action: string, frameRate: number): void {
        // 正面动画（第一行，0-7帧）
        this.scene.anims.create({
            key: `${character}_${action}_front`,
            frames: this.scene.anims.generateFrameNumbers(`${character}_${action}`, { 
                start: 0, 
                end: 7 
            }),
            frameRate: frameRate,
            repeat: -1
        });

        // 左侧动画（第二行，8-15帧）
        this.scene.anims.create({
            key: `${character}_${action}_left`,
            frames: this.scene.anims.generateFrameNumbers(`${character}_${action}`, { 
                start: 8, 
                end: 15 
            }),
            frameRate: frameRate,
            repeat: -1
        });

        // 右侧动画（第三行，16-23帧）
        this.scene.anims.create({
            key: `${character}_${action}_right`,
            frames: this.scene.anims.generateFrameNumbers(`${character}_${action}`, { 
                start: 16, 
                end: 23 
            }),
            frameRate: frameRate,
            repeat: -1
        });

        // 背面动画（第四行，24-31帧）
        this.scene.anims.create({
            key: `${character}_${action}_back`,
            frames: this.scene.anims.generateFrameNumbers(`${character}_${action}`, { 
                start: 24, 
                end: 31 
            }),
            frameRate: frameRate,
            repeat: -1
        });
    }

    /**
     * 创建怪物动画
     */
    private createMonsterAnimations(): void {
        // 怪物待机动画
        this.scene.anims.create({
            key: 'chomp_idle',
            frames: this.scene.anims.generateFrameNumbers('chomp_idle', { 
                start: 0, 
                end: 7  // 假设有8帧动画
            }),
            frameRate: 8,
            repeat: -1
        });
    }
}