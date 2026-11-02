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
  'amakusa': 51,
  'anastasia': 76,
  'archer': 18,
  'arjuna-alter': 53,
  'ashwatthama': 82,
  'assassin': 94,
  'astolfo': 75,
  'atalanta': 97,
  'avicebron': 11,
  'barghest': 52,
  'bedivere': 100,
  'berserker': 69,
  'bhima': 63,
  'boudica': 4,
  'brynhildr': 45,
  'caster': 27,
  'castoria': 59,
  'charlemagne': 16,
  'chen-gong': 89,
  'circe': 44,
  'cu-chulainn-alter': 28,
  'darius-iii': 84,
  'diarmuid': 67,
  'drake': 92,
  'edmond-dantes': 23,
  'emiya': 79,
  'enkidu': 68,
  'ereshkigal': 43,
  'frankenstein': 15,
  'gawain': 65,
  'gilgamesh': 14,
  'gilles-de-rais': 85,
  'hakuno': 1,
  'hijikata': 64,
  'ibuki-douji': 88,
  'ishtar': 17,
  'ivan-the-terrible': 8,
  'jeanne': 12,
  'jeanne-alter': 86,
  'john-lackland': 70,
  'kagekiyo': 87,
  'kama': 2,
  'karna': 39,
  'kiara': 90,
  'king-hassan': 96,
  'koyanskaya': 73,
  'kukulkan': 93,
  'lancelot': 57,
  'lancer': 72,
  'mash': 50,
  'medusa': 20,
  'melusine': 80,
  'merlin': 31,
  'mordred': 22,
  'morgan-le-fay': 6,
  'moriarty': 98,
  'musashi': 37,
  'nero': 78,
  'noah': 55,
  'nobunaga': 83,
  'oberon': 91,
  'odysseus': 60,
  'okita-souji': 47,
  'orion': 41,
  'ozymandias': 49,
  'percival': 19,
  'quetzalcoatl': 3,
  'rama': 99,
  'richard': 21,
  'rider': 38,
  'robin-hood': 54,
  'romulus': 10,
  'romulus-quirinus': 56,
  'saber': 25,
  'saito': 95,
  'sakata-kintoki': 58,
  'samson': 81,
  'sasaki-kojiro': 74,
  'scathach': 62,
  'scathach-skadi': 36,
  'semiramis': 46,
  'sengo-muramasa': 24,
  'sherlock': 61,
  'siegfried': 7,
  'sigurd': 9,
  'solomon': 48,
  'spartacus': 29,
  'tamamo': 30,
  'tametomo': 40,
  'tezcatlipoca': 77,
  'the-ripper': 66,
  'tiamat': 13,
  'u-olga-marie': 26,
  'vlad-iii': 42,
  'william-tell': 33,
  'yagyu-munenori': 32,
  'zhuge-liang': 35,
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
