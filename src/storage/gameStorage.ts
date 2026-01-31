import { JOB_REGISTRY } from '../data/tracks';
import { db } from '../db/db';
import type { SaveFile } from '../db/schema';
import type { GameState } from '../types/gamestate';

export function generatePreview(state: GameState): SaveFile['preview'] {
  const job = JOB_REGISTRY[state.career.currentJobId] as { title: string } | undefined;
  const jobTitle = job !== undefined ? job.title : 'Unknown';
  const year = Math.floor(state.meta.tick / 52) + 1;
  const week = (state.meta.tick % 52) + 1;

  return {
    jobTitle,
    year,
    week,
    money: state.resources.money,
    stress: state.resources.stress,
  };
}

export async function createSave(state: GameState, isAutoSave: boolean): Promise<string> {
  const id = crypto.randomUUID();
  const now = Date.now();

  const saveFile: SaveFile = {
    id,
    version: state.meta.version,
    createdAt: now,
    updatedAt: now,
    isAutoSave,
    preview: generatePreview(state),
    data: state,
  };

  await db.saves.add(saveFile);
  return id;
}

export async function updateSave(id: string, state: GameState): Promise<void> {
  const existing = await db.saves.get(id);
  if (!existing) {
    throw new Error(`Save not found: ${id}`);
  }

  await db.saves.put({
    ...existing,
    updatedAt: Date.now(),
    preview: generatePreview(state),
    data: state,
  });
}

export async function loadSave(id: string): Promise<SaveFile | undefined> {
  return db.saves.get(id);
}

export async function listSaves(): Promise<SaveFile[]> {
  return db.saves.orderBy('updatedAt').reverse().toArray();
}

export async function deleteSave(id: string): Promise<void> {
  await db.saves.delete(id);
}
