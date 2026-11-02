import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 81,
  'alcides': 68,
  'altera': 29,
  'amakusa': 48,
  'anastasia': 73,
  'archer': 96,
  'arjuna-alter': 42,
  'ashwatthama': 91,
  'assassin': 94,
  'astolfo': 74,
  'atalanta': 95,
  'avicebron': 5,
  'barghest': 53,
  'bedivere': 100,
  'berserker': 69,
  'bhima': 62,
  'boudica': 4,
  'brynhildr': 41,
  'caster': 21,
  'castoria': 61,
  'charlemagne': 11,
  'chen-gong': 80,
  'circe': 49,
  'cu-chulainn-alter': 18,
  'darius-iii': 83,
  'diarmuid': 66,
  'drake': 92,
  'edmond-dantes': 23,
  'emiya': 88,
  'enkidu': 60,
  'ereshkigal': 30,
  'frankenstein': 15,
  'gawain': 76,
  'gilgamesh': 13,
  'gilles-de-rais': 82,
  'hakuno': 2,
  'hijikata': 77,
  'ibuki-douji': 86,
  'ishtar': 99,
  'ivan-the-terrible': 7,
  'jeanne': 19,
  'jeanne-alter': 71,
  'john-lackland': 58,
  'kagekiyo': 64,
  'kama': 63,
  'karna': 52,
  'kiara': 79,
  'king-hassan': 84,
  'koyanskaya': 85,
  'kukulkan': 90,
  'lancelot': 44,
  'lancer': 87,
  'mash': 36,
  'medusa': 6,
  'melusine': 72,
  'merlin': 37,
  'mordred': 14,
  'morgan-le-fay': 9,
  'moriarty': 97,
  'musashi': 38,
  'nero': 57,
  'noah': 43,
  'nobunaga': 67,
  'oberon': 65,
  'odysseus': 54,
  'okita-souji': 51,
  'orion': 39,
  'ozymandias': 50,
  'percival': 10,
  'quetzalcoatl': 93,
  'rama': 98,
  'richard': 16,
  'rider': 32,
  'robin-hood': 34,
  'romulus': 8,
  'romulus-quirinus': 17,
  'saber': 22,
  'saito': 89,
  'sakata-kintoki': 46,
  'samson': 70,
  'sasaki-kojiro': 78,
  'scathach': 47,
  'scathach-skadi': 33,
  'semiramis': 55,
  'sengo-muramasa': 40,
  'sherlock': 59,
  'siegfried': 1,
  'sigurd': 3,
  'solomon': 26,
  'spartacus': 25,
  'tamamo': 35,
  'tametomo': 45,
  'tezcatlipoca': 75,
  'the-ripper': 56,
  'tiamat': 12,
  'u-olga-marie': 20,
  'vlad-iii': 27,
  'william-tell': 28,
  'yagyu-munenori': 24,
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
