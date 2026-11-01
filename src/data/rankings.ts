import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 5,
  'alcides': 80,
  'altera': 25,
  'amakusa': 51,
  'anastasia': 62,
  'archer': 11,
  'arjuna-alter': 45,
  'ashwatthama': 78,
  'assassin': 88,
  'astolfo': 68,
  'atalanta': 98,
  'avicebron': 14,
  'barghest': 56,
  'bedivere': 100,
  'berserker': 64,
  'bhima': 79,
  'boudica': 17,
  'brynhildr': 33,
  'caster': 26,
  'castoria': 54,
  'charlemagne': 9,
  'chen-gong': 85,
  'circe': 27,
  'cu-chulainn-alter': 22,
  'darius-iii': 86,
  'diarmuid': 74,
  'drake': 84,
  'edmond-dantes': 21,
  'emiya': 81,
  'enkidu': 94,
  'ereshkigal': 40,
  'frankenstein': 15,
  'gawain': 76,
  'gilgamesh': 7,
  'gilles-de-rais': 82,
  'hakuno': 3,
  'hijikata': 66,
  'ibuki-douji': 83,
  'ishtar': 10,
  'ivan-the-terrible': 23,
  'jeanne': 6,
  'jeanne-alter': 93,
  'john-lackland': 67,
  'kagekiyo': 89,
  'kama': 1,
  'karna': 39,
  'kiara': 69,
  'king-hassan': 87,
  'koyanskaya': 91,
  'kukulkan': 92,
  'lancelot': 41,
  'lancer': 72,
  'mash': 52,
  'medusa': 60,
  'melusine': 77,
  'merlin': 46,
  'mordred': 99,
  'morgan-le-fay': 13,
  'moriarty': 96,
  'musashi': 48,
  'nero': 73,
  'noah': 53,
  'nobunaga': 75,
  'oberon': 90,
  'odysseus': 55,
  'okita-souji': 30,
  'orion': 38,
  'ozymandias': 50,
  'percival': 2,
  'quetzalcoatl': 35,
  'rama': 97,
  'richard': 12,
  'rider': 32,
  'robin-hood': 47,
  'romulus': 16,
  'romulus-quirinus': 57,
  'saber': 31,
  'saito': 95,
  'sakata-kintoki': 59,
  'samson': 71,
  'sasaki-kojiro': 61,
  'scathach': 65,
  'scathach-skadi': 34,
  'semiramis': 43,
  'sengo-muramasa': 36,
  'sherlock': 58,
  'siegfried': 8,
  'sigurd': 4,
  'solomon': 49,
  'spartacus': 44,
  'tamamo': 19,
  'tametomo': 42,
  'tezcatlipoca': 70,
  'the-ripper': 63,
  'tiamat': 18,
  'u-olga-marie': 24,
  'vlad-iii': 28,
  'william-tell': 29,
  'yagyu-munenori': 20,
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
