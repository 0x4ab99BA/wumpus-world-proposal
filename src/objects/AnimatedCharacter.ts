// src/objects/AnimatedCharacter.ts
import Phaser from 'phaser';

export class AnimatedCharacter extends Phaser.GameObjects.Sprite {
    private currentState: string = 'idle';
    private currentDirection: 'front' | 'back' | 'left' | 'right' = 'front';
    private isMoving: boolean = false;
    private moveSpeed: number = 200;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'girl_idle_front', 0);
        
        scene.add.existing(this);
        
        // 设置角色属性
        this.setScale(0.75);
        this.setOrigin(0.5, 1);
        
        // 开始播放待机动画
        this.playAnimation('idle', 'front');
    }

    /**
     * 播放指定动画
     */
    public playAnimation(action: string, direction: 'front' | 'back' | 'left' | 'right'): void {
        if (this.currentState !== action || this.currentDirection !== direction) {
            this.currentState = action;
            this.currentDirection = direction;
            
            // 直接使用对应方向的动画，不需要翻转
            const animationKey = `girl_${action}_${direction}`;
            this.setFlipX(false); // 不再需要翻转，因为每个方向都有独立的动画
            this.play(animationKey);
        }
    }

    /**
     * 移动到指定位置（带动画）
     */
    public moveToPosition(targetX: number, targetY: number, useRunning: boolean = false): Promise<void> {
        return new Promise((resolve) => {
            if (this.isMoving) {
                resolve();
                return;
            }

            this.isMoving = true;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
            const duration = (distance / this.moveSpeed) * 1000;

            // 计算移动方向
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const angle = Math.atan2(dy, dx);
            const direction = this.getDirectionFromAngle(angle);

            // 根据移动距离选择动画
            const action = useRunning || distance > 100 ? 'run' : 'walk';
            this.playAnimation(action, direction);

            // 创建移动补间动画
            this.scene.tweens.add({
                targets: this,
                x: targetX,
                y: targetY,
                duration: duration,
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    this.isMoving = false;
                    this.playAnimation('idle', direction);
                    resolve();
                }
            });
        });
    }

    /**
     * 根据角度获取方向
     */
    private getDirectionFromAngle(angle: number): 'front' | 'back' | 'left' | 'right' {
        // 将角度转换为0-360度
        const degrees = (angle * 180 / Math.PI + 360) % 360;
        
        // 根据角度范围确定方向
        if (degrees >= 225 && degrees < 315) {
            return 'back';    // 上 - 显示背面
        } else if (degrees >= 135 && degrees < 225) {
            return 'left';    // 左
        } else if (degrees >= 45 && degrees < 135) {
            return 'front';   // 下 - 显示正面
        } else {
            return 'right';   // 右
        }
    }

    /**
     * 播放庆祝动画
     */
    public playCelebration(): void {
        // 播放跳跃庆祝动画
        this.playAnimation('run', this.currentDirection); // 使用跑步动画作为兴奋状态
        
        this.scene.tweens.add({
            targets: this,
            scaleX: { from: 0.75, to: 0.9 },
            scaleY: { from: 0.75, to: 0.9 },
            rotation: 0.1,
            duration: 300,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.setRotation(0);
                this.setScale(0.75);
                this.playAnimation('idle', this.currentDirection);
            }
        });
    }

    /**
     * 播放失败动画
     */
    public playDefeat(): void {
        this.playAnimation('idle', this.currentDirection);
        
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.3 },
            scaleX: { from: 0.75, to: 0.6 },
            scaleY: { from: 0.75, to: 0.6 },
            rotation: 0.2,
            duration: 1000,
            ease: 'Power2.easeOut'
        });
    }

    /**
     * 重置角色状态
     */
    public resetCharacter(): void {
        this.setAlpha(1);
        this.setScale(0.75);
        this.setRotation(0);
        this.setFlipX(false);
        this.isMoving = false;
        this.playAnimation('idle', this.currentDirection);
    }

    /**
     * 设置角色朝向
     */
    public setDirection(direction: 'left' | 'right' | 'up' | 'down'): void {
        // 修改方向映射逻辑
        const newDirection = direction === 'up' ? 'back' :    // 向上移动时显示背面
                           direction === 'down' ? 'front' :   // 向下移动时显示正面
                           direction === 'left' ? 'left' : 'right';
        
        this.playAnimation(this.currentState, newDirection);
    }

    /**
     * 检查是否正在移动
     */
    public getIsMoving(): boolean {
        return this.isMoving;
    }
}