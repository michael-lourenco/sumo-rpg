import type { CharacterType } from "./types"
import { persistenceManager } from "./storage"

// ===== Funções de Compatibilidade (Mantidas para não quebrar código existente) =====

/**
 * Obtém o personagem do armazenamento
 * @deprecated Use getCharacter() from storage/index.ts
 */
export const getCharacter = (): CharacterType | null => {
  return persistenceManager.getCharacter()
}

/**
 * Salva o personagem no armazenamento
 * @deprecated Use saveCharacter() from storage/index.ts
 */
export const updateCharacter = (character: CharacterType): void => {
  persistenceManager.saveCharacter(character)
}

/**
 * Cria um novo personagem
 * @deprecated Use createCharacter() from storage/index.ts
 */
export const createCharacter = (character: CharacterType): void => {
  // Garante que o personagem tenha os novos campos
  const newCharacter: CharacterType = {
    ...character,
    skillPoints: character.skillPoints || 3, // Começa com 3 pontos de habilidade
    learnedSkills: character.learnedSkills || [] // Começa sem habilidades
  }
  persistenceManager.saveCharacter(newCharacter)
}

/**
 * Remove o personagem (reset do jogo)
 * @deprecated Use deleteCharacter() from storage/index.ts
 */
export const resetGame = (): void => {
  persistenceManager.deleteCharacter()
}

// ===== Funções Específicas do Jogo =====

/**
 * Adiciona pontos de habilidade ao personagem
 */
export const addSkillPoints = (character: CharacterType, points: number): CharacterType => {
  return {
    ...character,
    skillPoints: character.skillPoints + points
  }
}

/**
 * Aprende uma nova habilidade
 * @deprecated Use SkillManager.learnSkill() instead
 */
export const learnSkill = (character: CharacterType, skillId: string): CharacterType => {
  return {
    ...character,
    skillPoints: character.skillPoints - 1, // Assume custo de 1 ponto
    learnedSkills: [...character.learnedSkills, skillId]
  }
}

/**
 * Obtém estatísticas do personagem
 */
export const getCharacterStats = (character: CharacterType) => {
  const totalAttributes = Object.values(character.attributes).reduce((sum, attr) => sum + attr, 0)
  const winRate = character.wins + character.losses > 0 
    ? (character.wins / (character.wins + character.losses)) * 100 
    : 0

  return {
    totalAttributes,
    winRate: Math.round(winRate * 100) / 100,
    totalBattles: character.wins + character.losses,
    averageLevel: character.level
  }
}

/**
 * Verifica se o personagem pode subir de nível
 */
export const canLevelUp = (character: CharacterType): boolean => {
  return character.experience >= character.level * 100
}

/**
 * Faz o personagem subir de nível
 */
export const levelUp = (character: CharacterType): CharacterType => {
  if (!canLevelUp(character)) {
    throw new Error("Personagem não tem experiência suficiente para subir de nível")
  }

  return {
    ...character,
    level: character.level + 1,
    experience: 0,
    skillPoints: character.skillPoints + 2 // +2 pontos de habilidade por nível
  }
}

/**
 * Calcula o ranking baseado no número de vitórias
 */
export const calculateRank = (wins: number): string => {
  if (wins >= 25) return "Profissional Japonês"
  if (wins >= 20) return "Amador Mundial"
  if (wins >= 15) return "Amador Nacional"
  if (wins >= 10) return "Amador Regional"
  if (wins >= 5) return "Iniciante Avançado"
  return "Iniciante"
}

/**
 * Atualiza o ranking do personagem baseado nas vitórias
 */
export const updateRank = (character: CharacterType): CharacterType => {
  const newRank = calculateRank(character.wins)
  
  if (newRank !== character.rank) {
    return {
      ...character,
      rank: newRank
    }
  }
  
  return character
}

/**
 * Valida se um personagem é válido
 */
export const validateCharacter = (character: any): character is CharacterType => {
  if (!character || typeof character !== "object") return false
  
  const requiredFields = [
    "name", "country", "attributes", "level", "experience", 
    "money", "wins", "losses", "rank", "skillPoints", "learnedSkills"
  ]
  
  for (const field of requiredFields) {
    if (!(field in character)) return false
  }
  
  // Valida atributos
  const requiredAttributes = ["strength", "dexterity", "mentalStrength", "speed", "defense"]
  for (const attr of requiredAttributes) {
    if (typeof character.attributes[attr] !== "number") return false
  }
  
  return true
}

/**
 * Migra dados de personagem de versões antigas
 */
export const migrateCharacter = (oldCharacter: any): CharacterType => {
  // Se já é um CharacterType válido, retorna como está
  if (validateCharacter(oldCharacter)) {
    return oldCharacter
  }
  
  // Migração de versões antigas
  const migrated: CharacterType = {
    name: oldCharacter.name || "Lutador",
    country: oldCharacter.country || "Brasil",
    attributes: {
      strength: oldCharacter.attributes?.strength || 5,
      dexterity: oldCharacter.attributes?.dexterity || 5,
      mentalStrength: oldCharacter.attributes?.mentalStrength || 5,
      speed: oldCharacter.attributes?.speed || 5,
      defense: oldCharacter.attributes?.defense || 5,
    },
    level: oldCharacter.level || 1,
    experience: oldCharacter.experience || 0,
    money: oldCharacter.money || 1000,
    skills: oldCharacter.skills || [],
    passives: oldCharacter.passives || [],
    wins: oldCharacter.wins || 0,
    losses: oldCharacter.losses || 0,
    rank: oldCharacter.rank || "Iniciante",
    skillPoints: oldCharacter.skillPoints || 3,
    learnedSkills: oldCharacter.learnedSkills || []
  }
  
  return migrated
}

