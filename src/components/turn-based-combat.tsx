"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CombatState, CombatCharacter, SkillType } from "@/lib/types"
import { CombatManager } from "@/lib/combat"
import { SKILLS } from "@/lib/skills"
import { Sword, Shield, Zap, Heart, Zap as Energy } from "lucide-react"

interface TurnBasedCombatProps {
  player: CombatCharacter
  opponent: CombatCharacter
  arena: string
  onCombatEnd: (result: "win" | "lose") => void
}

export function TurnBasedCombat({ player, opponent, arena, onCombatEnd }: TurnBasedCombatProps) {
  const [combatState, setCombatState] = useState<CombatState | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [isAITurn, setIsAITurn] = useState(false)

  useEffect(() => {
    const initialState = CombatManager.initializeCombat(player, opponent)
    setCombatState(initialState)
  }, [player, opponent])

  useEffect(() => {
    if (combatState?.gameOver) {
      onCombatEnd(combatState.winner === "player" ? "win" : "lose")
      return
    }

    // IA joga automaticamente
    if (combatState && combatState.currentTurn === "opponent" && !isAITurn) {
      setIsAITurn(true)
      setTimeout(() => {
        const aiAction = CombatManager.getAIAction(combatState)
        if (aiAction !== "pass") {
          const newState = CombatManager.executeAction(combatState, aiAction, "player")
          setCombatState(newState)
        }
        setIsAITurn(false)
      }, 1000)
    }
  }, [combatState, onCombatEnd, isAITurn])

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId)
  }

  const handleSkillUse = () => {
    if (!selectedSkill || !combatState) return

    try {
      const newState = CombatManager.executeAction(combatState, selectedSkill, "opponent")
      setCombatState(newState)
      setSelectedSkill(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao usar habilidade")
    }
  }

  const getSkillIcon = (type: string) => {
    switch (type) {
      case "attack":
        return <Sword size={16} className="text-red-600" />
      case "defense":
        return <Shield size={16} className="text-blue-600" />
      case "utility":
        return <Zap size={16} className="text-yellow-600" />
      default:
        return <Sword size={16} />
    }
  }

  const renderCharacter = (character: CombatCharacter, isPlayer: boolean) => {
    const availableSkills = character.skills.map(skillId => SKILLS.find(s => s.id === skillId)).filter(Boolean) as SkillType[]

    return (
      <Card className={`${isPlayer ? "border-blue-500" : "border-red-500"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {character.name} ({character.country})
            {isPlayer && combatState?.currentTurn === "player" && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Seu turno</span>
            )}
            {!isPlayer && combatState?.currentTurn === "opponent" && (
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">Turno do oponente</span>
            )}
          </CardTitle>
          <CardDescription>Nível {character.level}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              <span className="text-sm">Vida</span>
              <Progress 
                value={(character.currentHealth / character.maxHealth) * 100} 
                className="flex-1" 
              />
              <span className="text-sm">{character.currentHealth}/{character.maxHealth}</span>
            </div>
            <div className="flex items-center gap-2">
              <Energy size={16} className="text-yellow-500" />
              <span className="text-sm">Energia</span>
              <Progress 
                value={(character.currentEnergy / character.maxEnergy) * 100} 
                className="flex-1" 
              />
              <span className="text-sm">{character.currentEnergy}/{character.maxEnergy}</span>
            </div>
          </div>

          {/* Buffs e Debuffs */}
          {(character.activeBuffs.length > 0 || character.activeDebuffs.length > 0) && (
            <div className="space-y-1">
              {character.activeBuffs.map((buff, index) => (
                <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {buff.name}: +{buff.value} {buff.attribute} ({buff.duration} turnos)
                </div>
              ))}
              {character.activeDebuffs.map((debuff, index) => (
                <div key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  {debuff.name}: -{debuff.value} {debuff.attribute} ({debuff.duration} turnos)
                </div>
              ))}
            </div>
          )}

          {/* Habilidades */}
          {isPlayer && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Habilidades:</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableSkills.map((skill) => {
                  const isOnCooldown = CombatManager.isValidAction(combatState!, skill.id, "opponent") === false
                  const isSelected = selectedSkill === skill.id
                  
                  return (
                    <Button
                      key={skill.id}
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      disabled={isOnCooldown || combatState?.currentTurn !== "player"}
                      onClick={() => handleSkillSelect(skill.id)}
                      className="justify-start text-xs"
                    >
                      <div className="flex items-center gap-1">
                        {getSkillIcon(skill.type)}
                        <span>{skill.name}</span>
                      </div>
                      {isOnCooldown && (
                        <span className="text-xs text-red-500 ml-1">
                          CD: {character.skillCooldowns[skill.id] || 0}
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderCombatLog = () => {
    if (!combatState) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle>Log de Combate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {combatState.log.map((entry, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                <div className="font-medium">Turno {entry.turn}: {entry.actor}</div>
                <div className="text-gray-600">
                  {entry.action} → {entry.target}
                </div>
                <div className="text-xs text-gray-500">{entry.effect}</div>
                {entry.damage && (
                  <div className="text-red-600">Dano: {entry.damage}</div>
                )}
                {entry.healing && (
                  <div className="text-green-600">Cura: {entry.healing}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!combatState) {
    return <div className="flex items-center justify-center">Carregando combate...</div>
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Combate por Turnos</h1>
          <p className="text-amber-700">Arena: {arena}</p>
          <p className="text-amber-700">Turno: {combatState.turn}</p>
        </div>

        {/* Personagens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCharacter(combatState.player, true)}
          {renderCharacter(combatState.opponent, false)}
        </div>

        {/* Ações do jogador */}
        {combatState.currentTurn === "player" && !combatState.gameOver && (
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSkill ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded">
                    <h4 className="font-medium">Habilidade selecionada:</h4>
                    <p>{SKILLS.find(s => s.id === selectedSkill)?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSkillUse} className="flex-1">
                      Usar Habilidade
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedSkill(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Selecione uma habilidade para usar</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Log de combate */}
        {renderCombatLog()}

        {/* Loading para turno da IA */}
        {isAITurn && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto mb-2"></div>
            <p>Oponente está pensando...</p>
          </div>
        )}
      </div>
    </div>
  )
} 