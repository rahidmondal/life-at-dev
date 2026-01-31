import type { Table } from 'dexie';
import Dexie from 'dexie';
import type { SaveFile } from './schema';

export class LifeDevDB extends Dexie {
  saves!: Table<SaveFile, string>;

  constructor() {
    super('LifeAtDevDB');

    this.version(1).stores({
      saves: 'id, version, updatedAt, isAutoSave',
    });
  }
}

export const db = new LifeDevDB();
