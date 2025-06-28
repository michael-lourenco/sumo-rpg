import { CombatManager } from "./combat"
import { SKILLS } from "./skills"

// Teste simples para verificar se a lógica do combate está correta
export function testCombatLogic() {
  console.log("🧪 Testando lógica do combate...")

  // Cria personagens de teste
  const player = CombatManager.initializeCombatCharacter(
    "TestPlayer",
    "Brasil",
    1,
    { strength: 5, dexterity: 5, mentalStrength: 5, speed: 5, defense: 5 },
    ["basic-push", "meditation", "basic-defense"]
  )

  const opponent = CombatManager.initializeCombatCharacter(
    "TestOpponent",
    "Japão",
    1,
    { strength: 5, dexterity: 5, mentalStrength: 5, speed: 5, defense: 5 },
    ["basic-push", "meditation", "basic-defense"]
  )

  // Inicializa combate
  let combatState = CombatManager.initializeCombat(player, opponent)

  console.log("Estado inicial:")
  console.log(`Player HP: ${combatState.player.currentHealth}/${combatState.player.maxHealth}`)
  console.log(`Opponent HP: ${combatState.opponent.currentHealth}/${combatState.opponent.maxHealth}`)

  // Testa habilidade de ataque (deve afetar o oponente)
  console.log("\n🔴 Testando ataque (basic-push)...")
  combatState = CombatManager.executeAction(combatState, "basic-push", "opponent")
  console.log(`Player HP: ${combatState.player.currentHealth}/${combatState.player.maxHealth}`)
  console.log(`Opponent HP: ${combatState.opponent.currentHealth}/${combatState.opponent.maxHealth}`)

  // Testa habilidade de cura (deve afetar o próprio jogador)
  console.log("\n🟢 Testando cura (meditation)...")
  const playerHPBefore = combatState.player.currentHealth
  combatState = CombatManager.executeAction(combatState, "meditation", "opponent")
  console.log(`Player HP antes: ${playerHPBefore}, depois: ${combatState.player.currentHealth}`)
  console.log(`Opponent HP: ${combatState.opponent.currentHealth}`)

  // Testa habilidade de defesa (deve afetar o próprio jogador)
  console.log("\n🟡 Testando defesa (basic-defense)...")
  const playerDefenseBefore = combatState.player.attributes.defense
  combatState = CombatManager.executeAction(combatState, "basic-defense", "opponent")
  console.log(`Player Defense antes: ${playerDefenseBefore}, depois: ${combatState.player.attributes.defense}`)
  console.log(`Buffs ativos: ${combatState.player.activeBuffs.length}`)

  console.log("\n✅ Teste concluído!")
  return combatState
} 