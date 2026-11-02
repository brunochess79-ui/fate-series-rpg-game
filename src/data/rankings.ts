import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 6,
  'alcides': 81,
  'altera': 35,
  'amakusa': 39,
  'anastasia': 69,
  'archer': 18,
  'arjuna-alter': 49,
  'ashwatthama': 72,
  'assassin': 95,
  'astolfo': 84,
  'atalanta': 97,
  'avicebron': 15,
  'barghest': 53,
  'bedivere': 100,
  'berserker': 71,
  'bhima': 62,
  'boudica': 5,
  'brynhildr': 50,
  'caster': 21,
  'castoria': 55,
  'charlemagne': 14,
  'chen-gong': 90,
  'circe': 52,
  'cu-chulainn-alter': 26,
  'darius-iii': 91,
  'diarmuid': 74,
  'drake': 86,
  'edmond-dantes': 27,
  'emiya': 78,
  'enkidu': 76,
  'ereshkigal': 45,
  'frankenstein': 13,
  'gawain': 67,
  'gilgamesh': 11,
  'gilles-de-rais': 93,
  'hakuno': 3,
  'hijikata': 70,
  'ibuki-douji': 87,
  'ishtar': 19,
  'ivan-the-terrible': 10,
  'jeanne': 9,
  'jeanne-alter': 83,
  'john-lackland': 65,
  'kagekiyo': 80,
  'kama': 1,
  'karna': 48,
  'kiara': 66,
  'king-hassan': 92,
  'koyanskaya': 88,
  'kukulkan': 94,
  'lancelot': 47,
  'lancer': 82,
  'mash': 46,
  'medusa': 23,
  'melusine': 89,
  'merlin': 40,
  'mordred': 98,
  'morgan-le-fay': 12,
  'moriarty': 99,
  'musashi': 41,
  'nero': 64,
  'noah': 44,
  'nobunaga': 75,
  'oberon': 68,
  'odysseus': 60,
  'okita-souji': 54,
  'orion': 43,
  'ozymandias': 51,
  'percival': 2,
  'quetzalcoatl': 4,
  'rama': 96,
  'richard': 16,
  'rider': 38,
  'robin-hood': 37,
  'romulus': 8,
  'romulus-quirinus': 59,
  'saber': 24,
  'saito': 85,
  'sakata-kintoki': 57,
  'samson': 77,
  'sasaki-kojiro': 73,
  'scathach': 63,
  'scathach-skadi': 42,
  'semiramis': 56,
  'sengo-muramasa': 33,
  'sherlock': 58,
  'siegfried': 17,
  'sigurd': 7,
  'solomon': 32,
  'spartacus': 25,
  'tamamo': 28,
  'tametomo': 30,
  'tezcatlipoca': 79,
  'the-ripper': 61,
  'tiamat': 20,
  'u-olga-marie': 22,
  'vlad-iii': 36,
  'william-tell': 34,
  'yagyu-munenori': 29,
  'zhuge-liang': 31,
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
