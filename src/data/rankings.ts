import type { ServantDefinition } from '../types';

/**
 * Exact leaderboard position (1 = strongest) of every Servant, from the
 * best-line round-robin tournament scored with a bonus for wins against the
 * top 15 (see the README). The rating letter on each Servant is handed out
 * from this same order.
 */
export const SERVANT_RANK_POSITION: Record<string, number> = {
  'achilles': 4,
  'alcides': 60,
  'altera': 23,
  'amakusa': 44,
  'anastasia': 63,
  'archer': 11,
  'arjuna-alter': 47,
  'ashwatthama': 87,
  'assassin': 95,
  'astolfo': 74,
  'atalanta': 100,
  'avicebron': 7,
  'barghest': 46,
  'bedivere': 99,
  'berserker': 71,
  'bhima': 61,
  'boudica': 3,
  'brynhildr': 34,
  'caster': 28,
  'castoria': 43,
  'charlemagne': 56,
  'chen-gong': 88,
  'circe': 42,
  'cu-chulainn-alter': 15,
  'darius-iii': 80,
  'diarmuid': 66,
  'drake': 89,
  'edmond-dantes': 19,
  'emiya': 85,
  'enkidu': 93,
  'ereshkigal': 27,
  'frankenstein': 12,
  'gawain': 75,
  'gilgamesh': 6,
  'gilles-de-rais': 82,
  'hakuno': 1,
  'hijikata': 65,
  'ibuki-douji': 86,
  'ishtar': 8,
  'ivan-the-terrible': 16,
  'jeanne': 17,
  'jeanne-alter': 90,
  'john-lackland': 72,
  'kagekiyo': 84,
  'kama': 2,
  'karna': 35,
  'kiara': 78,
  'king-hassan': 81,
  'koyanskaya': 73,
  'kukulkan': 92,
  'lancelot': 37,
  'lancer': 76,
  'mash': 22,
  'medusa': 49,
  'melusine': 69,
  'merlin': 36,
  'mordred': 98,
  'morgan-le-fay': 5,
  'moriarty': 96,
  'musashi': 45,
  'nero': 68,
  'noah': 33,
  'nobunaga': 70,
  'oberon': 79,
  'odysseus': 57,
  'okita-souji': 38,
  'orion': 39,
  'ozymandias': 51,
  'percival': 83,
  'quetzalcoatl': 53,
  'rama': 97,
  'richard': 9,
  'rider': 25,
  'robin-hood': 20,
  'romulus': 10,
  'romulus-quirinus': 48,
  'saber': 24,
  'saito': 91,
  'sakata-kintoki': 32,
  'samson': 64,
  'sasaki-kojiro': 67,
  'scathach': 59,
  'scathach-skadi': 30,
  'semiramis': 54,
  'sengo-muramasa': 29,
  'sherlock': 52,
  'siegfried': 94,
  'sigurd': 58,
  'solomon': 50,
  'spartacus': 55,
  'tamamo': 18,
  'tametomo': 41,
  'tezcatlipoca': 77,
  'the-ripper': 62,
  'tiamat': 21,
  'u-olga-marie': 13,
  'vlad-iii': 40,
  'william-tell': 26,
  'yagyu-munenori': 14,
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
