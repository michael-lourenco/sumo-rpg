import type { SkillType, SkillTreeNode, CharacterType, CombatCharacter } from "./types"

// Definição de todas as habilidades disponíveis
export const SKILLS: SkillType[] = [
  // Habilidades básicas (nível 1)
  {
    id: "basic-push",
    name: "Empurrão Básico",
    description: "Um empurrão simples usando força bruta",
    type: "attack",
    cost: 1,
    requirements: {
      level: 1,
      attributes: { strength: 3 },
      prerequisites: []
    },
    effects: {
      damage: 15
    },
    cooldown: 0,
    energyCost: 10
  },
  {
    id: "basic-defense",
    name: "Postura Defensiva",
    description: "Adota uma postura defensiva para reduzir dano",
    type: "defense",
    cost: 1,
    requirements: {
      level: 1,
      attributes: { defense: 3 },
      prerequisites: []
    },
    effects: {
      buffs: { defense: 5 }
    },
    cooldown: 2,
    energyCost: 15
  },
  {
    id: "meditation",
    name: "Meditação",
    description: "Recupera energia através da meditação",
    type: "utility",
    cost: 1,
    requirements: {
      level: 1,
      attributes: { mentalStrength: 3 },
      prerequisites: []
    },
    effects: {
      healing: 20
    },
    cooldown: 3,
    energyCost: 0
  },

  // Habilidades intermediárias (nível 3)
  {
    id: "powerful-thrust",
    name: "Impulso Poderoso",
    description: "Um impulso forte que causa dano significativo",
    type: "attack",
    cost: 2,
    requirements: {
      level: 3,
      attributes: { strength: 6 },
      prerequisites: ["basic-push"]
    },
    effects: {
      damage: 25
    },
    cooldown: 2,
    energyCost: 20
  },
  {
    id: "agile-dodge",
    name: "Esquiva Ágil",
    description: "Esquiva rapidamente de um ataque",
    type: "defense",
    cost: 2,
    requirements: {
      level: 3,
      attributes: { dexterity: 6 },
      prerequisites: ["basic-defense"]
    },
    effects: {
      buffs: { speed: 3 }
    },
    cooldown: 3,
    energyCost: 15
  },
  {
    id: "intimidate",
    name: "Intimidação",
    description: "Intimida o oponente reduzindo seus atributos",
    type: "utility",
    cost: 2,
    requirements: {
      level: 3,
      attributes: { mentalStrength: 6 },
      prerequisites: ["meditation"]
    },
    effects: {
      debuffs: { strength: 2, mentalStrength: 2 }
    },
    cooldown: 4,
    energyCost: 25
  },

  // Habilidades avançadas (nível 5)
  {
    id: "thunder-clap",
    name: "Palma Trovejante",
    description: "Um golpe devastador que causa dano massivo",
    type: "attack",
    cost: 3,
    requirements: {
      level: 5,
      attributes: { strength: 8, mentalStrength: 5 },
      prerequisites: ["powerful-thrust"]
    },
    effects: {
      damage: 40
    },
    cooldown: 4,
    energyCost: 35
  },
  {
    id: "iron-wall",
    name: "Muralha de Ferro",
    description: "Cria uma barreira defensiva impenetrável",
    type: "defense",
    cost: 3,
    requirements: {
      level: 5,
      attributes: { defense: 8, strength: 5 },
      prerequisites: ["agile-dodge"]
    },
    effects: {
      buffs: { defense: 10 }
    },
    cooldown: 5,
    energyCost: 30
  },
  {
    id: "battle-focus",
    name: "Foco de Batalha",
    description: "Aumenta todos os atributos temporariamente",
    type: "utility",
    cost: 3,
    requirements: {
      level: 5,
      attributes: { mentalStrength: 8, speed: 5 },
      prerequisites: ["intimidate"]
    },
    effects: {
      buffs: { strength: 3, dexterity: 3, mentalStrength: 3, speed: 3, defense: 3 }
    },
    cooldown: 6,
    energyCost: 40
  },

  // Habilidades lendárias (nível 8)
  {
    id: "dragon-rage",
    name: "Fúria do Dragão",
    description: "Libera o poder interior causando dano devastador",
    type: "attack",
    cost: 5,
    requirements: {
      level: 8,
      attributes: { strength: 10, mentalStrength: 8 },
      prerequisites: ["thunder-clap", "battle-focus"]
    },
    effects: {
      damage: 60
    },
    cooldown: 6,
    energyCost: 50
  },
  {
    id: "immortal-stance",
    name: "Postura Imortal",
    description: "Torna-se praticamente invulnerável",
    type: "defense",
    cost: 5,
    requirements: {
      level: 8,
      attributes: { defense: 10, mentalStrength: 8 },
      prerequisites: ["iron-wall", "battle-focus"]
    },
    effects: {
      buffs: { defense: 15 },
      healing: 30
    },
    cooldown: 8,
    energyCost: 45
  }
]

