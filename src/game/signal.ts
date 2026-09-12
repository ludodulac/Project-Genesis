export type FlowKind = 'cyan' | 'amber' | 'violet';
export type OperatorKind = 'switch' | 'filter' | 'alternator';

export type Node = {
  id: number;
  x: number;
  y: number;
  links: number[];
  sink?: FlowKind;
  source?: FlowKind;
};

export type Operator = {
  id: number;
  kind: OperatorKind;
  node: number;
  orientation: number;
};

export type Packet = {
  id: number;
  kind: FlowKind;
  node: number;
  next: number | null;
  progress: number;
  wait: number;
};

export type SignalState = {
  seed: number;
  time: number;
  duration: number;
  nextSpawnAt: number;
  nodes: Node[];
  operators: Operator[];
  packets: Packet[];
  spawned: number;
  delivered: number;
  lost: number;
  pressure: Record<number, number>;
  outcome: 'playing' | 'won' | 'lost';
  nextPacketId: number;
};

export const FLOW_KINDS: FlowKind[] = ['cyan', 'amber', 'violet'];

const POINTS: [number, number][] = [
  [.08, .18], [.08, .5], [.08, .82],
  [.28, .3], [.28, .7],
  [.48, .18], [.48, .5], [.48, .82],
  [.7, .3], [.7, .7],
  [.92, .18], [.92, .5], [.92, .82],
];

const BASE_LINKS: Record<number, number[]> = {
  0: [3], 1: [3], 2: [4],
  3: [5, 6], 4: [6, 7],
  5: [8], 6: [8, 9], 7: [9],
  8: [10, 11], 9: [11, 12],
};

const VARIANTS = [
  {
    mirror: false,
    sourceOneExit: 3,
    sinks: ['cyan', 'amber', 'violet'] as FlowKind[],
    operatorNodes: [6, 4, 8],
    operatorOrientations: [1, 2, 1],
  },
  {
    mirror: true,
    sourceOneExit: 3,
    sinks: ['amber', 'cyan', 'violet'] as FlowKind[],
    operatorNodes: [4, 6, 9],
    operatorOrientations: [1, 2, 0],
  },
  {
    mirror: false,
    sourceOneExit: 4,
    sinks: ['cyan', 'violet', 'amber'] as FlowKind[],
    operatorNodes: [6, 3, 8],
    operatorOrientations: [1, 1, 1],
  },
] as const;

function buildLayout(seed: number) {
  const variant = VARIANTS[(Math.max(1, seed) - 1) % VARIANTS.length];
  const nodes: Node[] = POINTS.map(([x, y], id) => ({
    id,
    x: variant.mirror ? 1 - x : x,
    y,
    links: [...(BASE_LINKS[id] ?? [])],
  }));
  nodes[1].links = [variant.sourceOneExit];
  FLOW_KINDS.forEach((kind, index) => { nodes[index].source = kind; });
  variant.sinks.forEach((kind, index) => { nodes[10 + index].sink = kind; });

  const operatorKinds: OperatorKind[] = ['switch', 'filter', 'alternator'];
  const operators = operatorKinds.map((kind, id) => ({
    id,
    kind,
    node: variant.operatorNodes[id],
    orientation: variant.operatorOrientations[id],
  }));
  return { nodes, operators };
}

export function createSignalState(seed = 1): SignalState {
  const { nodes, operators } = buildLayout(seed);
  return {
    seed,
    time: 0,
    duration: 120,
    nextSpawnAt: 2.7,
    nodes,
    operators,
    packets: [],
    spawned: 0,
    delivered: 0,
    lost: 0,
    pressure: {},
    outcome: 'playing',
    nextPacketId: 1,
  };
}

export function orderedLinks(state: SignalState, nodeId: number) {
  return [...state.nodes[nodeId].links].sort((a, b) => state.nodes[a].y - state.nodes[b].y);
}

export function defaultNext(state: SignalState, nodeId: number): number | null {
  const node = state.nodes[nodeId];
  if (!node.links.length) return null;
  if (node.links.length === 1) return node.links[0];
  return node.links.reduce((best, candidate) => {
    const bestDistance = Math.abs(state.nodes[best].y - node.y);
    const candidateDistance = Math.abs(state.nodes[candidate].y - node.y);
    return candidateDistance < bestDistance ? candidate : best;
  });
}

function operatorAt(state: SignalState, nodeId: number) {
  return state.operators.find((operator) => operator.node === nodeId);
}

export function selectedFilterKind(operator: Operator): FlowKind {
  return FLOW_KINDS[operator.orientation % FLOW_KINDS.length];
}

