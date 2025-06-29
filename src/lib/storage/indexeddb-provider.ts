import type { AsyncStorageProvider, StorageProvider } from "../types"

/**
 * Provedor de armazenamento usando IndexedDB
 * Exemplo de como implementar outros provedores de armazenamento
 */
export class IndexedDBProvider implements AsyncStorageProvider {
  private readonly dbName: string
  private readonly storeName: string
  private readonly version: number
  private db: IDBDatabase | null = null

  constructor(dbName: string = "sumo-rpg-db", storeName: string = "game-data", version: number = 1) {
    this.dbName = dbName
    this.storeName = storeName
    this.version = version
  }

  /**
   * Inicializa a conexão com o IndexedDB
   */
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("IndexedDB não disponível no servidor"))
        return
      }

      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error("Erro ao abrir IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "key" })
        }
      }
    })
  }

  /**
   * Obtém um valor do IndexedDB
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readonly")
        const store = transaction.objectStore(this.storeName)
        const request = store.get(key)

        request.onerror = () => reject(new Error("Erro ao ler dados"))
        request.onsuccess = () => {
          const result = request.result
          resolve(result ? result.value : null)
        }
      })
    } catch (error) {
      console.error("Erro ao obter dados do IndexedDB:", error)
      return null
    }
  }

  /**
   * Define um valor no IndexedDB
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.put({ key, value })

        request.onerror = () => reject(new Error("Erro ao salvar dados"))
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.error("Erro ao salvar dados no IndexedDB:", error)
      throw new Error(`Erro ao salvar ${key}: ${error}`)
    }
  }

  /**
   * Remove um item do IndexedDB
   */
  async remove(key: string): Promise<void> {
    try {
      const db = await this.initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(key)

        request.onerror = () => reject(new Error("Erro ao remover dados"))
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.error("Erro ao remover dados do IndexedDB:", error)
    }
  }

  /**
   * Limpa todos os dados do IndexedDB
   */
  async clear(): Promise<void> {
    try {
      const db = await this.initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], "readwrite")
        const store = transaction.objectStore(this.storeName)
        const request = store.clear()

        request.onerror = () => reject(new Error("Erro ao limpar dados"))
        request.onsuccess = () => resolve()
      })
    } catch (error) {
      console.error("Erro ao limpar dados do IndexedDB:", error)
    }
  }

  /**
   * Verifica se um item existe no IndexedDB
   */
  async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key)
      return value !== null
    } catch (error) {
      return false
    }
  }

  /**
   * Fecha a conexão com o IndexedDB
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

/**
 * Provedor de armazenamento usando SessionStorage
 * Exemplo de provedor mais simples
 */
export class SessionStorageProvider implements StorageProvider {
  private readonly prefix: string

  constructor(prefix: string = "sumo-rpg") {
    this.prefix = prefix
  }

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const fullKey = `${this.prefix}:${key}`
      const item = sessionStorage.getItem(fullKey)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Erro ao obter dados do SessionStorage:", error)
      return null
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return

    try {
      const fullKey = `${this.prefix}:${key}`
      sessionStorage.setItem(fullKey, JSON.stringify(value))
    } catch (error) {
      console.error("Erro ao salvar dados no SessionStorage:", error)
      throw new Error(`Erro ao salvar ${key}: ${error}`)
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return

    try {
      const fullKey = `${this.prefix}:${key}`
      sessionStorage.removeItem(fullKey)
    } catch (error) {
      console.error("Erro ao remover dados do SessionStorage:", error)
    }
  }

  clear(): void {
    if (typeof window === "undefined") return

    try {
      const keysToRemove: string[] = []
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach(key => sessionStorage.removeItem(key))
    } catch (error) {
      console.error("Erro ao limpar dados do SessionStorage:", error)
    }
  }

  has(key: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const fullKey = `${this.prefix}:${key}`
      return sessionStorage.getItem(fullKey) !== null
    } catch (error) {
      return false
    }
  }
} 