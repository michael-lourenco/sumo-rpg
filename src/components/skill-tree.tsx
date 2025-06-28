"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CharacterType, SkillTreeNode } from "@/lib/types"
import { SKILL_TREE, SkillManager } from "@/lib/skills"
import { updateCharacter } from "@/lib/game-state"
import { Sword, Shield, Zap, Lock, Check } from "lucide-react"

interface SkillTreeProps {
  character: CharacterType
  onCharacterUpdate: (character: CharacterType) => void
}

export function SkillTree({ character, onCharacterUpdate }: SkillTreeProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  const handleLearnSkill = (skillId: string) => {
    try {
      const updatedCharacter = SkillManager.learnSkill(character, skillId)
      updateCharacter(updatedCharacter)
      onCharacterUpdate(updatedCharacter)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao aprender habilidade")
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

  const getSkillStatus = (skillNode: SkillTreeNode) => {
    if (character.learnedSkills.includes(skillNode.id)) {
      return "learned"
    }
    if (SkillManager.canLearnSkill(character, skillNode.id)) {
      return "available"
    }
    return "locked"
  }

  const renderSkillNode = (skillNode: SkillTreeNode) => {
    const status = getSkillStatus(skillNode)
    const skill = skillNode.skill

    return (
      <Card
        key={skillNode.id}
        className={`relative cursor-pointer transition-all hover:shadow-md ${
          status === "learned" 
            ? "border-green-500 bg-green-50" 
            : status === "available" 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 bg-gray-50 opacity-60"
        }`}
        onClick={() => setSelectedSkill(skillNode.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {getSkillIcon(skill.type)}
            <CardTitle className="text-sm">{skill.name}</CardTitle>
            {status === "learned" && <Check size={16} className="text-green-600" />}
            {status === "locked" && <Lock size={16} className="text-gray-500" />}
          </div>
          <CardDescription className="text-xs">{skill.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Custo:</span>
              <span>{skill.cost} pontos</span>
            </div>
            <div className="flex justify-between">
              <span>Energia:</span>
              <span>{skill.energyCost}</span>
            </div>
            {skill.effects.damage && (
              <div className="flex justify-between">
                <span>Dano:</span>
                <span>{skill.effects.damage}</span>
              </div>
            )}
            {skill.effects.healing && (
              <div className="flex justify-between">
                <span>Cura:</span>
                <span>{skill.effects.healing}</span>
              </div>
            )}
            {skill.cooldown > 0 && (
              <div className="flex justify-between">
                <span>Cooldown:</span>
                <span>{skill.cooldown} turnos</span>
              </div>
            )}
          </div>
          
          {status === "available" && (
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation()
                handleLearnSkill(skillNode.id)
              }}
            >
              Aprender ({skill.cost} pts)
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderSkillDetails = () => {
    if (!selectedSkill) return null

    const skillNode = SKILL_TREE.find(node => node.id === selectedSkill)
    if (!skillNode) return null

    const skill = skillNode.skill
    const status = getSkillStatus(skillNode)

    return (
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            {getSkillIcon(skill.type)}
            <CardTitle>{skill.name}</CardTitle>
          </div>
          <CardDescription>{skill.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Tipo:</span> {skill.type}
            </div>
            <div>
              <span className="font-medium">Custo:</span> {skill.cost} pontos
            </div>
            <div>
              <span className="font-medium">Energia:</span> {skill.energyCost}
            </div>
            <div>
              <span className="font-medium">Cooldown:</span> {skill.cooldown} turnos
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Efeitos:</h4>
            <ul className="space-y-1 text-sm">
              {skill.effects.damage && (
                <li>• Causa {skill.effects.damage} de dano</li>
              )}
              {skill.effects.healing && (
                <li>• Cura {skill.effects.healing} de vida</li>
              )}
              {skill.effects.buffs && Object.entries(skill.effects.buffs).map(([attr, value]) => (
                <li key={attr}>• Aumenta {attr} em {value}</li>
              ))}
              {skill.effects.debuffs && Object.entries(skill.effects.debuffs).map(([attr, value]) => (
                <li key={attr}>• Reduz {attr} do oponente em {value}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Requisitos:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Nível {skill.requirements.level}</li>
              {Object.entries(skill.requirements.attributes).map(([attr, value]) => (
                <li key={attr}>• {attr} {value}</li>
              ))}
              {skill.requirements.prerequisites.length > 0 && (
                <li>• Pré-requisitos: {skill.requirements.prerequisites.join(", ")}</li>
              )}
            </ul>
          </div>

          {status === "available" && (
            <Button
              className="w-full"
              onClick={() => handleLearnSkill(skillNode.id)}
            >
              Aprender Habilidade ({skill.cost} pontos)
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-900">Árvore de Habilidades</h2>
        <div className="text-sm text-amber-700">
          Pontos disponíveis: {character.skillPoints}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_TREE.map(renderSkillNode)}
      </div>

      {renderSkillDetails()}
    </div>
  )
} 