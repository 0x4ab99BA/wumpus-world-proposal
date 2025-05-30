import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import ProposalScene from './scenes/ProposalScene';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    scene: [GameScene, ProposalScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    }
};

export const game = new Phaser.Game(config);
