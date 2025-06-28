"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CharacterType } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface ArenaSelectionProps {
  character: CharacterType
  onArenaSelect: (arena: string) => void
  onBack: () => void
}

export function ArenaSelection({ character, onArenaSelect, onBack }: ArenaSelectionProps) {
  const arenas = [
    {
      id: "local-dojo",
      name: "Dojo Local",
      description: "Arena pequena com pouca torcida. Ambiente tranquilo para iniciantes.",
      modifiers: ["Ambiente confortável"],
      minRank: "Iniciante",
    },
    {
      id: "regional-arena",
      name: "Arena Regional",
      description: "Arena média com torcida local. Bom para lutadores amadores regionais.",
      modifiers: ["Torcida mista", "Pressão moderada"],
      minRank: "Amador Regional",
    },
    {
      id: "national-stadium",
      name: "Estádio Nacional",
      description: "Grande arena com torcida nacional. Ideal para lutadores amadores nacionais.",
      modifiers: ["Torcida contra", "Alta pressão"],
      minRank: "Amador Nacional",
    },
    {
      id: "world-championship",
      name: "Campeonato Mundial",
      description: "Arena internacional com torcida global. Para os melhores lutadores amadores.",
      modifiers: ["Torcida mista", "Pressão extrema"],
      minRank: "Amador Mundial",
    },
    {
      id: "kokugikan-arena",
      name: "Arena Kokugikan",
      description: "A lendária arena de sumô no Japão. Apenas para profissionais.",
      modifiers: ["Torcida contra", "Pressão máxima", "Tradição"],
      minRank: "Profissional Japonês",
    },
  ]

  const isArenaAvailable = (minRank: string) => {
    const ranks = ["Iniciante", "Amador Regional", "Amador Nacional", "Amador Mundial", "Profissional Japonês"]
    const characterRankIndex = ranks.indexOf(character.rank)
    const arenaRankIndex = ranks.indexOf(minRank)

    return characterRankIndex >= arenaRankIndex
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-amber-900">Selecione uma Arena</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {arenas.map((arena) => {
            const available = isArenaAvailable(arena.minRank)

            return (
              <Card key={arena.id} className={`${!available ? "opacity-50" : "cursor-pointer hover:shadow-md"}`}>
                <CardHeader>
                  <CardTitle>{arena.name}</CardTitle>
                  <CardDescription>{arena.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Modificadores:</p>
                    <ul className="list-disc pl-5 text-sm">
                      {arena.modifiers.map((modifier) => (
                        <li key={modifier}>{modifier}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => available && onArenaSelect(arena.id)}
                    disabled={!available}
                    className="w-full bg-amber-800 hover:bg-amber-900"
                  >
                    {available ? "Competir" : `Requer Rank: ${arena.minRank}`}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}

