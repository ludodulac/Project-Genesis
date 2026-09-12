import {describe,expect,it} from 'vitest';
import {createSignalState,moveOperator,rotateOperator,stepSignal} from '../src/game/signal';

describe('SIGNAL game',()=>{
 it('is deterministic for a seed',()=>{const a=createSignalState(7),b=createSignalState(7);for(let i=0;i<200;i++){stepSignal(a,.1);stepSignal(b,.1);}expect(a).toEqual(b);});
 it('keeps packets in flight when an operator moves',()=>{const s=createSignalState(2);for(let i=0;i<80;i++)stepSignal(s,.1);const committed=s.packets.map(p=>[p.id,p.next]);moveOperator(s,0,5);expect(s.packets.map(p=>[p.id,p.next])).toEqual(committed);});
 it('allows visible operators to move and rotate',()=>{const s=createSignalState(3),op=s.operators[0],old=op.orientation;expect(moveOperator(s,op.id,5)).toBe(true);rotateOperator(s,op.id);expect(op.node).toBe(5);expect(op.orientation).not.toBe(old);});
 it('reaches a real terminal outcome',()=>{const s=createSignalState(4);for(let i=0;i<4000&&s.outcome==='playing';i++)stepSignal(s,.1);expect(['won','lost']).toContain(s.outcome);});
 it('changes structure between seeds',()=>{const a=createSignalState(1),b=createSignalState(2);expect(a.nodes.map(n=>[n.x,n.sink,n.source])).not.toEqual(b.nodes.map(n=>[n.x,n.sink,n.source]));});
});
