import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 84,
  'alcides': 73,
  'altera': 27,
  'amakusa': 53,
  'anastasia': 65,
  'archer': 54,
  'arjuna-alter': 48,
  'ashwatthama': 86,
  'assassin': 94,
  'astolfo': 74,
  'atalanta': 96,
  'avicebron': 8,
  'barghest': 50,
  'bedivere': 100,
  'berserker': 68,
  'bhima': 64,
  'boudica': 4,
  'brynhildr': 37,
  'caster': 18,
  'castoria': 60,
  'charlemagne': 7,
  'chen-gong': 85,
  'circe': 45,
  'cu-chulainn-alter': 19,
  'darius-iii': 77,
  'diarmuid': 69,
  'drake': 91,
  'edmond-dantes': 26,
  'emiya': 92,
  'enkidu': 57,
  'ereshkigal': 29,
  'frankenstein': 14,
  'gawain': 75,
  'gilgamesh': 15,
  'gilles-de-rais': 88,
  'hakuno': 1,
  'hijikata': 71,
  'ibuki-douji': 90,
  'ishtar': 99,
  'ivan-the-terrible': 9,
  'jeanne': 16,
  'jeanne-alter': 66,
  'john-lackland': 61,
  'kagekiyo': 72,
  'kama': 63,
  'karna': 51,
  'kiara': 80,
  'king-hassan': 89,
  'koyanskaya': 76,
  'kukulkan': 87,
  'lancelot': 41,
  'lancer': 83,
  'mash': 33,
  'medusa': 5,
  'melusine': 81,
  'merlin': 40,
  'mordred': 6,
  'morgan-le-fay': 11,
  'moriarty': 98,
  'musashi': 39,
  'nero': 67,
  'noah': 42,
  'nobunaga': 79,
  'oberon': 78,
  'odysseus': 56,
  'okita-souji': 38,
  'orion': 44,
  'ozymandias': 47,
  'percival': 10,
  'quetzalcoatl': 95,
  'rama': 97,
  'richard': 17,
  'rider': 31,
  'robin-hood': 46,
  'romulus': 12,
  'romulus-quirinus': 13,
  'saber': 24,
  'saito': 93,
  'sakata-kintoki': 49,
  'samson': 62,
  'sasaki-kojiro': 70,
  'scathach': 52,
  'scathach-skadi': 43,
  'semiramis': 55,
  'sengo-muramasa': 34,
  'sherlock': 59,
  'siegfried': 2,
  'sigurd': 3,
  'solomon': 36,
  'spartacus': 23,
  'tamamo': 25,
  'tametomo': 35,
  'tezcatlipoca': 82,
  'the-ripper': 58,
  'tiamat': 20,
  'u-olga-marie': 21,
  'vlad-iii': 32,
  'william-tell': 28,
  'yagyu-munenori': 22,
  'zhuge-liang': 30,
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
