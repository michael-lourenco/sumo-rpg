"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createCharacter } from "@/lib/game-state"

export default function CreateCharacter() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [country, setCountry] = useState("Brasil")
  const [attributes, setAttributes] = useState({
    strength: 5,
    dexterity: 5,
    mentalStrength: 5,
    speed: 5,
    defense: 5,
  })
  const [remainingPoints, setRemainingPoints] = useState(5)

  const handleAttributeChange = (attribute: string, value: number[]) => {
    const newValue = value[0]
    const oldValue = attributes[attribute as keyof typeof attributes]
    const pointDifference = newValue - oldValue

    if (remainingPoints - pointDifference < 0) return

    setAttributes({
      ...attributes,
      [attribute]: newValue,
    })

    setRemainingPoints(remainingPoints - pointDifference)
  }

  const handleSubmit = () => {
    if (!name) return

    createCharacter({
      name,
      country,
      attributes,
      level: 1,
      experience: 0,
      money: 1000,
      skills: [],
      passives: [],
      wins: 0,
      losses: 0,
      rank: "Iniciante",
    })

    router.push("/game")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">Crie seu Lutador de Sumô</CardTitle>
          <CardDescription>Defina o nome, país e distribua pontos nos atributos do seu lutador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Lutador</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do seu lutador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País de Origem</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Digite o país de origem"
            />
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Atributos</h3>
              <span className="text-sm text-amber-700">Pontos restantes: {remainingPoints}</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="strength">Força Física</Label>
                  <span>{attributes.strength}</span>
                </div>
                <Slider
                  id="strength"
                  min={1}
                  max={10}
                  step={1}
                  value={[attributes.strength]}
                  onValueChange={(value) => handleAttributeChange("strength", value)}
                  className="[&>span]:bg-amber-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="dexterity">Destreza</Label>
                  <span>{attributes.dexterity}</span>
                </div>
                <Slider
                  id="dexterity"
                  min={1}
                  max={10}
                  step={1}
                  value={[attributes.dexterity]}
                  onValueChange={(value) => handleAttributeChange("dexterity", value)}
                  className="[&>span]:bg-amber-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="mentalStrength">Força Mental</Label>
                  <span>{attributes.mentalStrength}</span>
                </div>
                <Slider
                  id="mentalStrength"
                  min={1}
                  max={10}
                  step={1}
                  value={[attributes.mentalStrength]}
                  onValueChange={(value) => handleAttributeChange("mentalStrength", value)}
                  className="[&>span]:bg-amber-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="speed">Velocidade</Label>
                  <span>{attributes.speed}</span>
                </div>
                <Slider
                  id="speed"
                  min={1}
                  max={10}
                  step={1}
                  value={[attributes.speed]}
                  onValueChange={(value) => handleAttributeChange("speed", value)}
                  className="[&>span]:bg-amber-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="defense">Defesa</Label>
                  <span>{attributes.defense}</span>
                </div>
                <Slider
                  id="defense"
                  min={1}
                  max={10}
                  step={1}
                  value={[attributes.defense]}
                  onValueChange={(value) => handleAttributeChange("defense", value)}
                  className="[&>span]:bg-amber-800"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!name} className="w-full bg-amber-800 hover:bg-amber-900">
            Começar Jornada
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

