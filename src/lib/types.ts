export interface CharacterType {
    name: string
    country: string
    attributes: {
      strength: number
      dexterity: number
      mentalStrength: number
      speed: number
      defense: number
    }
    level: number
    experience: number
    money: number
    skills: string[]
    passives: string[]
    wins: number
    losses: number
    rank: string
    skillPoints: number
    learnedSkills: string[]
  }
  
  export interface ActivityType {
    name: string
    description: string
    type: "training" | "work"
    attribute?: string
    value: number
    cost?: number
    experience: number
  }
  
  export interface SkillType {
    id: string
    name: string
    description: string
    type: "attack" | "defense" | "utility"
    cost: number
    requirements: {
      level: number
      attributes: {
        strength?: number
        dexterity?: number
        mentalStrength?: number
        speed?: number
        defense?: number
      }
      prerequisites: string[]
    }
    effects: {
      damage?: number
      healing?: number
      buffs?: {
        [key: string]: number
      }
      debuffs?: {
        [key: string]: number
      }
    }
    cooldown: number
    energyCost: number
  }
  
  export interface CombatState {
    player: CombatCharacter
    opponent: CombatCharacter
    turn: number
    currentTurn: "player" | "opponent"
    log: CombatLogEntry[]
    gameOver: boolean
    winner: "player" | "opponent" | null
  }
  
  export interface CombatCharacter {
    name: string
    country: string
    level: number
    attributes: {
      strength: number
      dexterity: number
      mentalStrength: number
      speed: number
      defense: number
    }
    maxHealth: number
    currentHealth: number
    maxEnergy: number
    currentEnergy: number
    skills: string[]
    activeBuffs: Buff[]
    activeDebuffs: Debuff[]
    skillCooldowns: { [skillId: string]: number }
  }
  
  export interface Buff {
    name: string
    attribute: string
    value: number
    duration: number
  }
  
  export interface Debuff {
    name: string
    attribute: string
    value: number
    duration: number
  }
  
  export interface CombatLogEntry {
    turn: number
    actor: string
    action: string
    target: string
    effect: string
    damage?: number
    healing?: number
  }
  
  export interface SkillTreeNode {
    id: string
    skill: SkillType
    position: { x: number; y: number }
    connections: string[]
    unlocked: boolean
  }
  
  export interface StorageKey {
    CHARACTER: string
    GAME_SETTINGS: string
    COMBAT_HISTORY: string
    ACHIEVEMENTS: string
    SAVE_MANAGER: string
    SAVE_SLOT_PREFIX: string
  }
  
  export interface StorageData {
    character?: CharacterType
    gameSettings?: GameSettings
    combatHistory?: CombatHistoryEntry[]
    achievements?: Achievement[]
  }
  
  export interface GameSettings {
    soundEnabled: boolean
    musicEnabled: boolean
    difficulty: "easy" | "normal" | "hard"
    language: string
    lastSaveDate: string
  }
  
  export interface CombatHistoryEntry {
    id: string
    date: string
    playerName: string
    opponentName: string
    result: "win" | "lose"
    arena: string
    turns: number
    playerLevel: number
    opponentLevel: number
  }
  
  export interface Achievement {
    id: string
    name: string
    description: string
    unlocked: boolean
    unlockedDate?: string
    progress?: number
    maxProgress?: number
  }
  
  export interface StorageProvider {
    get<T>(key: string): T | null
    set<T>(key: string, value: T): void
    remove(key: string): void
    clear(): void
    has(key: string): boolean
  }
  
  export interface AsyncStorageProvider {
    get<T>(key: string): Promise<T | null>
    set<T>(key: string, value: T): Promise<void>
    remove(key: string): Promise<void>
    clear(): Promise<void>
    has(key: string): Promise<boolean>
  }
  
  export interface PersistenceConfig {
    provider: StorageProvider
    keys: StorageKey
    enableLogging?: boolean
    enableCaching?: boolean
    cacheExpiration?: number
  }
  
  // Tipos para o sistema de múltiplos saves
  export interface SaveSlot {
    id: string
    character: CharacterType
    lastPlayed: string
    totalPlayTime: number // em minutos
    isActive: boolean
  }
  
  export interface SaveManager {
    activeSaveId: string | null
    saveSlots: SaveSlot[]
    maxSlots: number
    lastBackup: string
  }
  
  export interface SaveMetadata {
    id: string
    characterName: string
    characterLevel: number
    characterRank: string
    lastPlayed: string
    totalPlayTime: number
    isActive: boolean
  }
  
  