import type { 
  StorageProvider, 
  PersistenceConfig, 
  StorageKey, 
  CharacterType, 
  GameSettings, 
  CombatHistoryEntry, 
  Achievement,
  SaveSlot,
  SaveManager,
  SaveMetadata
} from "../types"

/**
 * Gerenciador principal de persistência de dados
 * Implementa padrão Repository para abstrair o provedor de armazenamento
 */
export class PersistenceManager {
  private readonly provider: StorageProvider
  private readonly keys: StorageKey
  private readonly enableLogging: boolean
  private readonly enableCaching: boolean
  private readonly cacheExpiration: number
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  constructor(config: PersistenceConfig) {
    this.provider = config.provider
    this.keys = config.keys
    this.enableLogging = config.enableLogging ?? false
    this.enableCaching = config.enableCaching ?? false
    this.cacheExpiration = config.cacheExpiration ?? 5 * 60 * 1000 // 5 minutos
  }

  // ===== Gerenciamento de Personagem =====

  /**
   * Obtém o personagem salvo
   */
  getCharacter(): CharacterType | null {
    const activeSave = this.getActiveSave()
    return activeSave ? activeSave.character : null
  }

  /**
   * Salva o personagem
   */
  saveCharacter(character: CharacterType): void {
    this.updateActiveSaveCharacter(character)
    this.log("saveCharacter", "Personagem salvo", character)
  }

  /**
   * Remove o personagem (reset do jogo)
   */
  deleteCharacter(): void {
    const activeSave = this.getActiveSave()
    if (activeSave) {
      this.deleteSave(activeSave.id)
    }
    this.log("deleteCharacter", "Personagem removido")
  }

  /**
   * Verifica se existe um personagem salvo
   */
  hasCharacter(): boolean {
    return this.getActiveSave() !== null
  }

  // ===== Gerenciamento de Configurações =====

  /**
   * Obtém as configurações do jogo
   */
  getGameSettings(): GameSettings | null {
    return this.getCachedOrFetch<GameSettings>(this.keys.GAME_SETTINGS)
  }

  /**
   * Salva as configurações do jogo
   */
  saveGameSettings(settings: GameSettings): void {
    this.setWithCache(this.keys.GAME_SETTINGS, settings)
    this.log("saveGameSettings", "Configurações salvas", settings)
  }

  /**
   * Atualiza apenas algumas configurações
   */
  updateGameSettings(partialSettings: Partial<GameSettings>): void {
    const current = this.getGameSettings() ?? this.getDefaultGameSettings()
    const updated = { ...current, ...partialSettings }
    this.saveGameSettings(updated)
  }

  /**
   * Obtém configurações padrão
   */
  getDefaultGameSettings(): GameSettings {
    return {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: "normal",
      language: "pt-BR",
      lastSaveDate: new Date().toISOString()
    }
  }

  // ===== Gerenciamento de Histórico de Combate =====

  /**
   * Obtém o histórico de combates
   */
  getCombatHistory(): CombatHistoryEntry[] {
    return this.getCachedOrFetch<CombatHistoryEntry[]>(this.keys.COMBAT_HISTORY) ?? []
  }

  /**
   * Adiciona uma entrada ao histórico de combate
   */
  addCombatHistory(entry: CombatHistoryEntry): void {
    const history = this.getCombatHistory()
    history.push(entry)
    
    // Mantém apenas os últimos 100 combates
    if (history.length > 100) {
      history.splice(0, history.length - 100)
    }
    
    this.setWithCache(this.keys.COMBAT_HISTORY, history)
    this.log("addCombatHistory", "Entrada adicionada", entry)
  }

  /**
   * Limpa o histórico de combate
   */
  clearCombatHistory(): void {
    this.provider.remove(this.keys.COMBAT_HISTORY)
    this.clearCache(this.keys.COMBAT_HISTORY)
    this.log("clearCombatHistory", "Histórico limpo")
  }

  // ===== Gerenciamento de Conquistas =====

  /**
   * Obtém as conquistas
   */
  getAchievements(): Achievement[] {
    return this.getCachedOrFetch<Achievement[]>(this.keys.ACHIEVEMENTS) ?? []
  }

  /**
   * Salva as conquistas
   */
  saveAchievements(achievements: Achievement[]): void {
    this.setWithCache(this.keys.ACHIEVEMENTS, achievements)
    this.log("saveAchievements", "Conquistas salvas", achievements)
  }

