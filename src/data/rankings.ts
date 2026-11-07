import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 82,
  'alcides': 71,
  'altera': 27,
  'amakusa': 46,
  'anastasia': 63,
  'archer': 53,
  'arjuna-alter': 48,
  'ashwatthama': 83,
  'assassin': 92,
  'astolfo': 81,
  'atalanta': 97,
  'avicebron': 15,
  'barghest': 52,
  'bedivere': 100,
  'berserker': 68,
  'bhima': 65,
  'boudica': 12,
  'brynhildr': 32,
  'caster': 18,
  'castoria': 58,
  'charlemagne': 9,
  'chen-gong': 87,
  'circe': 41,
  'cu-chulainn-alter': 17,
  'darius-iii': 84,
  'diarmuid': 67,
  'drake': 91,
  'edmond-dantes': 25,
  'emiya': 93,
  'enkidu': 54,
  'ereshkigal': 29,
  'frankenstein': 7,
  'gawain': 79,
  'gilgamesh': 13,
  'gilles-de-rais': 85,
  'hakuno': 2,
  'hijikata': 69,
  'ibuki-douji': 88,
  'ishtar': 99,
  'ivan-the-terrible': 19,
  'jeanne': 1,
  'jeanne-alter': 70,
  'john-lackland': 62,
  'kagekiyo': 73,
  'kama': 66,
  'karna': 50,
  'kiara': 72,
  'king-hassan': 90,
  'koyanskaya': 77,
  'kukulkan': 86,
  'lancelot': 38,
  'lancer': 89,
  'mash': 39,
  'medusa': 5,
  'melusine': 80,
  'merlin': 35,
  'mordred': 10,
  'morgan-le-fay': 8,
  'moriarty': 98,
  'musashi': 49,
  'nero': 64,
  'noah': 51,
  'nobunaga': 74,
  'oberon': 75,
  'odysseus': 57,
  'okita-souji': 42,
  'orion': 43,
  'ozymandias': 47,
  'percival': 11,
  'quetzalcoatl': 95,
  'rama': 96,
  'richard': 14,
  'rider': 30,
  'robin-hood': 44,
  'romulus': 23,
  'romulus-quirinus': 4,
  'saber': 24,
  'saito': 94,
  'sakata-kintoki': 45,
  'samson': 59,
  'sasaki-kojiro': 78,
  'scathach': 56,
  'scathach-skadi': 37,
  'semiramis': 55,
  'sengo-muramasa': 40,
  'sherlock': 61,
  'siegfried': 6,
  'sigurd': 3,
  'solomon': 33,
  'spartacus': 21,
  'tamamo': 26,
  'tametomo': 36,
  'tezcatlipoca': 76,
  'the-ripper': 60,
  'tiamat': 22,
  'u-olga-marie': 16,
  'vlad-iii': 31,
  'william-tell': 28,
  'yagyu-munenori': 20,
  'zhuge-liang': 34,
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
