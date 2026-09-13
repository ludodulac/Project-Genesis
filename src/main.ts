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
import { GuidedFlowScene } from './presentation/GuidedFlowScene';
import { ConflictingFlowScene } from './presentation/ConflictingFlowScene';
import { LivingWatershedScene } from './presentation/LivingWatershedScene';
import { DuelLabScene } from './duel/DuelLabScene';
import { SoloDuelScene } from './duel/SoloDuelScene';

const params = new URLSearchParams(window.location.search);
const game = params.get('game');
const probe = params.get('probe');
const isSoloDuel = game === 'duel-v0';
const isLegacyDuel = game === 'duel-lab-v0';
const isDuel = isSoloDuel || isLegacyDuel;
const duelPortrait = isSoloDuel || (isLegacyDuel && window.innerHeight > window.innerWidth);
const scene = isSoloDuel
  ? SoloDuelScene
  : isLegacyDuel
    ? DuelLabScene
    : game === 'living-watershed'
      ? LivingWatershedScene
      : probe === 'trajectory'
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
                            : probe === 'guided-flow'
                              ? GuidedFlowScene
                              : probe === 'conflicting-flow'
                                ? ConflictingFlowScene
                                : WorldScene;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: isDuel ? (duelPortrait ? 390 : 844) : 390,
  height: isDuel ? (duelPortrait ? 844 : 390) : 760,
  backgroundColor: isDuel ? '#0b1020' : '#dff7ff',
  scene: [scene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: !isSoloDuel,
    pixelArt: isSoloDuel,
  },
});
