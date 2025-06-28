import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-amber-900 mb-4 tracking-tight">SUMO LEGENDS</h1>
        <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
          Treine seu lutador de sumô, conquiste torneios e torne-se uma lenda no mundo do sumô!
        </p>

        <div className="relative w-full h-64 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-amber-800 rounded-full flex items-center justify-center">
              <div className="w-40 h-40 bg-amber-200 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-amber-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/create-character" className="w-full max-w-xs">
            <Button variant="default" size="lg" className="w-full bg-amber-800 hover:bg-amber-900 text-lg">
              Novo Jogo
            </Button>
          </Link>

          <Link href="/about" className="w-full max-w-xs">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-amber-800 text-amber-800 hover:bg-amber-100 text-lg"
            >
              Como Jogar
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

