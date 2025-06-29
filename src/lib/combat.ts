import type { 
  CombatState, 
  CombatCharacter, 
  CombatLogEntry, 
  SkillType, 
  Buff, 
  Debuff 
} from "./types"
import { SKILLS, SkillManager } from "./skills"

export class CombatManager {
  // Inicializa um personagem para combate
  static initializeCombatCharacter(
    name: string,
    country: string,
    level: number,
    attributes: any,
    skills: string[]
  ): CombatCharacter {
    const maxHealth = 100 + (level * 10)
    // Energia mais baixa no início, cresce exponencialmente
    const maxEnergy = 30 + (level * 8) + Math.floor(level * level * 0.5)

    return {
      name,
      country,
      level,
      attributes,
      maxHealth,
      currentHealth: maxHealth,
      maxEnergy,
      currentEnergy: maxEnergy,
      skills,
      activeBuffs: [],
      activeDebuffs: [],
      skillCooldowns: {}
    }
  }

  // Inicializa o estado de combate
  static initializeCombat(player: CombatCharacter, opponent: CombatCharacter): CombatState {
    return {
      player,
      opponent,
      turn: 1,
      currentTurn: "player",
      log: [],
      gameOver: false,
      winner: null
    }
  }

  // Executa uma ação de combate
  static executeAction(
    combatState: CombatState,
    skillId: string,
    target: "player" | "opponent"
  ): CombatState {
    const actor = combatState.currentTurn === "player" ? combatState.player : combatState.opponent
    const targetCharacter = target === "player" ? combatState.player : combatState.opponent
    
    const skill = SKILLS.find(s => s.id === skillId)
    if (!skill) {
      throw new Error("Habilidade não encontrada")
    }

    // Verifica se a habilidade está disponível
    if (!actor.skills.includes(skillId)) {
      throw new Error("Habilidade não aprendida")
    }

    // Verifica se está em cooldown
    if (SkillManager.isSkillOnCooldown(actor, skillId)) {
      throw new Error("Habilidade em cooldown")
    }

    // Verifica energia
    if (actor.currentEnergy < skill.energyCost) {
      throw new Error("Energia insuficiente")
    }

    // Determina onde aplicar os efeitos baseado no tipo de habilidade
    let updatedActor = { ...actor }
    let updatedTarget = { ...targetCharacter }

    // Aplica custos no ator (energia e cooldown)
    updatedActor = this.applySkillCosts(updatedActor, skill, skillId)

    // Aplica efeitos baseado no tipo de habilidade
    if (skill.type === "attack") {
      // Ataques afetam o alvo
      updatedTarget = this.applySkillEffects(updatedTarget, skill)
    } else if (skill.type === "defense") {
      // Defesas afetam o próprio ator
      updatedActor = this.applySkillEffects(updatedActor, skill)
    } else if (skill.type === "utility") {
      // Habilidades utilitárias podem afetar ambos
      if (skill.effects.healing || skill.effects.buffs) {
        // Cura e buffs afetam o próprio ator
        updatedActor = this.applySkillEffects(updatedActor, skill)
      } else if (skill.effects.debuffs) {
        // Debuffs afetam o alvo
        updatedTarget = this.applySkillEffects(updatedTarget, skill)
      }
    }

    // Cria log da ação
    const logEntry: CombatLogEntry = {
      turn: combatState.turn,
      actor: actor.name,
      action: skill.name,
      target: skill.type === "attack" || (skill.type === "utility" && skill.effects.debuffs) 
        ? targetCharacter.name 
        : actor.name,
      effect: this.getEffectDescription(skill),
      damage: skill.effects.damage,
      healing: skill.effects.healing
    }

    // Atualiza o estado de combate
    const newCombatState = {
      ...combatState,
      player: combatState.currentTurn === "player" ? updatedActor : updatedTarget,
      opponent: combatState.currentTurn === "opponent" ? updatedActor : updatedTarget,
      log: [...combatState.log, logEntry]
    }

    // Verifica se o jogo acabou
    if (updatedTarget.currentHealth <= 0) {
      return {
        ...newCombatState,
        gameOver: true,
        winner: combatState.currentTurn
      }
    }

    // Passa para o próximo turno
    return this.nextTurn(newCombatState)
  }

