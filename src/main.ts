// import Phaser from 'phaser';
// import GameScene from './scenes/GameScene';
// import ProposalScene from './scenes/ProposalScene';
// import './style.css';

// const config: Phaser.Types.Core.GameConfig = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     parent: 'game-container',
//     backgroundColor: '#2c3e50',
//     scene: [GameScene, ProposalScene],
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { x: 0, y: 0 },
//             debug: false
//         }
//     },
//     scale: {
//         mode: Phaser.Scale.FIT,
//         autoCenter: Phaser.Scale.CENTER_BOTH,
//         min: {
//             width: 400,
//             height: 300
//         },
//         max: {
//             width: 1200,
//             height: 900
//         }
//     }
// };

// // 创建游戏实例
// export const game = new Phaser.Game(config);

// // 添加全局错误处理
// window.addEventListener('error', (e) => {
//     console.error('Game Error:', e.error);
// });

// // 游戏加载完成提示
// game.events.on('ready', () => {
//     console.log('🎮 Wumpus World Marriage Proposal Game Ready!');
//     console.log('💕 Good luck finding the gold and love!');
// });


import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import ProposalScene from './scenes/ProposalScene';
import TestScene from './scenes/TestScene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#f8f8f8',
    scene: [TestScene, GameScene, ProposalScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    }
};

const game = new Phaser.Game(config);

// 游戏加载完成提示
game.events.on('ready', () => {
    console.log('🎮 Test Scene Ready!');
    // 确保启动测试场景
    game.scene.start('TestScene');
});