// Árvore de habilidades
export const SKILL_TREE: SkillTreeNode[] = [
  // Nível 1 - Habilidades básicas
  {
    id: "basic-push",
    skill: SKILLS.find(s => s.id === "basic-push")!,
    position: { x: 0, y: 0 },
    connections: ["powerful-thrust"],
    unlocked: true
  },
  {
    id: "basic-defense",
    skill: SKILLS.find(s => s.id === "basic-defense")!,
    position: { x: 2, y: 0 },
    connections: ["agile-dodge"],
    unlocked: true
  },
  {
    id: "meditation",
    skill: SKILLS.find(s => s.id === "meditation")!,
    position: { x: 4, y: 0 },
    connections: ["intimidate"],
    unlocked: true
  },

  // Nível 2 - Habilidades intermediárias
  {
    id: "powerful-thrust",
    skill: SKILLS.find(s => s.id === "powerful-thrust")!,
    position: { x: 0, y: 2 },
    connections: ["basic-push", "thunder-clap"],
    unlocked: false
  },
  {
    id: "agile-dodge",
    skill: SKILLS.find(s => s.id === "agile-dodge")!,
    position: { x: 2, y: 2 },
    connections: ["basic-defense", "iron-wall"],
    unlocked: false
  },
  {
    id: "intimidate",
    skill: SKILLS.find(s => s.id === "intimidate")!,
    position: { x: 4, y: 2 },
    connections: ["meditation", "battle-focus"],
    unlocked: false
  },

  // Nível 3 - Habilidades avançadas
  {
    id: "thunder-clap",
    skill: SKILLS.find(s => s.id === "thunder-clap")!,
    position: { x: 0, y: 4 },
    connections: ["powerful-thrust", "dragon-rage"],
    unlocked: false
  },
  {
    id: "iron-wall",
    skill: SKILLS.find(s => s.id === "iron-wall")!,
    position: { x: 2, y: 4 },
    connections: ["agile-dodge", "immortal-stance"],
    unlocked: false
  },
  {
    id: "battle-focus",
    skill: SKILLS.find(s => s.id === "battle-focus")!,
    position: { x: 4, y: 4 },
    connections: ["intimidate", "dragon-rage", "immortal-stance"],
    unlocked: false
  },

  // Nível 4 - Habilidades lendárias
  {
    id: "dragon-rage",
    skill: SKILLS.find(s => s.id === "dragon-rage")!,
    position: { x: 1, y: 6 },
    connections: ["thunder-clap", "battle-focus"],
    unlocked: false
  },
  {
    id: "immortal-stance",
    skill: SKILLS.find(s => s.id === "immortal-stance")!,
    position: { x: 3, y: 6 },
    connections: ["iron-wall", "battle-focus"],
    unlocked: false
  }
]

// Funções utilitárias para o sistema de habilidades
export class SkillManager {
  // Verifica se um personagem pode aprender uma habilidade
  static canLearnSkill(character: CharacterType, skillId: string): boolean {
    const skill = SKILLS.find(s => s.id === skillId)
    if (!skill) return false

    // Verifica se já aprendeu
    if (character.learnedSkills.includes(skillId)) return false

    // Verifica pontos de habilidade
    if (character.skillPoints < skill.cost) return false

    // Verifica nível
    if (character.level < skill.requirements.level) return false

    // Verifica atributos
    for (const [attr, value] of Object.entries(skill.requirements.attributes)) {
      if (character.attributes[attr as keyof typeof character.attributes] < value) {
        return false
      }
    }

    // Verifica pré-requisitos
    for (const prereq of skill.requirements.prerequisites) {
      if (!character.learnedSkills.includes(prereq)) return false
    }

    return true
  }

  // Aprende uma habilidade
  static learnSkill(character: CharacterType, skillId: string): CharacterType {
    const skill = SKILLS.find(s => s.id === skillId)
    if (!skill || !this.canLearnSkill(character, skillId)) {
      throw new Error("Não é possível aprender esta habilidade")
    }

    return {
      ...character,
      skillPoints: character.skillPoints - skill.cost,
      learnedSkills: [...character.learnedSkills, skillId]
    }
  }

  // Obtém habilidades disponíveis para um personagem
  static getAvailableSkills(character: CharacterType): SkillType[] {
    return SKILLS.filter(skill => this.canLearnSkill(character, skill.id))
  }

  // Obtém habilidades aprendidas
  static getLearnedSkills(character: CharacterType): SkillType[] {
    return SKILLS.filter(skill => character.learnedSkills.includes(skill.id))
  }

  // Obtém habilidades para combate (apenas as aprendidas)
  static getCombatSkills(character: CharacterType): SkillType[] {
    return this.getLearnedSkills(character)
  }

  // Verifica se uma habilidade está em cooldown
  static isSkillOnCooldown(character: CombatCharacter, skillId: string): boolean {
    return (character.skillCooldowns[skillId] || 0) > 0
  }

  // Aplica cooldown a uma habilidade
  static applyCooldown(character: CombatCharacter, skillId: string): CombatCharacter {
    const skill = SKILLS.find(s => s.id === skillId)
    if (!skill) return character

    return {
      ...character,
      skillCooldowns: {
        ...character.skillCooldowns,
        [skillId]: skill.cooldown
      }
    }
  }

  // Reduz cooldowns no início do turno
  static reduceCooldowns(character: CombatCharacter): CombatCharacter {
    const newCooldowns: { [key: string]: number } = {}
    
    for (const [skillId, cooldown] of Object.entries(character.skillCooldowns)) {
      if (cooldown > 0) {
        newCooldowns[skillId] = cooldown - 1
      }
    }

    return {
      ...character,
      skillCooldowns: newCooldowns
    }
  }
} 