  // Aplica os efeitos de uma habilidade
  private static applySkillEffects(character: CombatCharacter, skill: SkillType): CombatCharacter {
    let updatedCharacter = { ...character }

    // Aplica dano
    if (skill.effects.damage) {
      const damage = this.calculateDamage(skill.effects.damage, character)
      updatedCharacter.currentHealth = Math.max(0, updatedCharacter.currentHealth - damage)
    }

    // Aplica cura
    if (skill.effects.healing) {
      const healing = skill.effects.healing
      updatedCharacter.currentHealth = Math.min(
        updatedCharacter.maxHealth,
        updatedCharacter.currentHealth + healing
      )
    }

    // Aplica buffs
    if (skill.effects.buffs) {
      for (const [attr, value] of Object.entries(skill.effects.buffs)) {
        const buff: Buff = {
          name: `${skill.name} Buff`,
          attribute: attr,
          value,
          duration: 3
        }
        updatedCharacter.activeBuffs.push(buff)
      }
    }

    // Aplica debuffs
    if (skill.effects.debuffs) {
      for (const [attr, value] of Object.entries(skill.effects.debuffs)) {
        const debuff: Debuff = {
          name: `${skill.name} Debuff`,
          attribute: attr,
          value,
          duration: 3
        }
        updatedCharacter.activeDebuffs.push(debuff)
      }
    }

    return updatedCharacter
  }

  // Aplica custos de uma habilidade
  private static applySkillCosts(
    character: CombatCharacter, 
    skill: SkillType, 
    skillId: string
  ): CombatCharacter {
    let updatedCharacter = { ...character }

    // Gasta energia
    updatedCharacter.currentEnergy = Math.max(0, updatedCharacter.currentEnergy - skill.energyCost)

    // Aplica cooldown
    updatedCharacter = SkillManager.applyCooldown(updatedCharacter, skillId)

    return updatedCharacter
  }

  // Calcula dano considerando defesa
  private static calculateDamage(baseDamage: number, target: CombatCharacter): number {
    const defense = this.getEffectiveAttribute(target, "defense")
    const damageReduction = defense * 0.5
    return Math.max(1, Math.floor(baseDamage - damageReduction))
  }

  // Obtém atributo efetivo (com buffs/debuffs)
  private static getEffectiveAttribute(character: CombatCharacter, attribute: string): number {
    let effectiveValue = character.attributes[attribute as keyof typeof character.attributes]

    // Aplica buffs
    for (const buff of character.activeBuffs) {
      if (buff.attribute === attribute) {
        effectiveValue += buff.value
      }
    }

    // Aplica debuffs
    for (const debuff of character.activeDebuffs) {
      if (debuff.attribute === attribute) {
        effectiveValue -= debuff.value
      }
    }

    return Math.max(1, effectiveValue)
  }

  // Passa para o próximo turno
  private static nextTurn(combatState: CombatState): CombatState {
    // Reduz duração de buffs/debuffs
    const updatedPlayer = this.updateBuffsAndDebuffs(combatState.player)
    const updatedOpponent = this.updateBuffsAndDebuffs(combatState.opponent)

    // Reduz cooldowns
    const playerWithReducedCooldowns = SkillManager.reduceCooldowns(updatedPlayer)
    const opponentWithReducedCooldowns = SkillManager.reduceCooldowns(updatedOpponent)

    // Recupera energia
    const playerWithEnergy = this.recoverEnergy(playerWithReducedCooldowns)
    const opponentWithEnergy = this.recoverEnergy(opponentWithReducedCooldowns)

    return {
      ...combatState,
      player: playerWithEnergy,
      opponent: opponentWithEnergy,
      turn: combatState.turn + 1,
      currentTurn: combatState.currentTurn === "player" ? "opponent" : "player"
    }
  }

