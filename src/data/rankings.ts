import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 88,
  'alcides': 74,
  'altera': 15,
  'amakusa': 49,
  'anastasia': 66,
  'archer': 17,
  'arjuna-alter': 18,
  'ashwatthama': 75,
  'assassin': 96,
  'astolfo': 77,
  'atalanta': 97,
  'avicebron': 2,
  'barghest': 38,
  'bedivere': 94,
  'berserker': 58,
  'bhima': 24,
  'boudica': 5,
  'brynhildr': 20,
  'caster': 35,
  'castoria': 48,
  'charlemagne': 90,
  'chen-gong': 87,
  'circe': 73,
  'cu-chulainn-alter': 19,
  'darius-iii': 83,
  'diarmuid': 64,
  'drake': 78,
  'edmond-dantes': 16,
  'emiya': 86,
  'enkidu': 89,
  'ereshkigal': 12,
  'frankenstein': 8,
  'gawain': 71,
  'gilgamesh': 30,
  'gilles-de-rais': 81,
  'hakuno': 9,
  'hijikata': 57,
  'ibuki-douji': 67,
  'ishtar': 72,
  'ivan-the-terrible': 29,
  'jeanne': 6,
  'jeanne-alter': 85,
  'john-lackland': 62,
  'kagekiyo': 95,
  'kama': 7,
  'karna': 11,
  'kiara': 82,
  'king-hassan': 99,
  'koyanskaya': 65,
  'kukulkan': 100,
  'lancelot': 25,
  'lancer': 53,
  'mash': 46,
  'medusa': 55,
  'melusine': 80,
  'merlin': 22,
  'mordred': 98,
  'morgan-le-fay': 45,
  'moriarty': 92,
  'musashi': 37,
  'nero': 84,
  'noah': 50,
  'nobunaga': 56,
  'oberon': 68,
  'odysseus': 41,
  'okita-souji': 42,
  'orion': 43,
  'ozymandias': 47,
  'percival': 70,
  'quetzalcoatl': 79,
  'rama': 91,
  'richard': 76,
  'rider': 14,
  'robin-hood': 40,
  'romulus': 3,
  'romulus-quirinus': 23,
  'saber': 13,
  'saito': 63,
  'sakata-kintoki': 21,
  'samson': 54,
  'sasaki-kojiro': 60,
  'scathach': 69,
  'scathach-skadi': 31,
  'semiramis': 44,
  'sengo-muramasa': 1,
  'sherlock': 32,
  'siegfried': 93,
  'sigurd': 33,
  'solomon': 61,
  'spartacus': 36,
  'tamamo': 10,
  'tametomo': 28,
  'tezcatlipoca': 59,
  'the-ripper': 51,
  'tiamat': 27,
  'u-olga-marie': 4,
  'vlad-iii': 39,
  'william-tell': 52,
  'yagyu-munenori': 34,
  'zhuge-liang': 26,
};

export const RANKED_SERVANTS = 100;

/** The rating letter with the exact position, e.g. "A+ · #3". */
export function servantRankLabel(servant: Pick<ServantDefinition, 'id' | 'rank'>): string {
  const pos = SERVANT_RANK_POSITION[servant.id];
  return pos ? `${servant.rank} · #${pos}` : servant.rank;
}

/** Longer form for tooltips and detail views, e.g. "A+, ranked #3 of 100". */
export function servantRankDetail(servant: Pick<ServantDefinition, 'id' | 'rank'>): string {
  const pos = SERVANT_RANK_POSITION[servant.id];
  return pos ? `${servant.rank}, ranked #${pos} of ${RANKED_SERVANTS}` : servant.rank;
}
