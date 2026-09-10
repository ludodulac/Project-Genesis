import Phaser from 'phaser';
import { advanceRisk, bankRisk, initialRiskState, RISK_WINDOWS, type RiskState } from '../experiments/exp032-voluntary-risk';

export class VoluntaryRiskScene extends Phaser.Scene {
  private state: RiskState = initialRiskState();
  private markerX = 78;
  private velocity = 230;
  private targetX = 195;
  private targetWidth = 170;
  private target!: Phaser.GameObjects.Rectangle;
  private marker!: Phaser.GameObjects.Arc;
  private carriedText!: Phaser.GameObjects.Text;
  private bankedText!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private bankButton!: Phaser.GameObjects.Container;
  private locked = false;

  constructor() { super('voluntary-risk'); }

  create() {
    this.cameras.main.setBackgroundColor('#f6efe3');
    this.add.text(195, 92, 'UNE DE PLUS ?', { fontFamily: 'system-ui', fontSize: '30px', fontStyle: 'bold', color: '#24313b' }).setOrigin(0.5);
    this.add.text(195, 132, 'touche quand le point traverse la lumière', { fontFamily: 'system-ui', fontSize: '16px', color: '#53616b' }).setOrigin(0.5);

    this.add.rectangle(195, 310, 300, 22, 0xd8d1c5).setStrokeStyle(2, 0x7b858c);
    this.target = this.add.rectangle(this.targetX, 310, this.targetWidth, 42, 0xffcf57, 0.82).setStrokeStyle(3, 0xffb627);
    this.marker = this.add.circle(this.markerX, 310, 13, 0x253b80).setStrokeStyle(4, 0xffffff);

    this.carriedText = this.add.text(195, 205, '', { fontFamily: 'system-ui', fontSize: '25px', fontStyle: 'bold', color: '#e56b3f' }).setOrigin(0.5);
    this.bankedText = this.add.text(195, 580, '', { fontFamily: 'system-ui', fontSize: '21px', color: '#35524a' }).setOrigin(0.5);
    this.hint = this.add.text(195, 382, '', { fontFamily: 'system-ui', fontSize: '18px', fontStyle: 'bold', color: '#24313b' }).setOrigin(0.5);

    const bankBg = this.add.rectangle(0, 0, 230, 72, 0x5bbf9a).setStrokeStyle(3, 0x35524a).setInteractive({ useHandCursor: true });
    const bankLabel = this.add.text(0, 0, 'METTRE À L’ABRI', { fontFamily: 'system-ui', fontSize: '19px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    this.bankButton = this.add.container(195, 485, [bankBg, bankLabel]);
    bankBg.on('pointerdown', () => this.bank());

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
      if (targets.length || pointer.y > 440) return;
      this.tryStep();
    });
    this.renderState();
  }

  update(_: number, delta: number) {
    if (this.locked || !this.state.alive || this.state.finished) return;
    this.markerX += this.velocity * delta / 1000;
    if (this.markerX >= 333) { this.markerX = 333; this.velocity = -Math.abs(this.velocity); }
    if (this.markerX <= 57) { this.markerX = 57; this.velocity = Math.abs(this.velocity); }
    this.marker.x = this.markerX;
  }

  private tryStep() {
    if (this.locked || !this.state.alive || this.state.finished) return;
    const success = Math.abs(this.markerX - this.targetX) <= this.targetWidth / 2;
    this.state = advanceRisk(this.state, success);
    if (!success) {
      this.locked = true;
      this.hint.setText('PERDU CE QUI ÉTAIT EN MAIN');
      this.cameras.main.shake(140, 0.008);
      this.time.delayedCall(850, () => {
        const kept = this.state.banked;
        this.state = { ...initialRiskState(), banked: kept };
        this.locked = false;
        this.resetChallenge();
        this.renderState();
      });
      return;
    }
    if (this.state.finished) {
      this.state = bankRisk({ ...this.state, finished: false });
      this.hint.setText('TOUT EST À L’ABRI');
      this.time.delayedCall(650, () => {
        this.state = { ...initialRiskState(), banked: this.state.banked };
        this.resetChallenge();
        this.renderState();
      });
      return;
    }
    this.configureChallenge();
    this.hint.setText('');
    this.renderState();
  }

  private bank() {
    if (this.locked || !this.state.alive || this.state.carried === 0) return;
    this.state = bankRisk(this.state);
    this.hint.setText('À L’ABRI');
    this.resetChallenge();
    this.renderState();
    this.time.delayedCall(450, () => this.hint.setText(''));
  }

  private configureChallenge() {
    const ratio = RISK_WINDOWS[Math.min(this.state.step, RISK_WINDOWS.length - 1)];
    this.targetWidth = 250 * ratio;
    this.target.setSize(this.targetWidth, 42).setDisplaySize(this.targetWidth, 42);
    this.velocity = Math.sign(this.velocity || 1) * (230 + this.state.step * 26);
  }

  private resetChallenge() {
    this.markerX = 78;
    this.marker.x = this.markerX;
    this.velocity = 230;
    this.targetWidth = 250 * RISK_WINDOWS[0];
    this.target.setSize(this.targetWidth, 42).setDisplaySize(this.targetWidth, 42);
  }

  private renderState() {
    this.carriedText.setText(this.state.carried > 0 ? `EN MAIN  ${this.state.carried}` : 'EN MAIN  —');
    this.bankedText.setText(`À L’ABRI  ${this.state.banked}`);
    this.bankButton.setAlpha(this.state.carried > 0 ? 1 : 0.35);
  }
}
