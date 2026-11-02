import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 84,
  'alcides': 74,
  'altera': 27,
  'amakusa': 49,
  'anastasia': 63,
  'archer': 53,
  'arjuna-alter': 47,
  'ashwatthama': 85,
  'assassin': 92,
  'astolfo': 76,
  'atalanta': 97,
  'avicebron': 8,
  'barghest': 52,
  'bedivere': 100,
  'berserker': 66,
  'bhima': 69,
  'boudica': 4,
  'brynhildr': 33,
  'caster': 20,
  'castoria': 58,
  'charlemagne': 15,
  'chen-gong': 83,
  'circe': 45,
  'cu-chulainn-alter': 19,
  'darius-iii': 78,
  'diarmuid': 68,
  'drake': 93,
  'edmond-dantes': 24,
  'emiya': 91,
  'enkidu': 57,
  'ereshkigal': 36,
  'frankenstein': 13,
  'gawain': 80,
  'gilgamesh': 12,
  'gilles-de-rais': 87,
  'hakuno': 1,
  'hijikata': 70,
  'ibuki-douji': 88,
  'ishtar': 99,
  'ivan-the-terrible': 10,
  'jeanne': 17,
  'jeanne-alter': 67,
  'john-lackland': 61,
  'kagekiyo': 75,
  'kama': 65,
  'karna': 50,
  'kiara': 72,
  'king-hassan': 89,
  'koyanskaya': 73,
  'kukulkan': 90,
  'lancelot': 38,
  'lancer': 86,
  'mash': 41,
  'medusa': 5,
  'melusine': 82,
  'merlin': 26,
  'mordred': 11,
  'morgan-le-fay': 9,
  'moriarty': 98,
  'musashi': 46,
  'nero': 64,
  'noah': 42,
  'nobunaga': 81,
  'oberon': 71,
  'odysseus': 59,
  'okita-souji': 39,
  'orion': 43,
  'ozymandias': 48,
  'percival': 6,
  'quetzalcoatl': 95,
  'rama': 96,
  'richard': 14,
  'rider': 30,
  'robin-hood': 44,
  'romulus': 7,
  'romulus-quirinus': 16,
  'saber': 25,
  'saito': 94,
  'sakata-kintoki': 51,
  'samson': 62,
  'sasaki-kojiro': 77,
  'scathach': 54,
  'scathach-skadi': 37,
  'semiramis': 55,
  'sengo-muramasa': 34,
  'sherlock': 56,
  'siegfried': 2,
  'sigurd': 3,
  'solomon': 35,
  'spartacus': 23,
  'tamamo': 28,
  'tametomo': 40,
  'tezcatlipoca': 79,
  'the-ripper': 60,
  'tiamat': 21,
  'u-olga-marie': 18,
  'vlad-iii': 29,
  'william-tell': 31,
  'yagyu-munenori': 22,
  'zhuge-liang': 32,
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
