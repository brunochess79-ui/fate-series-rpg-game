import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 83,
  'alcides': 72,
  'altera': 30,
  'amakusa': 47,
  'anastasia': 59,
  'archer': 52,
  'arjuna-alter': 49,
  'ashwatthama': 81,
  'assassin': 93,
  'astolfo': 86,
  'atalanta': 95,
  'avicebron': 13,
  'barghest': 38,
  'bedivere': 100,
  'berserker': 74,
  'bhima': 67,
  'boudica': 3,
  'brynhildr': 42,
  'caster': 16,
  'castoria': 54,
  'charlemagne': 7,
  'chen-gong': 76,
  'circe': 37,
  'cu-chulainn-alter': 21,
  'darius-iii': 82,
  'diarmuid': 64,
  'drake': 89,
  'edmond-dantes': 26,
  'emiya': 88,
  'enkidu': 57,
  'ereshkigal': 27,
  'frankenstein': 15,
  'gawain': 77,
  'gilgamesh': 19,
  'gilles-de-rais': 90,
  'hakuno': 2,
  'hijikata': 66,
  'ibuki-douji': 84,
  'ishtar': 99,
  'ivan-the-terrible': 10,
  'jeanne': 6,
  'jeanne-alter': 70,
  'john-lackland': 62,
  'kagekiyo': 75,
  'kama': 69,
  'karna': 51,
  'kiara': 85,
  'king-hassan': 91,
  'koyanskaya': 71,
  'kukulkan': 94,
  'lancelot': 43,
  'lancer': 79,
  'mash': 34,
  'medusa': 8,
  'melusine': 87,
  'merlin': 24,
  'mordred': 9,
  'morgan-le-fay': 12,
  'moriarty': 97,
  'musashi': 46,
  'nero': 61,
  'noah': 39,
  'nobunaga': 78,
  'oberon': 63,
  'odysseus': 68,
  'okita-souji': 45,
  'orion': 41,
  'ozymandias': 48,
  'percival': 11,
  'quetzalcoatl': 96,
  'rama': 98,
  'richard': 17,
  'rider': 29,
  'robin-hood': 44,
  'romulus': 4,
  'romulus-quirinus': 14,
  'saber': 25,
  'saito': 92,
  'sakata-kintoki': 55,
  'samson': 56,
  'sasaki-kojiro': 80,
  'scathach': 53,
  'scathach-skadi': 50,
  'semiramis': 58,
  'sengo-muramasa': 28,
  'sherlock': 65,
  'siegfried': 1,
  'sigurd': 5,
  'solomon': 40,
  'spartacus': 22,
  'tamamo': 33,
  'tametomo': 35,
  'tezcatlipoca': 73,
  'the-ripper': 60,
  'tiamat': 23,
  'u-olga-marie': 20,
  'vlad-iii': 32,
  'william-tell': 31,
  'yagyu-munenori': 18,
  'zhuge-liang': 36,
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
