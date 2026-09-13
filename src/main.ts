import Phaser from 'phaser';
import './style.css';
import { renderGameHub } from './games/renderGameHub';
import { SoloDuelScene } from './duel/SoloDuelScene';

const params = new URLSearchParams(window.location.search);
const game = params.get('game');
const root = document.querySelector<HTMLElement>('#app');

if (!root) throw new Error('Missing #app root');

if (!game) {
  renderGameHub(root);
} else if (game === 'duel-v0') {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'app',
    width: 390,
    height: 844,
    backgroundColor: '#0b1020',
    scene: [SoloDuelScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: false,
      pixelArt: true,
    },
  });
} else {
  history.replaceState(null, '', window.location.pathname);
  renderGameHub(root);
}
