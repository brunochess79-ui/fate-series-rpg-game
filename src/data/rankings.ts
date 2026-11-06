import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 74,
  'alcides': 77,
  'altera': 27,
  'amakusa': 49,
  'anastasia': 63,
  'archer': 55,
  'arjuna-alter': 47,
  'ashwatthama': 93,
  'assassin': 91,
  'astolfo': 81,
  'atalanta': 97,
  'avicebron': 15,
  'barghest': 54,
  'bedivere': 100,
  'berserker': 60,
  'bhima': 70,
  'boudica': 11,
  'brynhildr': 32,
  'caster': 19,
  'castoria': 61,
  'charlemagne': 13,
  'chen-gong': 86,
  'circe': 39,
  'cu-chulainn-alter': 22,
  'darius-iii': 80,
  'diarmuid': 66,
  'drake': 92,
  'edmond-dantes': 23,
  'emiya': 84,
  'enkidu': 51,
  'ereshkigal': 28,
  'frankenstein': 9,
  'gawain': 76,
  'gilgamesh': 12,
  'gilles-de-rais': 82,
  'hakuno': 4,
  'hijikata': 68,
  'ibuki-douji': 88,
  'ishtar': 99,
  'ivan-the-terrible': 17,
  'jeanne': 1,
  'jeanne-alter': 69,
  'john-lackland': 62,
  'kagekiyo': 78,
  'kama': 64,
  'karna': 45,
  'kiara': 75,
  'king-hassan': 89,
  'koyanskaya': 79,
  'kukulkan': 90,
  'lancelot': 44,
  'lancer': 87,
  'mash': 36,
  'medusa': 8,
  'melusine': 85,
  'merlin': 30,
  'mordred': 10,
  'morgan-le-fay': 7,
  'moriarty': 98,
  'musashi': 42,
  'nero': 67,
  'noah': 53,
  'nobunaga': 72,
  'oberon': 73,
  'odysseus': 65,
  'okita-souji': 48,
  'orion': 43,
  'ozymandias': 46,
  'percival': 5,
  'quetzalcoatl': 95,
  'rama': 96,
  'richard': 14,
  'rider': 29,
  'robin-hood': 41,
  'romulus': 25,
  'romulus-quirinus': 3,
  'saber': 26,
  'saito': 94,
  'sakata-kintoki': 50,
  'samson': 57,
  'sasaki-kojiro': 83,
  'scathach': 52,
  'scathach-skadi': 38,
  'semiramis': 58,
  'sengo-muramasa': 40,
  'sherlock': 59,
  'siegfried': 6,
  'sigurd': 2,
  'solomon': 31,
  'spartacus': 20,
  'tamamo': 24,
  'tametomo': 35,
  'tezcatlipoca': 71,
  'the-ripper': 56,
  'tiamat': 18,
  'u-olga-marie': 16,
  'vlad-iii': 37,
  'william-tell': 33,
  'yagyu-munenori': 21,
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
