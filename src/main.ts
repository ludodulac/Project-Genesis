import Phaser from 'phaser';
import './style.css';
import { WorldScene } from './presentation/WorldScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 390,
  height: 760,
  backgroundColor: '#dff7ff',
  scene: [WorldScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
  },
});
