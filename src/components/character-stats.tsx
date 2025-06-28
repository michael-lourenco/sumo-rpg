import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CharacterType } from "@/lib/types"
import { Trophy, Award } from "lucide-react"

interface CharacterStatsProps {
  character: CharacterType
}

export function CharacterStats({ character }: CharacterStatsProps) {
  const { attributes, wins, losses, rank } = character

  const getRankColor = () => {
    switch (rank) {
      case "Iniciante":
        return "text-gray-600"
      case "Amador Regional":
        return "text-amber-600"
      case "Amador Nacional":
        return "text-amber-700"
      case "Amador Mundial":
        return "text-amber-800"
      case "Profissional Japonês":
        return "text-amber-900"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-amber-900">Atributos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Força Física</span>
              <span>{attributes.strength}</span>
            </div>
            <Progress value={attributes.strength * 10} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Destreza</span>
              <span>{attributes.dexterity}</span>
            </div>
            <Progress value={attributes.dexterity * 10} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Força Mental</span>
              <span>{attributes.mentalStrength}</span>
            </div>
            <Progress value={attributes.mentalStrength * 10} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Velocidade</span>
              <span>{attributes.speed}</span>
            </div>
            <Progress value={attributes.speed * 10} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Defesa</span>
              <span>{attributes.defense}</span>
            </div>
            <Progress value={attributes.defense * 10} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
              <Trophy size={20} />
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Vitórias</span>
                <span className="font-semibold text-green-600">{wins}</span>
              </div>
              <div className="flex justify-between">
                <span>Derrotas</span>
                <span className="font-semibold text-red-600">{losses}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Lutas</span>
                <span>{wins + losses}</span>
              </div>
              {wins + losses > 0 && (
                <div className="flex justify-between">
                  <span>Taxa de Vitória</span>
                  <span>{Math.round((wins / (wins + losses)) * 100)}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
              <Award size={20} />
              Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <span className={`text-2xl font-bold ${getRankColor()}`}>{rank}</span>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {rank === "Iniciante" && "Vença 5 lutas para subir de ranking"}
                  {rank === "Amador Regional" && "Vença 10 lutas para subir de ranking"}
                  {rank === "Amador Nacional" && "Vença 15 lutas para subir de ranking"}
                  {rank === "Amador Mundial" && "Vença 20 lutas para subir de ranking"}
                  {rank === "Profissional Japonês" && "Vença 25 lutas para se tornar campeão mundial"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

