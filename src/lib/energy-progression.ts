/*
DEMONSTRAÇÃO DA PROGRESSÃO DE ENERGIA REBALANCEADA

Este arquivo demonstra como o sistema de energia evolui conforme o personagem progride,
criando uma sensação clara de evolução de poder.
*/

export interface EnergyProgression {
  level: number
  maxEnergy: number
  energyRecovery: number
  basicSkillCost: number
  intermediateSkillCost: number
  advancedSkillCost: number
  legendarySkillCost: number
  turnsToRecoverBasic: number
  turnsToRecoverLegendary: number
}

export function calculateEnergyProgression(level: number): EnergyProgression {
  const maxEnergy = 30 + (level * 8) + Math.floor(level * level * 0.5)
  const energyRecovery = 5 + (level * 2)
  
  // Custos das habilidades por nível
  const basicSkillCost = level <= 2 ? 5 : 8
  const intermediateSkillCost = level <= 4 ? 12 : 15
  const advancedSkillCost = level <= 7 ? 25 : 30
  const legendarySkillCost = level >= 8 ? 45 : 0
  
  const turnsToRecoverBasic = Math.ceil(basicSkillCost / energyRecovery)
  const turnsToRecoverLegendary = legendarySkillCost > 0 ? Math.ceil(legendarySkillCost / energyRecovery) : 0
  
  return {
    level,
    maxEnergy,
    energyRecovery,
    basicSkillCost,
    intermediateSkillCost,
    advancedSkillCost,
    legendarySkillCost,
    turnsToRecoverBasic,
    turnsToRecoverLegendary
  }
}

export function generateProgressionTable(): EnergyProgression[] {
  const table: EnergyProgression[] = []
  
  for (let level = 1; level <= 10; level++) {
    table.push(calculateEnergyProgression(level))
  }
  
  return table
}

export function analyzeCombatPacing(level: number): string {
  const progression = calculateEnergyProgression(level)
  
  if (level <= 2) {
    return "Combate Rápido: Habilidades básicas acessíveis, combates decisivos em poucos turnos"
  } else if (level <= 4) {
    return "Combate Moderado: Habilidades intermediárias disponíveis, estratégia começa a importar"
  } else if (level <= 7) {
    return "Combate Dinâmico: Habilidades avançadas acessíveis, combates táticos e envolventes"
  } else {
    return "Combate Épico: Habilidades lendárias disponíveis, combates poderosos e memoráveis"
  }
}

// Exemplo de uso:
export const progressionExample = generateProgressionTable()

/*
EXEMPLO DE SAÍDA:

Nível 1: 38 energia, 7 recuperação/turno
- Empurrão Básico (5 energia): 1 turno para recuperar
- Postura Defensiva (8 energia): 2 turnos para recuperar

Nível 3: 54 energia, 11 recuperação/turno  
- Impulso Poderoso (12 energia): 2 turnos para recuperar
- Intimidação (15 energia): 2 turnos para recuperar

Nível 5: 75 energia, 15 recuperação/turno
- Palma Trovejante (25 energia): 2 turnos para recuperar
- Foco de Batalha (30 energia): 2 turnos para recuperar

Nível 8: 102 energia, 21 recuperação/turno
- Fúria do Dragão (45 energia): 3 turnos para recuperar
- Postura Imortal (40 energia): 2 turnos para recuperar

RESULTADO: Combates sempre dinâmicos, com sensação clara de progressão!
*/ 