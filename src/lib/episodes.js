import Episodes from "../../episodes.json";

export function getRandomFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomSeason() {
  return getRandomFromRange(1, 6);
}

export function getRandomEpisode(_season) {
  const season = _season || getRandomSeason();
  const episodes = Episodes[season - 1];
  const min = 1;
  const max = episodes.length;
  return episodes[getRandomFromRange(min, max)];
}

export function getSeasonEpisodes(season) {
  if (season) return Episodes[season - 1];
  return Episodes;
}
