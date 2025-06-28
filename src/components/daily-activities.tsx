"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharacterType, ActivityType } from "@/lib/types"
import { Dumbbell, Coins, Clock } from "lucide-react"

interface DailyActivitiesProps {
  character: CharacterType
  onActivityComplete: (activity: ActivityType) => void
}

export function DailyActivities({ character, onActivityComplete }: DailyActivitiesProps) {
  const [actionsLeft, setActionsLeft] = useState(3)
  const [dayComplete, setDayComplete] = useState(false)

  const handleActivitySelect = (activity: ActivityType) => {
    if (actionsLeft <= 0 || dayComplete) return

    // Check if player has enough money for training
    if (activity.type === "training" && character.money < (activity.cost ?? 0)) {
      return
    }

    onActivityComplete(activity)

    const newActionsLeft = actionsLeft - 1
    setActionsLeft(newActionsLeft)

    if (newActionsLeft <= 0) {
      setDayComplete(true)
    }
  }

  const resetDay = () => {
    setActionsLeft(3)
    setDayComplete(false)
  }

  const trainingActivities: ActivityType[] = [
    {
      name: "Levantamento de Peso",
      description: "Aumenta sua força física",
      type: "training",
      attribute: "strength",
      value: 1,
      cost: 200,
      experience: 10,
    },
    {
      name: "Treino de Agilidade",
      description: "Melhora sua destreza",
      type: "training",
      attribute: "dexterity",
      value: 1,
      cost: 200,
      experience: 10,
    },
    {
      name: "Meditação",
      description: "Fortalece sua mente",
      type: "training",
      attribute: "mentalStrength",
      value: 1,
      cost: 200,
      experience: 10,
    },
    {
      name: "Corrida",
      description: "Aumenta sua velocidade",
      type: "training",
      attribute: "speed",
      value: 1,
      cost: 200,
      experience: 10,
    },
    {
      name: "Treino Defensivo",
      description: "Melhora sua defesa",
      type: "training",
      attribute: "defense",
      value: 1,
      cost: 200,
      experience: 10,
    },
  ]

  const workActivities: ActivityType[] = [
    {
      name: "Segurança de Bar",
      description: "Trabalho simples, pagamento razoável",
      type: "work",
      value: 300,
      experience: 5,
    },
    {
      name: "Carregador de Mercadorias",
      description: "Trabalho físico pesado, bom pagamento",
      type: "work",
      value: 500,
      experience: 8,
    },
    {
      name: "Demonstração de Sumô",
      description: "Exibição para turistas, ótimo pagamento",
      type: "work",
      value: 800,
      experience: 12,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-900">Atividades Diárias</h2>
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>Ações restantes: {actionsLeft}/3</span>
        </div>
      </div>

      {dayComplete ? (
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-4">Dia Concluído!</h3>
          <p className="mb-6">Você completou todas as suas atividades para hoje.</p>
          <Button onClick={resetDay} className="bg-amber-800 hover:bg-amber-900">
            Avançar para o Próximo Dia
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Dumbbell size={20} className="text-amber-700" />
              Treinamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingActivities.map((activity) => (
                <Card
                  key={activity.name}
                  className={`cursor-pointer transition-all hover:shadow-md ${character.money < (activity.cost ?? 0) ? "opacity-50" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{activity.name}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-amber-700">Custo: ¥ {activity.cost}</p>
                    <p className="text-sm text-amber-700">Experiência: +{activity.experience}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleActivitySelect(activity)}
                      disabled={character.money < (activity.cost ?? 0)}
                      variant="outline"
                      className="w-full border-amber-800 text-amber-800 hover:bg-amber-100"
                    >
                      Treinar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Coins size={20} className="text-amber-700" />
              Trabalho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workActivities.map((activity) => (
                <Card key={activity.name} className="cursor-pointer transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{activity.name}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-amber-700">Ganho: ¥ {activity.value}</p>
                    <p className="text-sm text-amber-700">Experiência: +{activity.experience}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleActivitySelect(activity)}
                      variant="outline"
                      className="w-full border-amber-800 text-amber-800 hover:bg-amber-100"
                    >
                      Trabalhar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

