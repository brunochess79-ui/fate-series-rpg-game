import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 by wins alone (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 3,
  'alcides': 71,
  'altera': 22,
  'amakusa': 37,
  'anastasia': 68,
  'archer': 12,
  'arjuna-alter': 53,
  'ashwatthama': 82,
  'assassin': 95,
  'astolfo': 88,
  'atalanta': 98,
  'avicebron': 7,
  'barghest': 56,
  'bedivere': 100,
  'berserker': 83,
  'bhima': 62,
  'boudica': 15,
  'brynhildr': 46,
  'caster': 30,
  'castoria': 52,
  'charlemagne': 10,
  'chen-gong': 87,
  'circe': 55,
  'cu-chulainn-alter': 18,
  'darius-iii': 69,
  'diarmuid': 67,
  'drake': 77,
  'edmond-dantes': 23,
  'emiya': 74,
  'enkidu': 89,
  'ereshkigal': 34,
  'frankenstein': 8,
  'gawain': 76,
  'gilgamesh': 6,
  'gilles-de-rais': 75,
  'hakuno': 2,
  'hijikata': 72,
  'ibuki-douji': 80,
  'ishtar': 9,
  'ivan-the-terrible': 16,
  'jeanne': 11,
  'jeanne-alter': 91,
  'john-lackland': 65,
  'kagekiyo': 90,
  'kama': 1,
  'karna': 29,
  'kiara': 78,
  'king-hassan': 79,
  'koyanskaya': 86,
  'kukulkan': 94,
  'lancelot': 36,
  'lancer': 73,
  'mash': 28,
  'medusa': 49,
  'melusine': 81,
  'merlin': 54,
  'mordred': 99,
  'morgan-le-fay': 19,
  'moriarty': 92,
  'musashi': 51,
  'nero': 66,
  'noah': 39,
  'nobunaga': 84,
  'oberon': 85,
  'odysseus': 59,
  'okita-souji': 31,
  'orion': 42,
  'ozymandias': 47,
  'percival': 96,
  'quetzalcoatl': 43,
  'rama': 97,
  'richard': 13,
  'rider': 35,
  'robin-hood': 45,
  'romulus': 14,
  'romulus-quirinus': 41,
  'saber': 25,
  'saito': 93,
  'sakata-kintoki': 48,
  'samson': 64,
  'sasaki-kojiro': 70,
  'scathach': 60,
  'scathach-skadi': 32,
  'semiramis': 33,
  'sengo-muramasa': 26,
  'sherlock': 58,
  'siegfried': 5,
  'sigurd': 4,
  'solomon': 50,
  'spartacus': 57,
  'tamamo': 24,
  'tametomo': 44,
  'tezcatlipoca': 63,
  'the-ripper': 61,
  'tiamat': 20,
  'u-olga-marie': 21,
  'vlad-iii': 38,
  'william-tell': 27,
  'yagyu-munenori': 17,
  'zhuge-liang': 40,
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
