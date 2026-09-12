import Phaser from 'phaser';
import {createSignalState,moveOperator,rotateOperator,stepSignal,type FlowKind,type SignalState} from '../game/signal';
const C:Record<FlowKind,number>={cyan:0x56e6ff,amber:0xffc857,violet:0xc99cff};
const ICON={switch:'↗',filter:'◇',alternator:'↔',priority:'!'};
export class SignalScene extends Phaser.Scene{
 private s!:SignalState;private g!:Phaser.GameObjects.Graphics;private labels:Phaser.GameObjects.Text[]=[];private held:number|null=null;private seed=1;private ended=0;
 constructor(){super('signal');}
 create(){this.g=this.add.graphics();this.reset();this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>this.down(p));this.input.on('pointerup',(p:Phaser.Input.Pointer)=>this.up(p));}
 update(_:number,d:number){if(this.s.outcome==='playing')stepSignal(this.s,Math.min(.05,d/1000));else this.ended+=d;this.draw();}
 private reset(){this.s=createSignalState(this.seed++);this.held=null;this.ended=0;}
 private pos(id:number){const n=this.s.nodes[id];return{x:38+n.x*314,y:165+n.y*430};}
 private nearest(x:number,y:number){let id=-1,dist=1e9;for(const n of this.s.nodes){const p=this.pos(n.id),d=Phaser.Math.Distance.Between(x,y,p.x,p.y);if(d<dist){dist=d;id=n.id;}}return dist<34?id:-1;}
 private down(p:Phaser.Input.Pointer){if(this.s.outcome!=='playing'){if(this.ended>350)this.reset();return;}for(const o of this.s.operators){const q=this.pos(o.node);if(Phaser.Math.Distance.Between(p.x,p.y,q.x,q.y)<25){this.held=o.id;return;}}}
 private up(p:Phaser.Input.Pointer){if(this.held===null)return;const o=this.s.operators.find(x=>x.id===this.held)!;const target=this.nearest(p.x,p.y);if(target===o.node)rotateOperator(this.s,o.id);else if(target>=0)moveOperator(this.s,o.id,target);this.held=null;}
 private draw(){this.g.clear();for(const t of this.labels)t.destroy();this.labels=[];this.cameras.main.setBackgroundColor('#09151d');this.g.fillStyle(0x10242e,1);this.g.fillRoundedRect(18,92,354,570,24);
 for(const n of this.s.nodes)for(const b of n.links)if(b>n.id){const a=this.pos(n.id),q=this.pos(b);this.g.lineStyle(5,0x294652,.8);this.g.lineBetween(a.x,a.y,q.x,q.y);}
 for(const n of this.s.nodes){const p=this.pos(n.id),pressure=this.s.pressure[n.id]??0;if(pressure>2){this.g.fillStyle(0xff5f68,.12+Math.min(.35,pressure*.05));this.g.fillCircle(p.x,p.y,20+pressure*2);}this.g.fillStyle(0x173744,1);this.g.fillCircle(p.x,p.y,10);if(n.source){this.g.lineStyle(4,C[n.source],1);this.g.strokeCircle(p.x,p.y,16);}if(n.sink){this.g.fillStyle(C[n.sink],.25);this.g.fillCircle(p.x,p.y,20);this.g.lineStyle(4,C[n.sink],1);this.g.strokeCircle(p.x,p.y,14);}}
 for(const o of this.s.operators){const p=this.pos(o.node),col=o.kind==='priority'?0xff7180:o.kind==='filter'?0x69e6b1:o.kind==='alternator'?0xffd166:0xffffff;this.g.fillStyle(col,.2);this.g.fillCircle(p.x,p.y,23);this.g.lineStyle(3,col,1);this.g.strokeCircle(p.x,p.y,20);const tx=this.add.text(p.x,p.y,ICON[o.kind],{fontFamily:'Arial',fontSize:'18px',color:'#ffffff',fontStyle:'bold'}).setOrigin(.5);this.labels.push(tx);if(o.kind==='filter'){this.g.fillStyle(C[['cyan','amber','violet'][o.orientation%3] as FlowKind],1);this.g.fillCircle(p.x+15,p.y-15,5);}}
 for(const k of this.s.packets){const a=this.pos(k.node),b=k.next===null?a:this.pos(k.next),x=Phaser.Math.Linear(a.x,b.x,k.progress),y=Phaser.Math.Linear(a.y,b.y,k.progress);this.g.fillStyle(C[k.kind],1);this.g.fillCircle(x,y,7);this.g.lineStyle(2,0xffffff,.55);this.g.strokeCircle(x,y,8);}
 const left=Math.max(0,Math.ceil(this.s.duration-this.s.time)),head=this.add.text(28,25,'SIGNAL',{fontFamily:'Arial',fontSize:'25px',fontStyle:'bold',color:'#e9fbff'}),stat=this.add.text(28,59,`${this.s.delivered} livrés   ${this.s.lost} perdus   ${left}s`,{fontFamily:'Arial',fontSize:'14px',color:'#9fc7d2'});this.labels.push(head,stat);
 const hint=this.add.text(195,690,'Glisse un opérateur • touche-le pour le tourner',{fontFamily:'Arial',fontSize:'13px',color:'#83aeb9',align:'center'}).setOrigin(.5);this.labels.push(hint);
 if(this.s.outcome!=='playing'){this.g.fillStyle(0x071116,.88);this.g.fillRoundedRect(54,300,282,130,20);const win=this.s.outcome==='won',a=this.add.text(195,333,win?'RÉSEAU STABLE':'RÉSEAU SATURÉ',{fontFamily:'Arial',fontSize:'24px',fontStyle:'bold',color:win?'#8dffc7':'#ff8790'}).setOrigin(.5),b=this.add.text(195,382,'Touchez pour recommencer',{fontFamily:'Arial',fontSize:'15px',color:'#d9f4f8'}).setOrigin(.5);this.labels.push(a,b);}}
}
