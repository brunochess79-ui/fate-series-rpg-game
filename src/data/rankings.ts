import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 5,
  'alcides': 72,
  'altera': 30,
  'amakusa': 58,
  'anastasia': 65,
  'archer': 14,
  'arjuna-alter': 45,
  'ashwatthama': 89,
  'assassin': 88,
  'astolfo': 74,
  'atalanta': 100,
  'avicebron': 13,
  'barghest': 56,
  'bedivere': 98,
  'berserker': 76,
  'bhima': 63,
  'boudica': 3,
  'brynhildr': 36,
  'caster': 29,
  'castoria': 55,
  'charlemagne': 8,
  'chen-gong': 85,
  'circe': 46,
  'cu-chulainn-alter': 20,
  'darius-iii': 81,
  'diarmuid': 68,
  'drake': 92,
  'edmond-dantes': 23,
  'emiya': 84,
  'enkidu': 62,
  'ereshkigal': 40,
  'frankenstein': 19,
  'gawain': 86,
  'gilgamesh': 7,
  'gilles-de-rais': 79,
  'hakuno': 4,
  'hijikata': 70,
  'ibuki-douji': 94,
  'ishtar': 10,
  'ivan-the-terrible': 11,
  'jeanne': 12,
  'jeanne-alter': 99,
  'john-lackland': 71,
  'kagekiyo': 91,
  'kama': 1,
  'karna': 38,
  'kiara': 77,
  'king-hassan': 90,
  'koyanskaya': 75,
  'kukulkan': 93,
  'lancelot': 41,
  'lancer': 87,
  'mash': 33,
  'medusa': 22,
  'melusine': 83,
  'merlin': 49,
  'mordred': 96,
  'morgan-le-fay': 15,
  'moriarty': 97,
  'musashi': 44,
  'nero': 66,
  'noah': 35,
  'nobunaga': 80,
  'oberon': 78,
  'odysseus': 59,
  'okita-souji': 43,
  'orion': 42,
  'ozymandias': 53,
  'percival': 2,
  'quetzalcoatl': 61,
  'rama': 95,
  'richard': 16,
  'rider': 24,
  'robin-hood': 34,
  'romulus': 17,
  'romulus-quirinus': 52,
  'saber': 26,
  'saito': 82,
  'sakata-kintoki': 60,
  'samson': 67,
  'sasaki-kojiro': 69,
  'scathach': 57,
  'scathach-skadi': 39,
  'semiramis': 47,
  'sengo-muramasa': 31,
  'sherlock': 54,
  'siegfried': 9,
  'sigurd': 6,
  'solomon': 50,
  'spartacus': 51,
  'tamamo': 27,
  'tametomo': 48,
  'tezcatlipoca': 73,
  'the-ripper': 64,
  'tiamat': 18,
  'u-olga-marie': 25,
  'vlad-iii': 28,
  'william-tell': 32,
  'yagyu-munenori': 21,
  'zhuge-liang': 37,
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
