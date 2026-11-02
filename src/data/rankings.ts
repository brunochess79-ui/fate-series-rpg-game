import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 60,
  'alcides': 53,
  'altera': 29,
  'amakusa': 46,
  'anastasia': 52,
  'archer': 71,
  'arjuna-alter': 40,
  'ashwatthama': 58,
  'assassin': 98,
  'astolfo': 100,
  'atalanta': 94,
  'avicebron': 11,
  'barghest': 38,
  'bedivere': 73,
  'berserker': 43,
  'bhima': 41,
  'boudica': 4,
  'brynhildr': 33,
  'caster': 17,
  'castoria': 42,
  'charlemagne': 8,
  'chen-gong': 65,
  'circe': 25,
  'cu-chulainn-alter': 7,
  'darius-iii': 57,
  'diarmuid': 45,
  'drake': 68,
  'edmond-dantes': 20,
  'emiya': 99,
  'enkidu': 50,
  'ereshkigal': 28,
  'frankenstein': 18,
  'gawain': 61,
  'gilgamesh': 6,
  'gilles-de-rais': 63,
  'hakuno': 3,
  'hijikata': 39,
  'ibuki-douji': 69,
  'ishtar': 76,
  'ivan-the-terrible': 15,
  'jeanne': 10,
  'jeanne-alter': 86,
  'john-lackland': 36,
  'kagekiyo': 64,
  'kama': 47,
  'karna': 44,
  'kiara': 93,
  'king-hassan': 88,
  'koyanskaya': 92,
  'kukulkan': 55,
  'lancelot': 24,
  'lancer': 59,
  'mash': 32,
  'medusa': 62,
  'melusine': 56,
  'merlin': 16,
  'mordred': 78,
  'morgan-le-fay': 13,
  'moriarty': 95,
  'musashi': 82,
  'nero': 84,
  'noah': 27,
  'nobunaga': 96,
  'oberon': 54,
  'odysseus': 51,
  'okita-souji': 72,
  'orion': 91,
  'ozymandias': 49,
  'percival': 5,
  'quetzalcoatl': 70,
  'rama': 74,
  'richard': 14,
  'rider': 26,
  'robin-hood': 75,
  'romulus': 9,
  'romulus-quirinus': 12,
  'saber': 21,
  'saito': 66,
  'sakata-kintoki': 37,
  'samson': 48,
  'sasaki-kojiro': 97,
  'scathach': 34,
  'scathach-skadi': 89,
  'semiramis': 35,
  'sengo-muramasa': 83,
  'sherlock': 87,
  'siegfried': 1,
  'sigurd': 2,
  'solomon': 80,
  'spartacus': 22,
  'tamamo': 67,
  'tametomo': 23,
  'tezcatlipoca': 90,
  'the-ripper': 85,
  'tiamat': 19,
  'u-olga-marie': 77,
  'vlad-iii': 31,
  'william-tell': 81,
  'yagyu-munenori': 79,
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
