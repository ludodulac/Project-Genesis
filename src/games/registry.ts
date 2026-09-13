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
] as const;

export function gameUrl(route: string): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('game', route);
  return url.toString();
}
