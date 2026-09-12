import Phaser from 'phaser';
import { createWatershedState, getWatershedCell, playWatershedTurn, previewPulseStep, type WatershedState } from '../game/living-watershed';

const CELL=42, HEIGHT_PX=10, ORIGIN_X=48, ORIGIN_Y=205;
const GROUND=[0x77d79d,0x71d2a0,0x83dda4,0x74d5aa];
type Point={x:number;y:number};

export class LivingWatershedScene extends Phaser.Scene {
  private state!:WatershedState; private visualHeights=new Map<string,number>(); private pulseVisuals=new Map<number,Phaser.Math.Vector2>();
  private board!:Phaser.GameObjects.Graphics; private actors!:Phaser.GameObjects.Graphics; private fx!:Phaser.GameObjects.Graphics;
  private outcomeAge=0; private impact=0;
  constructor(){super('living-watershed');}
  create(){this.board=this.add.graphics();this.actors=this.add.graphics();this.fx=this.add.graphics();this.resetGame();
    this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{if(this.state.outcome!=='playing'){if(this.outcomeAge>500)this.resetGame();return;}
      const cell=this.closestCell(pointer.x,pointer.y);if(!cell)return;const before=new Set(this.state.pulses.map(p=>p.id));this.state=playWatershedTurn(this.state,cell.row,cell.col);
      for(const pulse of this.state.pulses)if(!before.has(pulse.id)){const s=this.cellCenter(this.state.source.row,this.state.source.col);this.pulseVisuals.set(pulse.id,new Phaser.Math.Vector2(s.x,s.y));}
      this.impact=this.state.outcome==='playing'?.45:1;if(this.state.outcome!=='playing')this.outcomeAge=0;});}
  update(_:number,delta:number){const te=1-Math.exp(-delta/90),ae=1-Math.exp(-delta/115);this.impact=Math.max(0,this.impact-delta/430);if(this.state.outcome!=='playing')this.outcomeAge+=delta;
    for(const c of this.state.cells){const k=this.key(c.row,c.col),h=this.visualHeights.get(k)??c.height;this.visualHeights.set(k,h+(c.height-h)*te);}
    for(const p of this.state.pulses){let v=this.pulseVisuals.get(p.id);if(!v){const q=this.cellCenter(p.row,p.col);v=new Phaser.Math.Vector2(q.x,q.y);this.pulseVisuals.set(p.id,v);}const t=this.cellCenter(p.row,p.col);v.x+=(t.x-v.x)*ae;v.y+=(t.y-v.y)*ae;}this.redraw();}
  private resetGame(){this.state=createWatershedState();this.visualHeights.clear();this.pulseVisuals.clear();this.outcomeAge=0;this.impact=0;for(const c of this.state.cells)this.visualHeights.set(this.key(c.row,c.col),c.height);for(const p of this.state.pulses){const q=this.cellCenter(p.row,p.col);this.pulseVisuals.set(p.id,new Phaser.Math.Vector2(q.x,q.y));}}
  private redraw(){this.board.clear();this.actors.clear();this.fx.clear();this.cameras.main.setBackgroundColor(this.state.outcome==='lost'?'#263c40':'#173f49');this.board.fillStyle(0x12343b,1);this.board.fillRoundedRect(28,140,334,404,28);
    for(const c of [...this.state.cells].sort((a,b)=>a.row-b.row||a.col-b.col)){const h=this.visualHeights.get(this.key(c.row,c.col))??c.height,x=ORIGIN_X+c.col*CELL,y=ORIGIN_Y+c.row*CELL-h*HEIGHT_PX,face=Math.max(5,h*6),base=GROUND[(c.row*3+c.col*5)%GROUND.length],dim=this.state.outcome==='lost'?.68:1,top=this.shade(base,dim);this.board.fillStyle(0x0d2c31,.22);this.board.fillRoundedRect(x+2,y+CELL+face-1,CELL-3,6,3);this.board.fillStyle(this.shade(base,.55*dim),1);this.board.fillRect(x,y+CELL-1,CELL-2,face);this.board.fillStyle(top,1);this.board.fillRoundedRect(x,y,CELL-2,CELL-2,5);this.board.lineStyle(1,0x174b49,.3);this.board.strokeRoundedRect(x,y,CELL-2,CELL-2,5);}
    // Preview the autonomous consequence before the tap: a short cyan trace shows where each active pulse is currently committed to go.
    for(const pulse of this.state.pulses){if(pulse.settled)continue;const next=previewPulseStep(this.state,pulse);if(!next)continue;const a=this.cellCenter(pulse.row,pulse.col),b=this.cellCenter(next.row,next.col);this.fx.lineStyle(5,0x7eefff,.38);this.fx.lineBetween(a.x,a.y,b.x,b.y);this.fx.fillStyle(0xcffbff,.7);this.fx.fillTriangle(b.x,b.y+7,b.x-6,b.y-5,b.x+6,b.y-5);}
    const source=this.cellCenter(this.state.source.row,this.state.source.col);this.actors.fillStyle(0x6de8ff,.22);this.actors.fillCircle(source.x,source.y,18+Math.sin(this.time.now/240)*2);this.actors.lineStyle(4,0x9df4ff,.95);this.actors.strokeCircle(source.x,source.y,13);
    for(const g of this.state.gardens){const p=this.cellCenter(g.row,g.col),color=g.side==='left'?0xffd95a:0xf4a8ff,pulse=1+Math.sin(this.time.now/300+(g.side==='left'?0:1.4))*.07;this.actors.fillStyle(color,g.wet?.34:.12);this.actors.fillCircle(p.x,p.y,20*pulse);this.actors.lineStyle(g.wet?6:4,color,g.wet?1:.9);this.actors.strokeCircle(p.x,p.y,14*pulse);if(g.wet){this.actors.lineStyle(3,0xffffff,.9);this.actors.strokeCircle(p.x,p.y,7*pulse);}}
    const v=this.cellCenter(this.state.village.row,this.state.village.col);this.actors.fillStyle(0xff6158,.28);this.actors.fillRoundedRect(v.x-18,v.y-17,36,34,8);this.actors.lineStyle(5,0xff9b91,1);this.actors.strokeRoundedRect(v.x-13,v.y-12,26,24,6);this.actors.lineBetween(v.x-9,v.y-12,v.x,v.y-20);this.actors.lineBetween(v.x,v.y-20,v.x+9,v.y-12);
    for(const p of this.state.pulses){const q=this.pulseVisuals.get(p.id)!;this.actors.fillStyle(0x6de8ff,.95);this.actors.fillCircle(q.x,q.y,9+this.impact*1.5);this.actors.lineStyle(2,0xcffbff,.95);this.actors.strokeCircle(q.x,q.y,12+this.impact);}
    // Goal is communicated in-world: both safe basins pulse, while the village flashes as water approaches it.
    const danger=this.state.pulses.some(p=>{const n=previewPulseStep(this.state,p);return n?.row===this.state.village.row&&n?.col===this.state.village.col;});if(danger){this.fx.lineStyle(7,0xff6158,.45+.3*Math.sin(this.time.now/100));this.fx.strokeCircle(v.x,v.y,28);}
    const remaining=Math.max(0,this.state.maxTurns-this.state.turn),gap=17,width=this.state.maxTurns*gap,start=195-width/2+gap/2;for(let i=0;i<this.state.maxTurns;i++){this.fx.fillStyle(0xd7fff0,i<remaining?.72:.12);this.fx.fillCircle(start+i*gap,112,3.5);}
    if(this.state.outcome==='won'){this.fx.fillStyle(0xd7fff0,.45+Math.sin(this.time.now/220)*.12);this.fx.fillCircle(195,618,34+this.impact*9);this.fx.lineStyle(5,0x76f4bd,.95);this.fx.strokeCircle(195,618,24);this.fx.lineBetween(183,618,192,627);this.fx.lineBetween(192,627,210,607);}else if(this.state.outcome==='lost'){this.fx.lineStyle(6,0xff8d84,.9);this.fx.strokeCircle(195,618,24+this.impact*5);this.fx.lineBetween(185,608,205,628);this.fx.lineBetween(205,608,185,628);}}
  private closestCell(x:number,y:number){let best:{row:number;col:number;distance:number}|null=null;for(const c of this.state.cells){const p=this.cellCenter(c.row,c.col),d=Phaser.Math.Distance.Between(x,y,p.x,p.y);if(d<=30&&(!best||d<best.distance))best={row:c.row,col:c.col,distance:d};}return best?{row:best.row,col:best.col}:null;}
  private cellCenter(row:number,col:number):Point{const c=getWatershedCell(this.state,row,col)!,h=this.visualHeights.get(this.key(row,col))??c.height;return{x:ORIGIN_X+col*CELL+(CELL-2)/2,y:ORIGIN_Y+row*CELL+(CELL-2)/2-h*HEIGHT_PX};}
  private key(r:number,c:number){return`${r}:${c}`;}private shade(color:number,f:number){const r=Math.round(((color>>16)&255)*f),g=Math.round(((color>>8)&255)*f),b=Math.round((color&255)*f);return(r<<16)|(g<<8)|b;}
}
