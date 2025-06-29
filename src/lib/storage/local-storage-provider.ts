import type { StorageProvider } from "../types"

/**
 * Provedor de armazenamento usando localStorage do navegador
 * Implementa a interface StorageProvider para ser agnóstico
 */
export class LocalStorageProvider implements StorageProvider {
  private readonly prefix: string
  private readonly enableLogging: boolean

  constructor(prefix: string = "sumo-rpg", enableLogging: boolean = false) {
    this.prefix = prefix
    this.enableLogging = enableLogging
  }

  /**
   * Obtém um valor do localStorage
   * @param key - Chave do item
   * @returns Valor deserializado ou null se não existir
   */
  get<T>(key: string): T | null {
    if (typeof window === "undefined") {
      this.log("get", key, "SSR - retornando null")
      return null
    }

    try {
      const fullKey = this.getFullKey(key)
      const item = localStorage.getItem(fullKey)
      
      if (item === null) {
        this.log("get", key, "Item não encontrado")
        return null
      }

      const parsed = JSON.parse(item)
      this.log("get", key, "Sucesso", parsed)
      return parsed
    } catch (error) {
      this.log("get", key, "Erro ao deserializar", error)
      return null
    }
  }

  /**
   * Define um valor no localStorage
   * @param key - Chave do item
   * @param value - Valor a ser salvo
   */
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
      this.log("set", key, "SSR - ignorando")
      return
    }

    try {
      const fullKey = this.getFullKey(key)
      const serialized = JSON.stringify(value)
      localStorage.setItem(fullKey, serialized)
      this.log("set", key, "Sucesso", value)
    } catch (error) {
      this.log("set", key, "Erro ao serializar", error)
      throw new Error(`Erro ao salvar ${key}: ${error}`)
    }
  }

  /**
   * Remove um item do localStorage
   * @param key - Chave do item a ser removido
   */
  remove(key: string): void {
    if (typeof window === "undefined") {
      this.log("remove", key, "SSR - ignorando")
      return
    }

    try {
      const fullKey = this.getFullKey(key)
      localStorage.removeItem(fullKey)
      this.log("remove", key, "Sucesso")
    } catch (error) {
      this.log("remove", key, "Erro", error)
    }
  }

  /**
   * Limpa todos os itens do localStorage com o prefixo
   */
  clear(): void {
    if (typeof window === "undefined") {
      this.log("clear", "all", "SSR - ignorando")
      return
    }

    try {
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key))
      this.log("clear", "all", `Removidos ${keysToRemove.length} itens`)
    } catch (error) {
      this.log("clear", "all", "Erro", error)
    }
  }

  /**
   * Verifica se um item existe no localStorage
   * @param key - Chave do item
   * @returns true se o item existe
   */
  has(key: string): boolean {
    if (typeof window === "undefined") {
      return false
    }

    try {
      const fullKey = this.getFullKey(key)
      const exists = localStorage.getItem(fullKey) !== null
      this.log("has", key, exists.toString())
      return exists
    } catch (error) {
      this.log("has", key, "Erro", error)
      return false
    }
  }

  /**
   * Obtém a chave completa com prefixo
   * @param key - Chave base
   * @returns Chave completa
   */
  private getFullKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  /**
   * Log de operações (se habilitado)
   */
  private log(operation: string, key: string, message: string, data?: any): void {
    if (!this.enableLogging) return

    const logData = {
      operation,
      key,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    }

    console.log(`[LocalStorageProvider]`, logData)
  }

  /**
   * Obtém todas as chaves com o prefixo
   * @returns Array de chaves
   */
  getAllKeys(): string[] {
    if (typeof window === "undefined") {
      return []
    }

    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        // Remove o prefixo para retornar apenas a chave base
        const baseKey = key.replace(`${this.prefix}:`, "")
        keys.push(baseKey)
      }
    }

    return keys
  }

  /**
   * Obtém o tamanho total dos dados armazenados
   * @returns Tamanho em bytes
   */
  getStorageSize(): number {
    if (typeof window === "undefined") {
      return 0
    }

    let totalSize = 0
    const keys = this.getAllKeys()

    for (const key of keys) {
      const value = this.get(key)
      if (value) {
        totalSize += JSON.stringify(value).length
      }
    }

    return totalSize
  }
} 