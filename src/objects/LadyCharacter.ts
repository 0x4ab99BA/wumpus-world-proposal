import Phaser from 'phaser';

export class LadyCharacter extends Phaser.GameObjects.Sprite {
    public currentState: string = 'idle';
    private isMoving: boolean = false;
    private isAttacking: boolean = false;
    private isDead: boolean = false;
    private moveSpeed: number = 200;
    private facingRight: boolean = true;
    private isJumping: boolean = false;
    private lastClickX: number = 0;  // 记录最后一次点击的X坐标

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'lady_idle', 0);
        
        scene.add.existing(this);
        
        // 设置角色属性
        this.setScale(0.75);
        this.setOrigin(0.5, 1);
        
        // 初始化最后点击位置为角色当前位置
        this.lastClickX = x;
        
        // 开始播放待机动画
        this.playAnimation('idle');

        // 添加鼠标点击监听
        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.lastClickX = pointer.worldX;
                // 只有在待机状态且没有其他动作时才更新朝向
                if (this.currentState === 'idle' && !this.isMoving && !this.isAttacking && !this.isJumping) {
                    this.updateFacingDirection(this.lastClickX);
                }
            }
        });
    }

    /**
     * 根据目标位置更新朝向
     */
    private updateFacingDirection(targetX: number): void {
        const shouldFaceRight = targetX > this.x;
        if (this.facingRight !== shouldFaceRight) {
            this.facingRight = shouldFaceRight;
            this.setFlipX(!shouldFaceRight);
        }
    }

    /**
     * 播放指定动画
     */
    public playAnimation(action: string): void {
        if (this.currentState !== action) {
            this.currentState = action;
            const animationKey = `lady_${action}`;
            
            // 设置动画不重复播放，除了idle动画
            if (action === 'idle') {
                this.play(animationKey, true);  // true 表示循环播放
            } else {
                this.play(animationKey, false);  // false 表示不循环播放
            }
        }
    }

    /**
     * 执行攻击动作
     */
    public playAttack(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isMoving || this.isJumping || this.isAttacking || this.isDead) {
                resolve();
                return;
            }

            this.isAttacking = true;
            this.playAnimation('attack');

            // 监听动画完成事件
            this.once('animationcomplete', () => {
                this.isAttacking = false;
                this.playAnimation('idle');
                resolve();
            });
        });
    }

    /**
     * 播放死亡动画
     */
    public playDead(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isMoving || this.isJumping || this.isAttacking || this.isDead) {
                resolve();
                return;
            }

            this.isDead = true;
            this.playAnimation('dead');

            // 监听动画完成事件
            this.once('animationcomplete', () => {
                // 死亡动画播放完后保持在最后一帧
                this.stop();
                resolve();
            });
        });
    }

    /**
     * 播放失败动画
     */
    public playDefeat(): void {
        if (this.isMoving || this.isJumping || this.isAttacking) return;
        
        this.playDead();  // 播放死亡动画
        
        // 添加淡出效果
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.3 },
            duration: 1000,
            ease: 'Power2.easeOut'
        });
    }

    /**
     * 执行跳跃动作
     */
    public performJump(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isMoving || this.isAttacking || this.isDead) {
                resolve();
                return;
            }

            this.isJumping = true;
            const startY = this.y;
            const jumpHeight = 50; // 跳跃高度

            // 创建跳跃动画
            this.scene.tweens.add({
                targets: this,
                y: startY - jumpHeight,
                duration: 500,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    // 播放跳跃动画
                    this.playAnimation('jump');
                    
                    // 创建下落动画
                    this.scene.tweens.add({
                        targets: this,
                        y: startY,
                        duration: 500,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            this.isJumping = false;
                            this.playAnimation('idle');
                            resolve();
                        }
                    });
                }
            });
        });
    }

    /**
     * 移动到指定位置（带动画）
     */
    public moveToPosition(targetX: number, targetY: number, useRunning: boolean = false): Promise<void> {
        return new Promise((resolve) => {
            if (this.isMoving || this.isJumping || this.isAttacking || this.isDead) {
                resolve();
                return;
            }

            this.isMoving = true;
            this.lastClickX = targetX;  // 更新最后点击位置
            const distance = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
            const duration = (distance / this.moveSpeed) * 1000;

            // 计算移动方向并处理水平翻转
            this.updateFacingDirection(targetX);

            // 根据移动距离选择动画
            const action = useRunning ? 'run' : 'walk';
            this.playAnimation(action);

            // 创建移动补间动画
            this.scene.tweens.add({
                targets: this,
                x: targetX,
                y: targetY,
                duration: duration,
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    this.isMoving = false;
                    this.playAnimation('idle');
                    resolve();
                }
            });
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
        this.facingRight = true;
        this.isMoving = false;
        this.isJumping = false;
        this.isAttacking = false;
        this.isDead = false;
        this.lastClickX = this.x;  // 重置最后点击位置为当前位置
        this.playAnimation('idle');
    }

    /**
     * 检查是否正在移动
     */
    public getIsMoving(): boolean {
        return this.isMoving || this.isJumping || this.isAttacking;
    }

} 