export function previewOperatorRoutes(state: SignalState, operator: Operator) {
  const links = orderedLinks(state, operator.node);
  if (links.length < 2) return { primary: links[0] ?? null, secondary: null };
  if (operator.kind === 'switch') return { primary: links[operator.orientation % 2], secondary: null };
  if (operator.kind === 'filter') return { primary: links[0], secondary: links[1] };
  return { primary: links[operator.orientation % 2], secondary: links[1 - (operator.orientation % 2)] };
}

function chooseNext(state: SignalState, packet: Packet): number | null {
  const node = state.nodes[packet.node];
  if (node.sink) return null;
  if (node.links.length <= 1) return node.links[0] ?? null;

  const operator = operatorAt(state, node.id);
  if (!operator) return defaultNext(state, node.id);
  const links = orderedLinks(state, node.id);

  if (operator.kind === 'switch') return links[operator.orientation % 2];
  if (operator.kind === 'filter') {
    return packet.kind === selectedFilterKind(operator) ? links[0] : links[1];
  }

  const next = links[operator.orientation % 2];
  operator.orientation = 1 - (operator.orientation % 2);
  return next;
}

export function demandInfo(state: SignalState) {
  const wave = Math.floor(state.time / 18);
  return {
    current: FLOW_KINDS[(state.seed + wave) % 3],
    next: FLOW_KINDS[(state.seed + wave + 1) % 3],
    remaining: Math.max(0, 18 - (state.time % 18)),
  };
}

function nextSpawnKind(state: SignalState): FlowKind {
  const wave = Math.floor(state.nextSpawnAt / 18);
  const hot = (state.seed + wave) % 3;
  const pattern = [hot, hot, (hot + 1) % 3, hot, (hot + 2) % 3];
  return FLOW_KINDS[pattern[state.spawned % pattern.length]];
}

function spawn(state: SignalState) {
  while (state.time >= state.nextSpawnAt && state.nextSpawnAt < state.duration - 12) {
    const kind = nextSpawnKind(state);
    const source = state.nodes.find((node) => node.source === kind)!;
    const packet: Packet = {
      id: state.nextPacketId++,
      kind,
      node: source.id,
      next: source.links[0],
      progress: 0,
      wait: 0,
    };
    state.packets.push(packet);
    state.spawned += 1;
    const wave = Math.floor(state.nextSpawnAt / 18);
    state.nextSpawnAt += Math.max(1.9, 2.7 - wave * .12);
  }
}

export function moveOperator(state: SignalState, operatorId: number, nodeId: number) {
  if (state.outcome !== 'playing') return false;
  const operator = state.operators.find((entry) => entry.id === operatorId);
  const target = state.nodes[nodeId];
  if (!operator || !target || target.links.length !== 2) return false;

  const previousNode = operator.node;
  const other = state.operators.find((entry) => entry.id !== operatorId && entry.node === nodeId);
  operator.node = nodeId;
  if (other) other.node = previousNode;
  return true;
}

export function rotateOperator(state: SignalState, operatorId: number) {
  const operator = state.operators.find((entry) => entry.id === operatorId);
  if (!operator || state.outcome !== 'playing') return false;
  const states = operator.kind === 'filter' ? 3 : 2;
  operator.orientation = (operator.orientation + 1) % states;
  return true;
}

export function stepSignal(state: SignalState, dt: number) {
  if (state.outcome !== 'playing') return state;
  state.time += dt;
  spawn(state);

  for (const packet of [...state.packets]) {
    if (packet.next === null) {
      const sink = state.nodes[packet.node].sink;
      if (sink) {
        if (sink === packet.kind) state.delivered += 1;
        else state.lost += 1;
        state.packets.splice(state.packets.indexOf(packet), 1);
      }
      continue;
    }

    const crowded = state.packets.filter((other) => (
      other !== packet && other.node === packet.next && other.progress < .35
    )).length >= 1;
    if (crowded) {
      packet.wait += dt;
      continue;
    }

    packet.wait = Math.max(0, packet.wait - dt * .6);
    packet.progress += dt * .42;
    if (packet.progress >= 1) {
      packet.node = packet.next;
      packet.progress = 0;
      packet.next = chooseNext(state, packet);
    }
  }

  const pressure: Record<number, number> = {};
  for (const packet of state.packets) {
    pressure[packet.node] = (pressure[packet.node] ?? 0) + (packet.wait > .15 ? 1.5 : 1);
  }
  state.pressure = pressure;
  const maxPressure = Math.max(0, ...Object.values(pressure));

  if (maxPressure >= 7.5 || state.lost >= 7) state.outcome = 'lost';
  else if (state.time >= state.duration) {
    state.outcome = state.delivered >= Math.max(12, state.spawned - 5) ? 'won' : 'lost';
  }
  return state;
}

export function cloneSignal(state: SignalState): SignalState {
  return JSON.parse(JSON.stringify(state));
}
