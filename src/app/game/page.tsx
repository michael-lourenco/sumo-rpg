"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getCharacter, updateCharacter, addSkillPoints } from "@/lib/game-state"
import type { CharacterType, ActivityType } from "@/lib/types"
import { DailyActivities } from "@/components/daily-activities"
import { CharacterStats } from "@/components/character-stats"
import { ArenaSelection } from "@/components/arena-selection"
import { TurnBasedCombat } from "@/components/turn-based-combat"
import { SkillTree } from "@/components/skill-tree"
import { CombatManager } from "@/lib/combat"
import { SkillManager } from "@/lib/skills"

export default function Game() {
  const router = useRouter()
  const [character, setCharacter] = useState<CharacterType | null>(null)
  const [gameState, setGameState] = useState<"daily" | "arena" | "combat">("daily")
  const [selectedArena, setSelectedArena] = useState<string | null>(null)
  const [opponent, setOpponent] = useState<any | null>(null)

  useEffect(() => {
    const savedCharacter = getCharacter()
    if (!savedCharacter) {
      router.push("/create-character")
      return
    }

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
      updatedCharacter.level += 1
      updatedCharacter.experience = 0
      // Adiciona pontos de habilidade ao subir de nível
      updatedCharacter = addSkillPoints(updatedCharacter, 2)
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

  const handleCombatEnd = (result: "win" | "lose") => {
    if (!character) return

    let updatedCharacter = { ...character }

    if (result === "win") {
      updatedCharacter.wins += 1
      updatedCharacter.money += 500 * updatedCharacter.level
      updatedCharacter.experience += 50

      // Rank up based on wins
      if (updatedCharacter.wins === 5 && updatedCharacter.rank === "Iniciante") {
        updatedCharacter.rank = "Amador Regional"
      } else if (updatedCharacter.wins === 10 && updatedCharacter.rank === "Amador Regional") {
        updatedCharacter.rank = "Amador Nacional"
      } else if (updatedCharacter.wins === 15 && updatedCharacter.rank === "Amador Nacional") {
        updatedCharacter.rank = "Amador Mundial"
      } else if (updatedCharacter.wins === 20 && updatedCharacter.rank === "Amador Mundial") {
        updatedCharacter.rank = "Profissional Japonês"
      } else if (updatedCharacter.wins === 25 && updatedCharacter.rank === "Profissional Japonês") {
        // Game completed
        router.push("/game-completed")
        return
      }
    } else {
      updatedCharacter.losses += 1
    }

    // Level up if enough experience
    if (updatedCharacter.experience >= updatedCharacter.level * 100) {
      updatedCharacter.level += 1
      updatedCharacter.experience = 0
      // Adiciona pontos de habilidade ao subir de nível
      updatedCharacter = addSkillPoints(updatedCharacter, 2)
    }

    updateCharacter(updatedCharacter)
    setCharacter(updatedCharacter)
    setGameState("daily")
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

