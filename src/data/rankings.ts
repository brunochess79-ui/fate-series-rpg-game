import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 9,
  'alcides': 85,
  'altera': 26,
  'amakusa': 42,
  'anastasia': 72,
  'archer': 12,
  'arjuna-alter': 39,
  'ashwatthama': 80,
  'assassin': 92,
  'astolfo': 90,
  'atalanta': 96,
  'avicebron': 5,
  'barghest': 43,
  'bedivere': 99,
  'berserker': 67,
  'bhima': 56,
  'boudica': 7,
  'brynhildr': 36,
  'caster': 30,
  'castoria': 59,
  'charlemagne': 54,
  'chen-gong': 91,
  'circe': 51,
  'cu-chulainn-alter': 6,
  'darius-iii': 88,
  'diarmuid': 65,
  'drake': 93,
  'edmond-dantes': 17,
  'emiya': 76,
  'enkidu': 86,
  'ereshkigal': 25,
  'frankenstein': 11,
  'gawain': 68,
  'gilgamesh': 3,
  'gilles-de-rais': 84,
  'hakuno': 2,
  'hijikata': 60,
  'ibuki-douji': 94,
  'ishtar': 8,
  'ivan-the-terrible': 15,
  'jeanne': 16,
  'jeanne-alter': 81,
  'john-lackland': 62,
  'kagekiyo': 83,
  'kama': 1,
  'karna': 50,
  'kiara': 78,
  'king-hassan': 77,
  'koyanskaya': 71,
  'kukulkan': 95,
  'lancelot': 41,
  'lancer': 69,
  'mash': 29,
  'medusa': 52,
  'melusine': 79,
  'merlin': 40,
  'mordred': 98,
  'morgan-le-fay': 4,
  'moriarty': 97,
  'musashi': 47,
  'nero': 70,
  'noah': 45,
  'nobunaga': 66,
  'oberon': 75,
  'odysseus': 58,
  'okita-souji': 46,
  'orion': 32,
  'ozymandias': 38,
  'percival': 82,
  'quetzalcoatl': 44,
  'rama': 100,
  'richard': 10,
  'rider': 23,
  'robin-hood': 35,
  'romulus': 13,
  'romulus-quirinus': 37,
  'saber': 22,
  'saito': 89,
  'sakata-kintoki': 27,
  'samson': 63,
  'sasaki-kojiro': 74,
  'scathach': 64,
  'scathach-skadi': 31,
  'semiramis': 48,
  'sengo-muramasa': 19,
  'sherlock': 55,
  'siegfried': 87,
  'sigurd': 61,
  'solomon': 33,
  'spartacus': 49,
  'tamamo': 21,
  'tametomo': 28,
  'tezcatlipoca': 73,
  'the-ripper': 57,
  'tiamat': 18,
  'u-olga-marie': 20,
  'vlad-iii': 53,
  'william-tell': 34,
  'yagyu-munenori': 14,
  'zhuge-liang': 24,
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
