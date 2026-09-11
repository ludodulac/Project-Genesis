import Phaser from 'phaser';
import './style.css';
import { WorldScene } from './presentation/WorldScene';
import { TrajectoryScene } from './presentation/TrajectoryScene';
import { TensionScene } from './presentation/TensionScene';
import { CascadeScene } from './presentation/CascadeScene';
import { ThresholdScene } from './presentation/ThresholdScene';
import { TransferScene } from './presentation/TransferScene';
import { DiscoveryScene } from './presentation/DiscoveryScene';
import { GlobalPressureScene } from './presentation/GlobalPressureScene';
import { VoluntaryRiskScene } from './presentation/VoluntaryRiskScene';
import { PersistentJourneyScene } from './presentation/PersistentJourneyScene';
import { GrowingReachScene } from './presentation/GrowingReachScene';
import { SelfAuthoredArtifactScene } from './presentation/SelfAuthoredArtifactScene';

const probe = new URLSearchParams(window.location.search).get('probe');
const scene = probe === 'trajectory'
  ? TrajectoryScene
  : probe === 'tension'
    ? TensionScene
    : probe === 'cascade'
      ? CascadeScene
      : probe === 'threshold'
        ? ThresholdScene
        : probe === 'transfer'
          ? TransferScene
          : probe === 'discovery'
            ? DiscoveryScene
            : probe === 'global-pressure'
              ? GlobalPressureScene
              : probe === 'voluntary-risk'
                ? VoluntaryRiskScene
                : probe === 'persistent-journey'
                  ? PersistentJourneyScene
                  : probe === 'growing-reach'
                    ? GrowingReachScene
                    : probe === 'self-authored-artifact'
                      ? SelfAuthoredArtifactScene
                      : WorldScene;

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
