import type { CharacterType } from "./types"

// Local storage keys
const CHARACTER_KEY = "sumo-rpg-character"

// Get character from local storage
export const getCharacter = (): CharacterType | null => {
  if (typeof window === "undefined") return null

  const characterJson = localStorage.getItem(CHARACTER_KEY)
  if (!characterJson) return null

  try {
    return JSON.parse(characterJson)
  } catch (error) {
    console.error("Error parsing character data:", error)
    return null
  }
}

// Save character to local storage
export const updateCharacter = (character: CharacterType): void => {
  if (typeof window === "undefined") return

  localStorage.setItem(CHARACTER_KEY, JSON.stringify(character))
}

// Create a new character
export const createCharacter = (character: CharacterType): void => {
  // Garante que o personagem tenha os novos campos
  const newCharacter: CharacterType = {
    ...character,
    skillPoints: character.skillPoints || 3, // Começa com 3 pontos de habilidade
    learnedSkills: character.learnedSkills || [] // Começa sem habilidades
  }
  updateCharacter(newCharacter)
}

// Reset game (delete character)
export const resetGame = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem(CHARACTER_KEY)
}

// Adiciona pontos de habilidade ao personagem (quando sobe de nível)
export const addSkillPoints = (character: CharacterType, points: number): CharacterType => {
  return {
    ...character,
    skillPoints: character.skillPoints + points
  }
}

// Aprende uma nova habilidade
export const learnSkill = (character: CharacterType, skillId: string): CharacterType => {
  return {
    ...character,
    skillPoints: character.skillPoints - 1, // Assume custo de 1 ponto
    learnedSkills: [...character.learnedSkills, skillId]
  }
}

