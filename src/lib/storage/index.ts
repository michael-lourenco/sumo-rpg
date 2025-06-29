import { LocalStorageProvider } from "./local-storage-provider"
import { PersistenceManager } from "./persistence-manager"
import type { StorageKey, PersistenceConfig, CharacterType } from "../types"

// Chaves de armazenamento
const STORAGE_KEYS: StorageKey = {
  CHARACTER: "character",
  GAME_SETTINGS: "game-settings",
  COMBAT_HISTORY: "combat-history",
  ACHIEVEMENTS: "achievements",
  SAVE_MANAGER: "save-manager",
  SAVE_SLOT_PREFIX: "save-slot"
}

// Configuração do sistema de persistência
const PERSISTENCE_CONFIG: PersistenceConfig = {
  provider: new LocalStorageProvider("sumo-rpg", true),
  keys: STORAGE_KEYS,
  enableLogging: true,
  enableCaching: true,
  cacheExpiration: 5 * 60 * 1000 // 5 minutos
}

// Instância global do gerenciador de persistência
export const persistenceManager = new PersistenceManager(PERSISTENCE_CONFIG)

// Exporta tipos e classes para uso em outros módulos
export { LocalStorageProvider, PersistenceManager }
export type { StorageKey, PersistenceConfig }

// Funções de conveniência para compatibilidade com código existente
export const getCharacter = () => {
  console.log("getCharacter() - Chamado")
  const activeSave = persistenceManager.getActiveSave()
  console.log("getCharacter() - activeSave:", activeSave)
  const result = activeSave ? activeSave.character : null
  console.log("getCharacter() - Retornando:", result)
  return result
}

export const saveCharacter = (character: any) => {
  console.log("saveCharacter() - Chamado com:", character)
  persistenceManager.updateActiveSaveCharacter(character)
}

export const hasCharacter = () => {
  console.log("hasCharacter() - Chamado")
  const result = persistenceManager.getActiveSave() !== null
  console.log("hasCharacter() - Retornando:", result)
  return result
}

export const deleteCharacter = () => {
  console.log("deleteCharacter() - Chamado")
  const activeSave = persistenceManager.getActiveSave()
  if (activeSave) {
    persistenceManager.deleteSave(activeSave.id)
  }
}

// Funções para configurações
export const getGameSettings = () => persistenceManager.getGameSettings()
export const saveGameSettings = (settings: any) => persistenceManager.saveGameSettings(settings)
export const updateGameSettings = (partialSettings: any) => persistenceManager.updateGameSettings(partialSettings)

// Funções para histórico de combate
export const getCombatHistory = () => persistenceManager.getCombatHistory()
export const addCombatHistory = (entry: any) => persistenceManager.addCombatHistory(entry)
export const clearCombatHistory = () => persistenceManager.clearCombatHistory()

// Funções para conquistas
export const getAchievements = () => persistenceManager.getAchievements()
export const saveAchievements = (achievements: any) => persistenceManager.saveAchievements(achievements)
export const unlockAchievement = (achievementId: string) => persistenceManager.unlockAchievement(achievementId)
export const updateAchievementProgress = (achievementId: string, progress: number) => 
  persistenceManager.updateAchievementProgress(achievementId, progress)

// Funções utilitárias
export const exportBackup = () => persistenceManager.exportBackup()
export const importBackup = (backupJson: string) => persistenceManager.importBackup(backupJson)
export const getStorageStats = () => persistenceManager.getStorageStats()
export const clearCache = () => persistenceManager.clearAllCache()

// ===== Funções para Sistema de Múltiplos Saves =====

// Gerenciamento de saves
export const getSaveManager = () => persistenceManager.getSaveManager()
export const saveSaveManager = (saveManager: any) => persistenceManager.saveSaveManager(saveManager)
export const getSaveMetadata = () => persistenceManager.getSaveMetadata()
export const getAllSaveSlots = () => persistenceManager.getAllSaveSlots()

// Operações de save
export const createSave = async (character: CharacterType): Promise<string> => {
  console.log("createSave (index) - Iniciando criação de save")
  const result = await persistenceManager.createSave(character)
  console.log("createSave (index) - Save criado com ID:", result)
  return result
}

export const activateSave = async (saveId: string): Promise<void> => {
  console.log("activateSave (index) - Iniciando ativação de save")
  await persistenceManager.activateSave(saveId)
  console.log("activateSave (index) - Save ativado com sucesso")
}

export const deleteSave = (saveId: string) => persistenceManager.deleteSave(saveId)
export const getActiveSave = () => persistenceManager.getActiveSave()
export const updateActiveSaveCharacter = (character: any) => persistenceManager.updateActiveSaveCharacter(character)

// Verificações
export const hasSaves = () => persistenceManager.hasSaves()
export const canCreateSave = () => persistenceManager.canCreateSave()
export const getSaveCount = () => persistenceManager.getSaveCount()
export const getMaxSaves = () => persistenceManager.getMaxSaves()

// Utilitários
export const updatePlayTime = (saveId: string, minutes: number) => persistenceManager.updatePlayTime(saveId, minutes)
export const migrateOldSave = () => persistenceManager.migrateOldSave() 