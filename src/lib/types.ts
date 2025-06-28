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
  
  