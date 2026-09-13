import { GENESIS_GAMES, gameUrl } from './registry';

export function renderGameHub(root: HTMLElement) {
  document.title = 'Genesis Multijoueur';
  document.body.classList.add('genesis-hub-page');

  const shell = document.createElement('section');
  shell.className = 'genesis-hub';

  const header = document.createElement('header');
  header.className = 'genesis-hub__header';
  header.innerHTML = `
    <p class="genesis-hub__eyebrow">PROJECT GENESIS</p>
    <h1>GENESIS MULTIJOUEUR</h1>
    <p class="genesis-hub__intro">Une même adresse pour lancer les différents jeux Genesis. Les nouveaux jeux pourront être ajoutés ici au fur et à mesure.</p>
  `;
  shell.append(header);

  const grid = document.createElement('div');
  grid.className = 'genesis-game-grid';

  for (const game of GENESIS_GAMES) {
    const card = document.createElement('article');
    card.className = 'genesis-game-card';
    card.innerHTML = `
      <div class="genesis-game-card__topline">
        <span class="genesis-game-card__status">${game.status === 'prototype' ? 'PROTOTYPE' : 'DISPONIBLE'}</span>
        <span class="genesis-game-card__id">${game.id}</span>
      </div>
      <h2>${game.title}</h2>
      <p class="genesis-game-card__subtitle">${game.subtitle}</p>
      <p class="genesis-game-card__description">${game.description}</p>
      <div class="genesis-game-card__tags">${game.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
    `;

    const launch = document.createElement('a');
    launch.className = 'genesis-game-card__launch';
    launch.href = gameUrl(game.route);
    launch.textContent = 'OUVRIR LE JEU';
    launch.setAttribute('aria-label', `Ouvrir ${game.title}`);
    card.append(launch);
    grid.append(card);
  }

  shell.append(grid);

  const footer = document.createElement('p');
  footer.className = 'genesis-hub__footer';
  footer.textContent = 'Les autres jeux Genesis apparaîtront ici sans changer l’URL principale.';
  shell.append(footer);

  root.replaceChildren(shell);
}