  /**
   * Desbloqueia uma conquista
   */
  unlockAchievement(achievementId: string): void {
    const achievements = this.getAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedDate = new Date().toISOString()
      this.saveAchievements(achievements)
      this.log("unlockAchievement", `Conquista desbloqueada: ${achievementId}`)
    }
  }

  /**
   * Atualiza o progresso de uma conquista
   */
  updateAchievementProgress(achievementId: string, progress: number): void {
    const achievements = this.getAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (achievement) {
      achievement.progress = progress
      if (achievement.maxProgress && progress >= achievement.maxProgress) {
        this.unlockAchievement(achievementId)
      } else {
        this.saveAchievements(achievements)
      }
    }
  }

  // ===== Gerenciamento de Múltiplos Saves =====

  /**
   * Obtém o gerenciador de saves
   */
  getSaveManager(): SaveManager {
    console.log("getSaveManager() - Chamado")
    const result = this.getCachedOrFetch<SaveManager>(this.keys.SAVE_MANAGER) ?? {
      activeSaveId: null,
      saveSlots: [],
      maxSlots: 3,
      lastBackup: new Date().toISOString()
    }
    
    console.log("getSaveManager() - Retornando:", result)
    return result
  }

  /**
   * Salva o gerenciador de saves
   */
  saveSaveManager(saveManager: SaveManager): void {
    this.setWithCache(this.keys.SAVE_MANAGER, saveManager)
    this.log("saveSaveManager", "Gerenciador de saves salvo", saveManager)
  }

  /**
   * Sincroniza o saveManager com o localStorage
   */
  private syncSaveManager(): void {
    const saveManager = this.getCachedOrFetch<SaveManager>(this.keys.SAVE_MANAGER)
    if (!saveManager) return
    
    let needsUpdate = false
    
    // Verifica se todos os saves no saveManager ainda existem no localStorage
    for (let i = saveManager.saveSlots.length - 1; i >= 0; i--) {
      const slot = saveManager.saveSlots[i]
      const exists = this.provider.has(`${this.keys.SAVE_SLOT_PREFIX}:${slot.id}`)
      if (!exists) {
        console.log(`syncSaveManager - Removendo save inexistente: ${slot.id}`)
        saveManager.saveSlots.splice(i, 1)
        needsUpdate = true
      }
    }
    
    // Se o save ativo não existe mais, limpa a referência
    if (saveManager.activeSaveId && !saveManager.saveSlots.find(slot => slot.id === saveManager.activeSaveId)) {
      console.log(`syncSaveManager - Limpando save ativo inexistente: ${saveManager.activeSaveId}`)
      saveManager.activeSaveId = null
      needsUpdate = true
    }
    
    if (needsUpdate) {
      this.saveSaveManager(saveManager)
    }
  }

  /**
   * Obtém um slot de save específico
   */
  getSaveSlot(saveId: string): SaveSlot | null {
    console.log("getSaveSlot - Buscando save com ID:", saveId)
    const key = `${this.keys.SAVE_SLOT_PREFIX}:${saveId}`
    console.log("getSaveSlot - Chave completa:", key)
    const result = this.getCachedOrFetch<SaveSlot>(key)
    console.log("getSaveSlot - Resultado:", result)
    return result
  }

  /**
   * Salva um slot de save
   */
  saveSaveSlot(saveSlot: SaveSlot): void {
    this.setWithCache(`${this.keys.SAVE_SLOT_PREFIX}:${saveSlot.id}`, saveSlot)
    this.log("saveSaveSlot", `Slot ${saveSlot.id} salvo`, saveSlot)
  }

  /**
   * Remove um slot de save
   */
  deleteSaveSlot(saveId: string): void {
    this.provider.remove(`${this.keys.SAVE_SLOT_PREFIX}:${saveId}`)
    this.clearCache(`${this.keys.SAVE_SLOT_PREFIX}:${saveId}`)
    this.log("deleteSaveSlot", `Slot ${saveId} removido`)
  }

  /**
   * Obtém todos os slots de save
   */
  getAllSaveSlots(): SaveSlot[] {
    const saveManager = this.getSaveManager()
    return saveManager.saveSlots
  }

  /**
   * Obtém metadados de todos os saves
   */
  getSaveMetadata(): SaveMetadata[] {
    const saveManager = this.getSaveManager()
    return saveManager.saveSlots.map(saveSlot => ({
      id: saveSlot.id,
      characterName: saveSlot.character.name,
      characterLevel: saveSlot.character.level,
      characterRank: saveSlot.character.rank,
      lastPlayed: saveSlot.lastPlayed,
      totalPlayTime: saveSlot.totalPlayTime,
      isActive: saveSlot.isActive
    }))
  }

  /**
   * Cria um novo save
   */
  async createSave(data: CharacterType): Promise<string> {
    console.log("createSave - Iniciando criação de save")
    const saveId = `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const save: SaveSlot = {
      id: saveId,
      character: data,
      lastPlayed: new Date().toISOString(),
      totalPlayTime: 0,
      isActive: true
    }
    
    console.log("createSave - Save criado:", save)
    
    // Salva o save
    this.setWithCache(this.keys.SAVE_SLOT_PREFIX + ":" + saveId, save)
    console.log("createSave - Save salvo no storage")
    
    // Aguarda um pouco para garantir que foi salvo
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Atualiza o saveManager
    const saveManager = this.getSaveManager()
    saveManager.saveSlots.push(save)
    saveManager.activeSaveId = saveId
    this.saveSaveManager(saveManager)
    console.log("createSave - SaveManager atualizado com novo save ativo")
    
    // Aguarda um pouco para garantir que a lista foi atualizada
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log("createSave - Save criado com sucesso, ID:", saveId)
    return saveId
  }

  /**
   * Ativa um save específico
   */
  async activateSave(saveId: string): Promise<void> {
    console.log("activateSave - Ativando save:", saveId)
    
    // Verifica se o save existe
    const saveData = this.getSaveSlot(saveId)
    if (!saveData) {
      throw new Error(`Save ${saveId} não encontrado`)
    }
    
    // Define como save ativo
    const saveManager = this.getSaveManager()
    saveManager.activeSaveId = saveId
    
    // Salva o gerenciador atualizado
    this.saveSaveManager(saveManager)
    console.log("activateSave - SaveManager salvo com activeSaveId:", saveId)
    
    // Aguarda um pouco para garantir que foi salvo
    await new Promise(resolve => setTimeout(resolve, 150))
    
    console.log("activateSave - Save ativado com sucesso")
  }

  /**
   * Obtém o save ativo
   */
  getActiveSave(): SaveSlot | null {
    console.log("getActiveSave - Iniciando busca do save ativo")
    const saveManager = this.getSaveManager()
    console.log("getActiveSave - SaveManager:", saveManager)
    
    if (!saveManager.activeSaveId) {
      console.log("getActiveSave - Nenhum save ativo (activeSaveId é null)")
      return null
    }
    
    console.log("getActiveSave - Buscando save com ID:", saveManager.activeSaveId)
    console.log("getActiveSave - saveSlots disponíveis:", saveManager.saveSlots.map(slot => ({ id: slot.id, name: slot.character.name })))
    
    const activeSave = saveManager.saveSlots.find(slot => slot.id === saveManager.activeSaveId)
    console.log("getActiveSave - Save ativo encontrado:", activeSave)
    
    if (!activeSave) {
      console.log("getActiveSave - ERRO: Save não encontrado no saveManager!")
      console.log("getActiveSave - Verificando localStorage diretamente...")
      // Verifica diretamente no localStorage
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage).filter(key => key.includes("sumo-rpg"))
        console.log("getActiveSave - Chaves no localStorage:", keys)
      }
      
      // Tenta sincronizar para corrigir inconsistências
      this.syncSaveManager()
      
      // Tenta buscar novamente após sincronização
      const updatedSaveManager = this.getCachedOrFetch<SaveManager>(this.keys.SAVE_MANAGER)
      if (updatedSaveManager?.activeSaveId) {
        const retryActiveSave = updatedSaveManager.saveSlots.find(slot => slot.id === updatedSaveManager.activeSaveId)
        if (retryActiveSave) {
          console.log("getActiveSave - Save encontrado após sincronização:", retryActiveSave)
          return retryActiveSave
        }
      }
    }
    
    return activeSave || null
  }

  /**
   * Atualiza o personagem do save ativo
   */
  updateActiveSaveCharacter(character: CharacterType): void {
    const activeSave = this.getActiveSave()
    
    if (!activeSave) {
      throw new Error("Nenhum save ativo")
    }
    
    activeSave.character = character
    activeSave.lastPlayed = new Date().toISOString()
    
    // Atualiza no saveManager
    const saveManager = this.getSaveManager()
    const saveIndex = saveManager.saveSlots.findIndex(slot => slot.id === activeSave.id)
    if (saveIndex !== -1) {
      saveManager.saveSlots[saveIndex] = activeSave
      this.saveSaveManager(saveManager)
    }
    
    this.log("updateActiveSaveCharacter", "Personagem do save ativo atualizado", character)
  }

  /**
   * Remove um save
   */
  deleteSave(saveId: string): void {
    const saveManager = this.getSaveManager()
    
    // Remove do gerenciador
    saveManager.saveSlots = saveManager.saveSlots.filter(slot => slot.id !== saveId)
    
    // Se era o save ativo, limpa a referência
    if (saveManager.activeSaveId === saveId) {
      saveManager.activeSaveId = null
    }
    
    // Salva o gerenciador atualizado
    this.saveSaveManager(saveManager)
    
    this.log("deleteSave", `Save removido: ${saveId}`)
  }

  /**
   * Verifica se há saves disponíveis
   */
  hasSaves(): boolean {
    const saveManager = this.getSaveManager()
    return saveManager.saveSlots.length > 0
  }

  /**
   * Verifica se há slots disponíveis para novos saves
   */
  canCreateSave(): boolean {
    const saveManager = this.getSaveManager()
    return saveManager.saveSlots.length < saveManager.maxSlots
  }

  /**
   * Obtém o número de saves existentes
   */
  getSaveCount(): number {
    const saveManager = this.getSaveManager()
    return saveManager.saveSlots.length
  }

  /**
   * Obtém o número máximo de saves
   */
  getMaxSaves(): number {
    const saveManager = this.getSaveManager()
    return saveManager.maxSlots
  }

  /**
   * Atualiza o tempo de jogo de um save
   */
  updatePlayTime(saveId: string, additionalMinutes: number): void {
    const saveSlot = this.getSaveSlot(saveId)
    
    if (saveSlot) {
      saveSlot.totalPlayTime += additionalMinutes
      saveSlot.lastPlayed = new Date().toISOString()
      this.saveSaveSlot(saveSlot)
    }
  }

  /**
   * Migra dados antigos para o novo sistema de saves
   */
  migrateOldSave(): void {
    // Verifica se existe um personagem no formato antigo
    const oldCharacter = this.provider.get<CharacterType>(this.keys.CHARACTER)
    
    if (oldCharacter && !this.hasSaves()) {
      // Cria um save com o personagem antigo
      this.createSave(oldCharacter)
      
      // Remove o personagem antigo
      this.provider.remove(this.keys.CHARACTER)
      
      this.log("migrateOldSave", "Dados antigos migrados para novo sistema de saves")
    }
  }

  // ===== Métodos Utilitários =====

  /**
   * Obtém dados com cache se habilitado
   */
  private getCachedOrFetch<T>(key: string): T | null {
    if (this.enableCaching) {
      const cached = this.cache.get(key)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
        this.log("getCachedOrFetch", `${key} (cache hit)`)
        return cached.data
      }
    }

    const data = this.provider.get<T>(key)
    
    if (this.enableCaching && data !== null) {
      this.cache.set(key, { data, timestamp: Date.now() })
    }

    return data
  }

  /**
   * Define dados com cache se habilitado
   */
  private setWithCache<T>(key: string, value: T): void {
    this.provider.set(key, value)
    
    if (this.enableCaching) {
      this.cache.set(key, { data: value, timestamp: Date.now() })
    }
  }

  /**
   * Limpa cache de uma chave específica
   */
  private clearCache(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Limpa todo o cache
   */
  clearAllCache(): void {
    this.cache.clear()
  }

  /**
   * Obtém estatísticas de armazenamento
   */
  getStorageStats(): {
    totalKeys: number
    totalSize: number
    cacheSize: number
    cacheHitRate: number
  } {
    let totalKeys = 0
    if (this.provider.has(this.keys.CHARACTER)) totalKeys++
    if (this.provider.has(this.keys.GAME_SETTINGS)) totalKeys++
    if (this.provider.has(this.keys.COMBAT_HISTORY)) totalKeys++
    if (this.provider.has(this.keys.ACHIEVEMENTS)) totalKeys++

    const character = this.provider.get(this.keys.CHARACTER)
    const totalSize = character ? JSON.stringify(character).length : 0

    const cacheSize = this.cache.size

    // Calcula taxa de hit do cache (simplificado)
    const cacheHitRate = this.enableCaching ? 0.8 : 0 // Placeholder

    return {
      totalKeys,
      totalSize,
      cacheSize,
      cacheHitRate
    }
  }

  /**
   * Faz backup de todos os dados
   */
  exportBackup(): string {
    const backup = {
      character: this.getCharacter(),
      gameSettings: this.getGameSettings(),
      combatHistory: this.getCombatHistory(),
      achievements: this.getAchievements(),
      exportDate: new Date().toISOString(),
      version: "1.0.0"
    }

    return JSON.stringify(backup, null, 2)
  }

  /**
   * Restaura dados de um backup
   */
  importBackup(backupJson: string): boolean {
    try {
      const backup = JSON.parse(backupJson)
      
      if (backup.character) this.saveCharacter(backup.character)
      if (backup.gameSettings) this.saveGameSettings(backup.gameSettings)
      if (backup.combatHistory) this.setWithCache(this.keys.COMBAT_HISTORY, backup.combatHistory)
      if (backup.achievements) this.saveAchievements(backup.achievements)
      
      this.log("importBackup", "Backup restaurado com sucesso")
      return true
    } catch (error) {
      this.log("importBackup", "Erro ao restaurar backup", error)
      return false
    }
  }

  /**
   * Log de operações
   */
  private log(operation: string, message: string, data?: any): void {
    if (!this.enableLogging) return

    console.log(`[PersistenceManager] ${operation}: ${message}`, data || "")
  }
} 