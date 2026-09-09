export type CellId=`${number}:${number}`;
export type CellKind='ground'|'water-source'|'seed'|'bloom'|'haven'|'spring';
export type Element='water';
export interface Cell{id:CellId;row:number;col:number;height:number;kind:CellKind;}
export interface Agent{id:'mote-a'|'mote-b'|'mote-c';cellId:CellId;carrying:Element|null;targetId:CellId;arrived:boolean;}
export interface WorldState{rows:number;cols:number;cells:Record<CellId,Cell>;agents:Agent[];}
export function cellId(row:number,col:number):CellId{return `${row}:${col}`;}
export function createInitialWorld(rows=20,cols=12):WorldState{
 const cells={} as Record<CellId,Cell>;for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const id=cellId(row,col),broad=Math.sin(row*.72)*.09+Math.cos(col*.83)*.08,local=((row*7+col*11)%5)*.025;cells[id]={id,row,col,height:.52+broad+local,kind:'ground'};}
 const mark=(id:CellId,kind:CellKind)=>{if(cells[id]&&cells[id].kind==='ground')cells[id].kind=kind;};
 mark(cellId(Math.min(rows-1,7),Math.min(cols-1,8)),'water-source');
 [cellId(Math.min(rows-1,5),Math.min(cols-1,3)),cellId(Math.min(rows-1,10),Math.min(cols-1,9)),cellId(Math.min(rows-1,16),Math.min(cols-1,5))].forEach(id=>mark(id,'seed'));
 [cellId(Math.min(rows-1,8),Math.min(cols-1,3)),cellId(Math.min(rows-1,13),Math.min(cols-1,8))].forEach(id=>mark(id,'spring'));
 const starts=[cellId(Math.min(rows-1,10),Math.min(cols-1,5)),cellId(Math.min(rows-1,12),Math.min(cols-1,7)),cellId(Math.min(rows-1,14),Math.min(cols-1,4))],targets=[cellId(Math.min(rows-1,3),Math.min(cols-1,2)),cellId(Math.min(rows-1,4),Math.min(cols-1,9)),cellId(Math.min(rows-1,17),Math.min(cols-1,9))];targets.forEach(id=>mark(id,'haven'));
 // EXP-019: on the canonical 20x12 board, expose one compact version of the
 // laboratory compromise. A's next direct cell is just too high; B's direct
 // cell is a spring beside it. Raising B's spring drains A's gate enough to
 // open A while making B detour. Same verb, two incompatible interests.
 if(rows>=13&&cols>=8){const aGate=cellId(9,5),bGate=cellId(11,7);cells[aGate].height=cells[starts[0]].height+.18;cells[bGate].kind='spring';cells[bGate].height=cells[starts[1]].height;}
 return{rows,cols,cells,agents:[{id:'mote-a',cellId:starts[0],carrying:null,targetId:targets[0],arrived:starts[0]===targets[0]},{id:'mote-b',cellId:starts[1],carrying:null,targetId:targets[1],arrived:starts[1]===targets[1]},{id:'mote-c',cellId:starts[2],carrying:null,targetId:targets[2],arrived:starts[2]===targets[2]}]};
}
export function neighboursOf(world:WorldState,id:CellId):Cell[]{const c=world.cells[id];if(!c)return[];return([[-1,0],[1,0],[0,-1],[0,1]] as const).map(([dr,dc])=>world.cells[cellId(c.row+dr,c.col+dc)]).filter((x):x is Cell=>Boolean(x));}
