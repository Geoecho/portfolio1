import type { RushMode } from './typeRush';

type RecordData = { day: string; dailyBest: number; practiceBest: number };
export type RushRecords = RecordData & { persistent: boolean };
const key = 'portfolio-tool-rush-v1';
let memory: RecordData = { day: '', dailyBest: 0, practiceBest: 0 };
const validScore = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 100000 ? value : 0;

export function readRushRecords(day: string): RushRecords {
  let persistent = false;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const data = parsed as Partial<RecordData>;
        memory = { day, dailyBest: Math.max(memory.day === day ? memory.dailyBest : 0, data.day === day ? validScore(data.dailyBest) : 0), practiceBest: Math.max(memory.practiceBest, validScore(data.practiceBest)) };
      }
    }
    persistent = true;
  } catch { /* Continue with this visit's scores when storage is blocked. */ }
  if (memory.day !== day) memory = { day, dailyBest: 0, practiceBest: memory.practiceBest };
  return { ...memory, persistent };
}

export function saveRushRecord(day: string, mode: RushMode, score: number): RushRecords {
  const records = readRushRecords(day);
  const field = mode === 'rush' ? 'dailyBest' : 'practiceBest';
  const next: RecordData = { day, dailyBest: records.dailyBest, practiceBest: records.practiceBest, [field]: Math.max(records[field], validScore(score)) };
  memory = next;
  try { localStorage.setItem(key, JSON.stringify(next)); return { ...next, persistent: true }; }
  catch { return { ...next, persistent: false }; }
}
