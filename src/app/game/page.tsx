"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getCharacter, updateCharacter, addSkillPoints, levelUp, updateRank } from "@/lib/game-state"
import { addCombatHistory } from "@/lib/storage"
import type { CharacterType, ActivityType, CombatHistoryEntry } from "@/lib/types"
import { DailyActivities } from "@/components/daily-activities"
import { CharacterStats } from "@/components/character-stats"
import { ArenaSelection } from "@/components/arena-selection"
import { TurnBasedCombat } from "@/components/turn-based-combat"
import { SkillTree } from "@/components/skill-tree"
import { ActiveSaveInfo } from "@/components/active-save-info"
import { CombatManager } from "@/lib/combat"
import { SkillManager } from "@/lib/skills"
import { Button } from "@/components/ui/button"

export default function Game() {
  const router = useRouter()
  const [character, setCharacter] = useState<CharacterType | null>(null)
  const [gameState, setGameState] = useState<"daily" | "arena" | "combat">("daily")
  const [selectedArena, setSelectedArena] = useState<string | null>(null)
  const [opponent, setOpponent] = useState<any | null>(null)

  useEffect(() => {
    console.log("Game page - Carregando personagem...")
    
    const savedCharacter = getCharacter()
    console.log("Personagem obtido:", savedCharacter)
    
    if (!savedCharacter) {
      console.log("Nenhum personagem encontrado, redirecionando para create-character")
      router.push("/create-character")
      return
    }

    console.log("Personagem carregado com sucesso:", savedCharacter.name)
    setCharacter(savedCharacter)
  }, [router])

  const handleActivityComplete = (activity: ActivityType) => {
    if (!character) return

    let updatedCharacter = { ...character }

    // Update attributes based on activity
    if (activity.type === "training") {
      updatedCharacter.attributes[activity.attribute as keyof typeof updatedCharacter.attributes] += activity.value
      updatedCharacter.money -= activity.cost ?? 0
    } else if (activity.type === "work") {
      updatedCharacter.money += activity.value
    }

    // Add experience
    updatedCharacter.experience += activity.experience

    // Level up if enough experience
    if (updatedCharacter.experience >= updatedCharacter.level * 100) {
      updatedCharacter = levelUp(updatedCharacter)
    }

    updateCharacter(updatedCharacter)
    setCharacter(updatedCharacter)
  }

  const handleArenaSelect = (arena: string) => {
    setSelectedArena(arena)

    // Generate opponent based on arena and player level
    const generatedOpponent = generateOpponent(arena, character?.level || 1)
    setOpponent(generatedOpponent)

    setGameState("combat")
  }

  const handleCombatEnd = (result: "win" | "lose", turns: number = 1) => {
    if (!character || !opponent) return

    let updatedCharacter = { ...character }

    if (result === "win") {
      updatedCharacter.wins += 1
      updatedCharacter.money += 500 * updatedCharacter.level
      updatedCharacter.experience += 50
    } else {
      updatedCharacter.losses += 1
    }

    // Atualiza ranking baseado nas vitórias
    updatedCharacter = updateRank(updatedCharacter)

    // Level up if enough experience
    if (updatedCharacter.experience >= updatedCharacter.level * 100) {
      updatedCharacter = levelUp(updatedCharacter)
    }

    // Salva histórico de combate
    const combatEntry: CombatHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      playerName: character.name,
      opponentName: opponent.name,
      result,
      arena: selectedArena || "Arena Desconhecida",
      turns,
      playerLevel: character.level,
      opponentLevel: opponent.level
    }
    addCombatHistory(combatEntry)

    updateCharacter(updatedCharacter)
    setCharacter(updatedCharacter)
    setGameState("daily")

    // Verifica se o jogo foi completado
    if (result === "win" && updatedCharacter.wins >= 25) {
      router.push("/game-completed")
    }
  }

  const generateOpponent = (arena: string, playerLevel: number) => {
    // Generate opponent based on arena and player level
    const opponentLevel = playerLevel + Math.floor(Math.random() * 2) - 1
    const baseAttribute = 3 + opponentLevel

    // Gera habilidades básicas para o oponente
    const opponentSkills = ["basic-push", "basic-defense", "meditation"]

    return {
      name: getRandomOpponentName(),
      level: opponentLevel,
      attributes: {
        strength: baseAttribute + Math.floor(Math.random() * 3),
        dexterity: baseAttribute + Math.floor(Math.random() * 3),
        mentalStrength: baseAttribute + Math.floor(Math.random() * 3),
        speed: baseAttribute + Math.floor(Math.random() * 3),
        defense: baseAttribute + Math.floor(Math.random() * 3),
      },
      country: getRandomCountry(),
      skills: opponentSkills
    }
  }

  const getRandomOpponentName = () => {
    const names = ["Hakuho", "Kakuryu", "Kisenosato", "Harumafuji", "Terunofuji", "Takayasu", "Goeido", "Kotoshogiku"]
    return names[Math.floor(Math.random() * names.length)]
  }

  const getRandomCountry = () => {
    const countries = ["Japão", "Mongólia", "Geórgia", "Brasil", "EUA", "Rússia"]
    return countries[Math.floor(Math.random() * countries.length)]
  }

  if (!character) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  if (gameState === "combat") {
    // Converte personagem para formato de combate
    const playerCombat = CombatManager.initializeCombatCharacter(
      character.name,
      character.country,
      character.level,
      character.attributes,
      character.learnedSkills
    )

    const opponentCombat = CombatManager.initializeCombatCharacter(
      opponent.name,
      opponent.country,
      opponent.level,
      opponent.attributes,
      opponent.skills
    )

    return (
      <TurnBasedCombat
        player={playerCombat}
        opponent={opponentCombat}
        arena={selectedArena || ""}
        onCombatEnd={handleCombatEnd}
      />
    )
  }

  if (gameState === "arena") {
    return (
      <ArenaSelection character={character} onArenaSelect={handleArenaSelect} onBack={() => setGameState("daily")} />
    )
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto">
        {/* Informações do save ativo */}
        <ActiveSaveInfo onBackToMenu={() => router.push("/")} />

        <div className="mb-6 bg-white rounded-lg p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-amber-900">{character.name}</h1>
              <p className="text-amber-700">
                {character.country} • Nível {character.level} • {character.rank}
              </p>
            </div>
            <div className="text-right">
              <p className="text-amber-700">¥ {character.money}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm">EXP:</span>
                <Progress value={(character.experience / (character.level * 100)) * 100} className="w-24 h-2" />
              </div>
              <p className="text-sm text-amber-700">Pontos de Habilidade: {character.skillPoints}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="daily">Atividades Diárias</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="compete" onClick={() => setGameState("arena")}>
              Competir
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <DailyActivities character={character} onActivityComplete={handleActivityComplete} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillTree character={character} onCharacterUpdate={setCharacter} />
          </TabsContent>

          <TabsContent value="stats">
            <CharacterStats character={character} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

