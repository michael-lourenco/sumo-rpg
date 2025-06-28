"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CharacterType } from "@/lib/types"
import { Shield, Sword } from "lucide-react"

interface CombatScreenProps {
  character: CharacterType
  opponent: any
  arena: string
  onCombatEnd: (result: "win" | "lose") => void
}

export function CombatScreen({ character, opponent, arena, onCombatEnd }: CombatScreenProps) {
  const [phase, setPhase] = useState<"intro" | "beginning" | "middle" | "end" | "result">("intro")
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [result, setResult] = useState<"win" | "lose" | null>(null)

  useEffect(() => {
    if (phase === "intro") {
      setCombatLog([
        `${character.name} entra na arena para enfrentar ${opponent.name} de ${opponent.country}.`,
        "A multidão aguarda ansiosamente o início do combate.",
      ])

      // Automatically advance to beginning phase after 3 seconds
      const timer = setTimeout(() => {
        setPhase("beginning")
        setCombatLog((prev) => [...prev, "Os lutadores se posicionam para o início do combate."])
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [phase, character.name, opponent.name, opponent.country])

  const getArenaName = () => {
    switch (arena) {
      case "local-dojo":
        return "Dojo Local"
      case "regional-arena":
        return "Arena Regional"
      case "national-stadium":
        return "Estádio Nacional"
      case "world-championship":
        return "Campeonato Mundial"
      case "kokugikan-arena":
        return "Arena Kokugikan"
      default:
        return "Arena"
    }
  }

  const getArenaModifiers = () => {
    switch (arena) {
      case "local-dojo":
        return { strength: 0, dexterity: 0, mentalStrength: 1, speed: 0, defense: 0 }
      case "regional-arena":
        return { strength: 0, dexterity: 0, mentalStrength: -1, speed: 1, defense: 0 }
      case "national-stadium":
        return { strength: 1, dexterity: 0, mentalStrength: -2, speed: 0, defense: 0 }
      case "world-championship":
        return { strength: 1, dexterity: 1, mentalStrength: -2, speed: 1, defense: 0 }
      case "kokugikan-arena":
        return { strength: 2, dexterity: 0, mentalStrength: -3, speed: 0, defense: 1 }
      default:
        return { strength: 0, dexterity: 0, mentalStrength: 0, speed: 0, defense: 0 }
    }
  }

  const getPhaseActions = () => {
    switch (phase) {
      case "beginning":
        return [
          {
            id: "intimidate",
            name: "Intimidar",
            description: "Tenta intimidar o oponente com um olhar ameaçador",
            attribute: "mentalStrength",
          },
          {
            id: "stance",
            name: "Postura Defensiva",
            description: "Adota uma postura defensiva para o início do combate",
            attribute: "defense",
          },
          {
            id: "quick-start",
            name: "Início Rápido",
            description: "Tenta surpreender o oponente com um início rápido",
            attribute: "speed",
          },
        ]
      case "middle":
        return [
          {
            id: "push",
            name: "Empurrão Forte",
            description: "Usa força bruta para empurrar o oponente",
            attribute: "strength",
          },
          {
            id: "sidestep",
            name: "Esquiva Lateral",
            description: "Tenta esquivar e pegar o oponente desprevenido",
            attribute: "dexterity",
          },
          {
            id: "crowd-cheer",
            name: "Brado da Torcida",
            description: "Incentiva a torcida a gritar, aumentando sua confiança",
            attribute: "mentalStrength",
          },
        ]
      case "end":
        return [
          {
            id: "final-push",
            name: "Empurrão Final",
            description: "Um último esforço de força para derrubar o oponente",
            attribute: "strength",
          },
          {
            id: "judo-move",
            name: "Golpe de Judô",
            description: "Usa técnica de judô para derrubar o oponente",
            attribute: "dexterity",
          },
          {
            id: "endurance",
            name: "Resistência",
            description: "Aguenta firme e espera o oponente cometer um erro",
            attribute: "defense",
          },
        ]
      default:
        return []
    }
  }

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId)

    const action = getPhaseActions().find((a) => a.id === actionId)
    if (!action) return

    // Calculate success based on player attribute vs opponent attribute
    const arenaModifiers = getArenaModifiers()
    const playerAttributeValue =
      character.attributes[action.attribute as keyof typeof character.attributes] +
      (arenaModifiers[action.attribute as keyof typeof arenaModifiers] || 0)

    const opponentAttributeValue = opponent.attributes[action.attribute as keyof typeof opponent.attributes]

    const successChance = (playerAttributeValue / (playerAttributeValue + opponentAttributeValue)) * 100
    const success = Math.random() * 100 < successChance

    // Update health based on success
    if (success) {
      const damage = Math.floor(Math.random() * 20) + 10 // 10-30 damage
      setOpponentHealth((prev) => Math.max(0, prev - damage))
      setCombatLog((prev) => [
        ...prev,
        `${character.name} usa ${action.name} com sucesso! ${opponent.name} perde ${damage} de saúde.`,
      ])
    } else {
      const damage = Math.floor(Math.random() * 15) + 5 // 5-20 damage
      setPlayerHealth((prev) => Math.max(0, prev - damage))
      setCombatLog((prev) => [
        ...prev,
        `${character.name} tenta ${action.name}, mas ${opponent.name} contra-ataca! Você perde ${damage} de saúde.`,
      ])
    }

    // Move to next phase
    setTimeout(() => {
      if (playerHealth <= 0) {
        setResult("lose")
        setPhase("result")
        setCombatLog((prev) => [...prev, `${character.name} foi derrotado por ${opponent.name}!`])
      } else if (opponentHealth <= 0) {
        setResult("win")
        setPhase("result")
        setCombatLog((prev) => [...prev, `${character.name} venceu o combate contra ${opponent.name}!`])
      } else {
        if (phase === "beginning") {
          setPhase("middle")
          setCombatLog((prev) => [...prev, "O combate entra na fase intermediária."])
        } else if (phase === "middle") {
          setPhase("end")
          setCombatLog((prev) => [...prev, "O combate chega à fase final."])
        } else if (phase === "end") {
          // Determine winner based on remaining health
          if (playerHealth > opponentHealth) {
            setResult("win")
          } else {
            setResult("lose")
          }
          setPhase("result")

          if (playerHealth > opponentHealth) {
            setCombatLog((prev) => [...prev, `${character.name} venceu o combate contra ${opponent.name}!`])
          } else {
            setCombatLog((prev) => [...prev, `${character.name} foi derrotado por ${opponent.name}!`])
          }
        }
      }

      setSelectedAction(null)
    }, 1500)
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 bg-white rounded-lg p-4 shadow-md">
          <h1 className="text-2xl font-bold text-amber-900">Combate em {getArenaName()}</h1>
          <p className="text-amber-700">
            {phase === "intro" && "Preparando-se para o combate..."}
            {phase === "beginning" && "Fase Inicial"}
            {phase === "middle" && "Fase Intermediária"}
            {phase === "end" && "Fase Final"}
            {phase === "result" && (result === "win" ? "Vitória!" : "Derrota!")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{character.name}</CardTitle>
              <CardDescription>
                {character.country} • Nível {character.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Saúde</span>
                  <span>{playerHealth}%</span>
                </div>
                <Progress value={playerHealth} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{opponent.name}</CardTitle>
              <CardDescription>
                {opponent.country} • Nível {opponent.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Saúde</span>
                  <span>{opponentHealth}%</span>
                </div>
                <Progress value={opponentHealth} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {phase !== "intro" &&
            phase !== "result" &&
            getPhaseActions().map((action) => (
              <Card
                key={action.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedAction ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => !selectedAction && handleActionSelect(action.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{action.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{action.description}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    {action.attribute === "strength" && <Sword size={16} className="text-red-600" />}
                    {action.attribute === "defense" && <Shield size={16} className="text-blue-600" />}
                    <span className="text-sm">
                      Baseado em{" "}
                      {action.attribute === "strength"
                        ? "Força"
                        : action.attribute === "dexterity"
                          ? "Destreza"
                          : action.attribute === "mentalStrength"
                            ? "Força Mental"
                            : action.attribute === "speed"
                              ? "Velocidade"
                              : "Defesa"}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Log de Combate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 overflow-y-auto space-y-2 p-2 bg-amber-50 rounded">
              {combatLog.map((log, index) => (
                <p key={index} className="text-sm">
                  {log}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {phase === "result" && (
          <div className="flex justify-center">
            <Button onClick={() => onCombatEnd(result as "win" | "lose")} className="bg-amber-800 hover:bg-amber-900">
              Voltar ao Treinamento
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

