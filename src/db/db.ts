import Dexie from 'dexie';

export class LifeDevDB extends Dexie {
  constructor() {
    super('LifeAtDevDB');
    this.version(1).stores({});
  }
}

export const db = new LifeDevDB();
