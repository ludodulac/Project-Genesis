import { describe, expect, it } from 'vitest';
import { simulate } from '../src/simulation/simulate';
import { cellId, createInitialWorld } from '../src/world/model';

describe('terrain simulation', () => {
  it('raises the target by draining direct neighbours without mutating the input', () => {
    const world=createInitialWorld(3,3),targetId=cellId(1,1),neighbourId=cellId(1,0);const beforeTarget=world.cells[targetId].height,beforeNeighbour=world.cells[neighbourId].height,beforeMean=Object.values(world.cells).reduce((s,c)=>s+c.height,0)/9;const result=simulate(world,{type:'RAISE_CELL',cellId:targetId});const afterMean=Object.values(result.state.cells).reduce((s,c)=>s+c.height,0)/9;expect(world.cells[targetId].height).toBe(beforeTarget);expect(result.state.cells[targetId].height).toBeCloseTo(beforeTarget+.40);expect(result.state.cells[neighbourId].height).toBeCloseTo(beforeNeighbour-.10);expect(afterMean).toBeCloseTo(beforeMean,10);
  });

  it('moves a mote toward its visible haven when the slope is traversable',()=>{
    const world=createInitialWorld(5,5),agent=world.agents[0],center=cellId(2,2);agent.cellId=center;agent.targetId=cellId(0,2);agent.arrived=false;world.cells[center].height=1;world.cells[cellId(1,2)].height=1.05;world.cells[cellId(2,1)].height=.5;world.cells[cellId(2,3)].height=.5;world.cells[cellId(3,2)].height=.5;const result=simulate(world,{type:'RAISE_CELL',cellId:cellId(4,4)});expect(result.state.agents[0].cellId).toBe(cellId(1,2));
  });

  it('lets a steep ridge block the direct route so sculpting can create a detour',()=>{
    const world=createInitialWorld(5,5),agent=world.agents[0],center=cellId(2,2);agent.cellId=center;agent.targetId=cellId(0,2);agent.arrived=false;world.cells[center].height=.5;world.cells[cellId(1,2)].height=1.2;world.cells[cellId(2,1)].height=.5;world.cells[cellId(2,3)].height=.5;world.cells[cellId(3,2)].height=.5;const result=simulate(world,{type:'RAISE_CELL',cellId:cellId(4,4)});expect(result.state.agents[0].cellId).toBe(center);
  });

  it('marks a mote as arrived when it reaches its haven',()=>{
    const world=createInitialWorld(5,5),agent=world.agents[0],goal=cellId(1,2),start=cellId(2,2);agent.cellId=start;agent.targetId=goal;agent.arrived=false;world.cells[start].height=.7;world.cells[goal].height=.7;world.cells[cellId(2,1)].height=1.2;world.cells[cellId(2,3)].height=1.2;world.cells[cellId(3,2)].height=1.2;const result=simulate(world,{type:'RAISE_CELL',cellId:cellId(4,4)});expect(result.state.agents[0].cellId).toBe(goal);expect(result.state.agents[0].arrived).toBe(true);expect(result.events).toContainEqual({type:'AGENT_ARRIVED',agentId:'mote-a',cellId:goal});
  });

  it('does not let agent array order change movement decisions',()=>{
    const make=()=>{const w=createInitialWorld(6,6);w.agents[0].cellId=cellId(3,2);w.agents[0].targetId=cellId(1,2);w.agents[1].cellId=cellId(3,3);w.agents[1].targetId=cellId(1,3);w.agents[2].cellId=cellId(5,0);w.agents[2].targetId=cellId(5,5);for(const a of w.agents)a.arrived=false;return w;};const normal=make(),reversed=make();reversed.agents.reverse();const a=simulate(normal,{type:'RAISE_CELL',cellId:cellId(0,0)}),b=simulate(reversed,{type:'RAISE_CELL',cellId:cellId(0,0)});const positions=(r:ReturnType<typeof simulate>)=>Object.fromEntries(r.state.agents.map(x=>[x.id,x.cellId]));expect(positions(a)).toEqual(positions(b));
  });
});
