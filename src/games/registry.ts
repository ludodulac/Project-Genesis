export interface GenesisGameEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'prototype' | 'available';
  route: string;
  tags: readonly string[];
}

export const GENESIS_GAMES: readonly GenesisGameEntry[] = [
  {
    id: 'duel-v0',
    title: 'Duel V0',
    subtitle: 'Duel tactique à 4 cartes',
    description: 'Choisissez un coup parmi quatre cartes visibles et poussez votre adversaire hors de l’arène. Pour l’instant, vous jouez contre la machine.',
    status: 'prototype',
    route: 'duel-v0',
    tags: ['Solo test', 'Cartes', 'Duel'],
  },
  {
    id: 'genesis-duel-2',
    title: 'Genesis Duel 2',
    subtitle: 'Prototype mobile Lily vs Kitsu',
    description: 'Le nouveau duel mobile : quatre coups visibles, choix simultané contre l’ordinateur, déplacements, croisements, récupération des cartes et ring-out.',
    status: 'prototype',
    route: 'genesis-duel-2',
    tags: ['Mobile', 'Solo IA', 'Cartes', 'Ring-out'],
  },
] as const;

export function gameUrl(route: string): string {
  if (route === 'genesis-duel-2') {
    return new URL('prototypes/duel-mobile/index.html', window.location.href).toString();
  }
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('game', route);
  return url.toString();
}