  // Atualiza buffs e debuffs
  private static updateBuffsAndDebuffs(character: CombatCharacter): CombatCharacter {
    const updatedBuffs = character.activeBuffs
      .map(buff => ({ ...buff, duration: buff.duration - 1 }))
      .filter(buff => buff.duration > 0)

    const updatedDebuffs = character.activeDebuffs
      .map(debuff => ({ ...debuff, duration: debuff.duration - 1 }))
      .filter(debuff => debuff.duration > 0)

    return {
      ...character,
      activeBuffs: updatedBuffs,
      activeDebuffs: updatedDebuffs
    }
  }

  // Recupera energia no início do turno
  private static recoverEnergy(character: CombatCharacter): CombatCharacter {
    // Recuperação mais baixa no início, cresce com o nível
    const energyRecovery = 5 + (character.level * 2)
    const newEnergy = Math.min(
      character.maxEnergy,
      character.currentEnergy + energyRecovery
    )

    return {
      ...character,
      currentEnergy: newEnergy
    }
  }

  // Gera descrição do efeito
  private static getEffectDescription(skill: SkillType): string {
    const effects = []
    
    if (skill.effects.damage) {
      effects.push(`Causa ${skill.effects.damage} de dano`)
    }
    
    if (skill.effects.healing) {
      effects.push(`Cura ${skill.effects.healing} de vida`)
    }
    
    if (skill.effects.buffs) {
      const buffNames = Object.keys(skill.effects.buffs)
      effects.push(`Aumenta ${buffNames.join(", ")}`)
    }
    
    if (skill.effects.debuffs) {
      const debuffNames = Object.keys(skill.effects.debuffs)
      effects.push(`Reduz ${debuffNames.join(", ")} do oponente`)
    }

    return effects.join(", ")
  }

  // IA simples para o oponente
  static getAIAction(combatState: CombatState): string {
    const opponent = combatState.opponent
    const availableSkills = opponent.skills.filter(skillId => {
      const skill = SKILLS.find(s => s.id === skillId)
      if (!skill) return false
      
      return !SkillManager.isSkillOnCooldown(opponent, skillId) && 
             opponent.currentEnergy >= skill.energyCost
    })

    if (availableSkills.length === 0) {
      return "pass" // Passa o turno se não há habilidades disponíveis
    }

    // Estratégia simples: prioriza cura se vida baixa, senão ataca
    if (opponent.currentHealth < opponent.maxHealth * 0.3) {
      const healingSkills = availableSkills.filter(skillId => {
        const skill = SKILLS.find(s => s.id === skillId)
        return skill?.effects.healing
      })
      
      if (healingSkills.length > 0) {
        return healingSkills[0]
      }
    }

    // Escolhe uma habilidade de ataque aleatoriamente
    const attackSkills = availableSkills.filter(skillId => {
      const skill = SKILLS.find(s => s.id === skillId)
      return skill?.type === "attack"
    })

    if (attackSkills.length > 0) {
      return attackSkills[Math.floor(Math.random() * attackSkills.length)]
    }

    // Se não há habilidades de ataque, escolhe qualquer uma
    return availableSkills[Math.floor(Math.random() * availableSkills.length)]
  }

  // Verifica se uma ação é válida
  static isValidAction(
    combatState: CombatState,
    skillId: string,
    target: "player" | "opponent"
  ): boolean {
    const actor = combatState.currentTurn === "player" ? combatState.player : combatState.opponent
    const skill = SKILLS.find(s => s.id === skillId)
    
    if (!skill) return false
    if (!actor.skills.includes(skillId)) return false
    if (SkillManager.isSkillOnCooldown(actor, skillId)) return false
    if (actor.currentEnergy < skill.energyCost) return false

    return true
  }
} 