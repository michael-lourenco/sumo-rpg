import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-amber-900">Como Jogar Sumo Legends</CardTitle>
            <CardDescription>Um guia completo para se tornar um campeão de sumô</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">Introdução</h2>
              <p>
                Sumo Legends é um RPG baseado em texto onde você treina e compete como um lutador de sumô, progredindo
                de iniciante até campeão mundial. Seu objetivo é se tornar o primeiro estrangeiro a vencer o campeonato
                profissional japonês de sumô.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">Atributos</h2>
              <p>Seu lutador possui cinco atributos principais:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Força Física:</span> Determina o poder dos seus ataques
                </li>
                <li>
                  <span className="font-medium">Destreza:</span> Afeta a precisão dos seus golpes
                </li>
                <li>
                  <span className="font-medium">Força Mental:</span> Resistência à pressão e intimidação
                </li>
                <li>
                  <span className="font-medium">Velocidade:</span> Rapidez de movimento e reação
                </li>
                <li>
                  <span className="font-medium">Defesa:</span> Capacidade de resistir a ataques
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">Atividades Diárias</h2>
              <p>
                A cada dia, você pode escolher entre treinar para melhorar seus atributos ou trabalhar para ganhar
                dinheiro. Balancear essas atividades é crucial para o seu sucesso.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Treinamento:</span> Melhora atributos específicos, mas custa dinheiro
                </li>
                <li>
                  <span className="font-medium">Trabalho:</span> Ganha dinheiro, mas não melhora atributos
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">Combate</h2>
              <p>
                O combate é dividido em três fases: início, meio e finalização. Em cada fase, você escolhe uma ação
                baseada nos seus atributos e habilidades.
              </p>
              <p>
                Cada arena tem modificadores específicos que podem afetar seu desempenho, como torcida a favor, torcida
                contra, ambiente confortável ou pressão.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">Progressão</h2>
              <p>Você começa como um iniciante e progride através dos seguintes rankings:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Iniciante</li>
                <li>Amador Regional</li>
                <li>Amador Nacional</li>
                <li>Amador Mundial</li>
                <li>Profissional Japonês</li>
              </ol>
              <p>Vencer o campeonato profissional japonês completa o jogo.</p>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="default" className="bg-amber-800 hover:bg-amber-900">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

