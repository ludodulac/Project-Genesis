import Phaser from 'phaser';
import './style.css';
import { WorldScene } from './presentation/WorldScene';
import { TrajectoryScene } from './presentation/TrajectoryScene';

const probe = new URLSearchParams(window.location.search).get('probe');
const scene = probe === 'trajectory' ? TrajectoryScene : WorldScene;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 390,
  height: 760,
  backgroundColor: '#dff7ff',
  scene: [scene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
  },
});
