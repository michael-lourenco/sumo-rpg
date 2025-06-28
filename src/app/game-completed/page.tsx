"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCharacter } from "@/lib/game-state"
import confetti from "canvas-confetti"

export default function GameCompleted() {
  const router = useRouter()
  const character = getCharacter()

  useEffect(() => {
    if (!character) {
      router.push("/")
      return
    }

    // Trigger confetti effect
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#f59e0b", "#d97706", "#b45309"],
      })

      confetti({
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#f59e0b", "#d97706", "#b45309"],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [router, character])

  if (!character) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-3xl w-full text-center space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Parabéns, Campeão Mundial!</h1>

        <div className="relative w-full h-64 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-amber-800 rounded-full flex items-center justify-center">
              <div className="w-40 h-40 bg-amber-200 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-amber-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xl text-amber-800 mb-8">
          {character.name} de {character.country} fez história ao se tornar o primeiro estrangeiro a vencer o Campeonato
          Mundial Japonês de Sumô!
        </p>

        <div className="space-y-4 text-left bg-amber-50 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-amber-900">Estatísticas Finais</h2>
          <p>
            <span className="font-medium">Nível:</span> {character.level}
          </p>
          <p>
            <span className="font-medium">Vitórias:</span> {character.wins}
          </p>
          <p>
            <span className="font-medium">Derrotas:</span> {character.losses}
          </p>
          <p>
            <span className="font-medium">Dinheiro acumulado:</span> ¥ {character.money}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center mt-8">
          <Button
            onClick={() => router.push("/")}
            variant="default"
            size="lg"
            className="w-full max-w-xs bg-amber-800 hover:bg-amber-900 text-lg"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </main>
  )
}

