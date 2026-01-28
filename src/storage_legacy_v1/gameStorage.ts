import { GameState } from '@/context/gameReducer';

const DB_NAME = 'life-dev-db';
const DB_VERSION = 1;
const STORE_NAME = 'saves';
const SAVE_KEY = 'current';
const CURRENT_VERSION = '1.0';

interface SaveRecord {
  id: string;
  gameState: GameState;
  metadata: {
    savedAt: number;
    version: string;
    autosave: boolean;
  };
}

function isIndexedDBAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  } catch {
    return false;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('Storage unavailable'));
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    } catch {
      reject(new Error('Database open failed'));
    }
  });
}

export async function saveGame(gameState: GameState, autosave: boolean): Promise<void> {
  try {
    const db = await openDatabase();

    const saveRecord: SaveRecord = {
      id: SAVE_KEY,
      gameState: gameState,
      metadata: {
        savedAt: Date.now(),
        version: CURRENT_VERSION,
        autosave,
      },
    };

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(saveRecord);

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = () => {
        db.close();
        reject(new Error('Save operation failed'));
      };
    });
  } catch (error) {
    console.error('Game save failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function loadGame(): Promise<GameState | null> {
  try {
    const db = await openDatabase();

    return await new Promise<GameState | null>(resolve => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(SAVE_KEY);

      request.onsuccess = () => {
        db.close();
        const result = request.result as SaveRecord | undefined;

        if (!result) {
          resolve(null);
          return;
        }

        if (result.metadata.version !== CURRENT_VERSION) {
          console.error('Save version mismatch - starting fresh');
          resolve(null);
          return;
        }

        resolve(result.gameState);
      };

      request.onerror = () => {
        db.close();
        console.error('Game load failed');
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Game load failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function clearSave(): Promise<void> {
  try {
    const db = await openDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(SAVE_KEY);

      request.onsuccess = () => {
        db.close();
        resolve();
      };

      request.onerror = () => {
        db.close();
        reject(new Error('Clear operation failed'));
      };
    });
  } catch (error) {
    console.error('Clear save failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function hasSave(): Promise<boolean> {
  try {
    const db = await openDatabase();

    return await new Promise<boolean>(resolve => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(SAVE_KEY);

      request.onsuccess = () => {
        db.close();
        const result = request.result as SaveRecord | undefined;

        if (result?.metadata.version === CURRENT_VERSION) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      request.onerror = () => {
        db.close();
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Check save failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export function isStorageAvailable(): boolean {
  return isIndexedDBAvailable();
}
