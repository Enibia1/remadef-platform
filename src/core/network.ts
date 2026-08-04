/* ==========================================================
   REMADEF PLATFORM
   Core Network State Manager
   File: src/core/network.ts
========================================================== */

import Logger from "../utils/logger";
import Storage from "../utils/storage"; // Centralized Storage Layer

export type ConnectionQuality = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
export type NetworkEventListener = (isOnline: boolean) => void;

export interface SerializedQueuedRequest {
  id: string;
  endpoint: string;
  config: unknown;
  timestamp: number;
}

export interface QueuedRequest {
  id: string;
  execute: () => Promise<unknown>;
  timestamp: number;
}

const OFFLINE_QUEUE_STORAGE_KEY = 'remadef_offline_queue';

class NetworkManager {
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<NetworkEventListener> = new Set();
  private requestQueue: QueuedRequest[] = [];
  private serializedQueue: SerializedQueuedRequest[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
    this.loadPersistedQueue();
  }

  private loadPersistedQueue(): void {
    try {
      const stored = Storage.get<SerializedQueuedRequest[]>(OFFLINE_QUEUE_STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        this.serializedQueue = stored;
        Logger.info(`Loaded ${stored.length} persisted offline requests from storage.`);
      }
    } catch (error) {
      Logger.error("Failed to load persisted offline queue:", error);
    }
  }

  private savePersistedQueue(): void {
    try {
      Storage.set(OFFLINE_QUEUE_STORAGE_KEY, this.serializedQueue);
    } catch (error) {
      Logger.error("Failed to persist offline queue to storage:", error);
    }
  }

  private handleOnline = (): void => {
    this.isOnlineStatus = true;
    Logger.info("Network connection restored.");
    this.notifyListeners();
    this.processQueue();
  };

  private handleOffline = (): void => {
    this.isOnlineStatus = false;
    Logger.warn("Network connection lost.");
    this.notifyListeners();
  };

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isOnlineStatus));
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public getConnectionQuality(): ConnectionQuality {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as unknown as { connection?: { effectiveType?: ConnectionQuality } }).connection;
      return conn?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  public subscribe(listener: NetworkEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public queueRequest(id: string, execute: () => Promise<unknown>, serializedData?: { endpoint: string; config: unknown }): void {
    Logger.info(`Queueing request [${id}] for offline sync.`);
    this.requestQueue.push({ id, execute, timestamp: Date.now() });

    if (serializedData) {
      this.serializedQueue.push({
        id,
        endpoint: serializedData.endpoint,
        config: serializedData.config,
        timestamp: Date.now(),
      });
      this.savePersistedQueue();
    }
  }

  public async processQueue(rehydrator?: (item: SerializedQueuedRequest) => Promise<unknown>): Promise<void> {
    if (!this.isOnlineStatus) return;

    // Process in-memory queue first
    if (this.requestQueue.length > 0) {
      Logger.info(`Processing ${this.requestQueue.length} in-memory queued offline requests.`);
      const queue = [...this.requestQueue];
      this.requestQueue = [];

      for (const item of queue) {
        try {
          await item.execute();
          Logger.info(`Successfully processed queued request [${item.id}].`);
        } catch (error) {
          Logger.error(`Failed to process queued request [${item.id}]:`, error);
        }
      }
    }

    // Process rehydrated serialized queue from storage if rehydrator is provided
    if (rehydrator && this.serializedQueue.length > 0) {
      Logger.info(`Processing ${this.serializedQueue.length} persisted queued offline requests.`);
      const queue = [...this.serializedQueue];
      this.serializedQueue = [];
      this.savePersistedQueue();

      for (const item of queue) {
        try {
          await rehydrator(item);
          Logger.info(`Successfully processed persisted queued request [${item.id}].`);
        } catch (error) {
          Logger.error(`Failed to process persisted queued request [${item.id}]:`, error);
        }
      }
    }
  }

  public clearQueue(): void {
    this.requestQueue = [];
    this.serializedQueue = [];
    Storage.remove(OFFLINE_QUEUE_STORAGE_KEY);
  }
}

export const Network = new NetworkManager();
export default Network;
