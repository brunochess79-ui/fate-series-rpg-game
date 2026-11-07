import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 89,
  'alcides': 72,
  'altera': 25,
  'amakusa': 44,
  'anastasia': 64,
  'archer': 58,
  'arjuna-alter': 50,
  'ashwatthama': 84,
  'assassin': 93,
  'astolfo': 74,
  'atalanta': 97,
  'avicebron': 16,
  'barghest': 55,
  'bedivere': 98,
  'berserker': 66,
  'bhima': 12,
  'boudica': 15,
  'brynhildr': 35,
  'caster': 21,
  'castoria': 61,
  'charlemagne': 8,
  'chen-gong': 86,
  'circe': 34,
  'cu-chulainn-alter': 20,
  'darius-iii': 80,
  'diarmuid': 68,
  'drake': 90,
  'edmond-dantes': 26,
  'emiya': 91,
  'enkidu': 52,
  'ereshkigal': 32,
  'frankenstein': 4,
  'gawain': 77,
  'gilgamesh': 14,
  'gilles-de-rais': 88,
  'hakuno': 5,
  'hijikata': 69,
  'ibuki-douji': 94,
  'ishtar': 99,
  'ivan-the-terrible': 17,
  'jeanne': 1,
  'jeanne-alter': 65,
  'john-lackland': 60,
  'kagekiyo': 73,
  'kama': 63,
  'karna': 51,
  'kiara': 75,
  'king-hassan': 87,
  'koyanskaya': 79,
  'kukulkan': 83,
  'lancelot': 42,
  'lancer': 82,
  'mash': 41,
  'medusa': 7,
  'melusine': 78,
  'merlin': 39,
  'mordred': 11,
  'morgan-le-fay': 10,
  'moriarty': 100,
  'musashi': 47,
  'nero': 70,
  'noah': 53,
  'nobunaga': 81,
  'oberon': 76,
  'odysseus': 49,
  'okita-souji': 48,
  'orion': 36,
  'ozymandias': 43,
  'percival': 9,
  'quetzalcoatl': 95,
  'rama': 96,
  'richard': 18,
  'rider': 31,
  'robin-hood': 45,
  'romulus': 28,
  'romulus-quirinus': 3,
  'saber': 24,
  'saito': 92,
  'sakata-kintoki': 54,
  'samson': 62,
  'sasaki-kojiro': 71,
  'scathach': 59,
  'scathach-skadi': 46,
  'semiramis': 57,
  'sengo-muramasa': 33,
  'sherlock': 67,
  'siegfried': 6,
  'sigurd': 2,
  'solomon': 37,
  'spartacus': 27,
  'tamamo': 23,
  'tametomo': 38,
  'tezcatlipoca': 85,
  'the-ripper': 56,
  'tiamat': 22,
  'u-olga-marie': 13,
  'vlad-iii': 40,
  'william-tell': 29,
  'yagyu-munenori': 19,
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
