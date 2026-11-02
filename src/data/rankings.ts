import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 5,
  'alcides': 71,
  'altera': 34,
  'amakusa': 46,
  'anastasia': 77,
  'archer': 15,
  'arjuna-alter': 45,
  'ashwatthama': 85,
  'assassin': 95,
  'astolfo': 70,
  'atalanta': 97,
  'avicebron': 19,
  'barghest': 52,
  'bedivere': 100,
  'berserker': 74,
  'bhima': 62,
  'boudica': 6,
  'brynhildr': 40,
  'caster': 33,
  'castoria': 66,
  'charlemagne': 7,
  'chen-gong': 87,
  'circe': 58,
  'cu-chulainn-alter': 21,
  'darius-iii': 83,
  'diarmuid': 76,
  'drake': 92,
  'edmond-dantes': 31,
  'emiya': 93,
  'enkidu': 79,
  'ereshkigal': 42,
  'frankenstein': 17,
  'gawain': 84,
  'gilgamesh': 10,
  'gilles-de-rais': 81,
  'hakuno': 1,
  'hijikata': 67,
  'ibuki-douji': 89,
  'ishtar': 9,
  'ivan-the-terrible': 8,
  'jeanne': 16,
  'jeanne-alter': 64,
  'john-lackland': 75,
  'kagekiyo': 80,
  'kama': 2,
  'karna': 53,
  'kiara': 90,
  'king-hassan': 82,
  'koyanskaya': 91,
  'kukulkan': 94,
  'lancelot': 54,
  'lancer': 86,
  'mash': 56,
  'medusa': 23,
  'melusine': 69,
  'merlin': 38,
  'mordred': 24,
  'morgan-le-fay': 3,
  'moriarty': 98,
  'musashi': 48,
  'nero': 78,
  'noah': 35,
  'nobunaga': 68,
  'oberon': 88,
  'odysseus': 59,
  'okita-souji': 55,
  'orion': 44,
  'ozymandias': 57,
  'percival': 20,
  'quetzalcoatl': 4,
  'rama': 99,
  'richard': 18,
  'rider': 37,
  'robin-hood': 39,
  'romulus': 13,
  'romulus-quirinus': 22,
  'saber': 36,
  'saito': 96,
  'sakata-kintoki': 50,
  'samson': 63,
  'sasaki-kojiro': 73,
  'scathach': 65,
  'scathach-skadi': 47,
  'semiramis': 49,
  'sengo-muramasa': 30,
  'sherlock': 60,
  'siegfried': 14,
  'sigurd': 12,
  'solomon': 51,
  'spartacus': 29,
  'tamamo': 32,
  'tametomo': 43,
  'tezcatlipoca': 72,
  'the-ripper': 61,
  'tiamat': 11,
  'u-olga-marie': 25,
  'vlad-iii': 26,
  'william-tell': 41,
  'yagyu-munenori': 27,
  'zhuge-liang': 28,
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
