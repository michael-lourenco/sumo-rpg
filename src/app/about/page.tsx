import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Save, Play, Plus, Trophy, Target, Zap, Shield, Heart } from "lucide-react"

export default function About() {
  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-amber-900 flex items-center gap-2">
              <Trophy className="text-amber-600" />
              Como Jogar Sumo Legends
            </CardTitle>
            <CardDescription>Um guia completo para se tornar um campeão de sumô</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">🎯 Introdução</h2>
              <p>
                Sumo Legends é um RPG baseado em texto onde você treina e compete como um lutador de sumô, progredindo
                de iniciante até campeão mundial. Seu objetivo é se tornar o primeiro estrangeiro a vencer o campeonato
                profissional japonês de sumô.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800 flex items-center gap-2">
                <Users />
                Sistema de Múltiplos Saves
              </h2>
              <p>
                O jogo agora suporta até <strong>3 personagens independentes</strong>, cada um com seu próprio progresso:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Criar Novo Personagem:</span> Comece uma nova jornada com atributos personalizados
                </li>
                <li>
                  <span className="font-medium">Continuar Jogo:</span> Carregue um personagem existente para continuar sua progressão
                </li>
                <li>
                  <span className="font-medium">Gerenciar Saves:</span> Visualize, ative ou delete seus personagens salvos
                </li>
                <li>
                  <span className="font-medium">Save Ativo:</span> Apenas um personagem pode estar ativo por vez
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800 flex items-center gap-2">
                <Target />
                Atributos do Personagem
              </h2>
              <p>Seu lutador possui cinco atributos principais que determinam seu desempenho:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                  <Zap className="text-red-600" size={16} />
                  <span className="font-medium">Força Física:</span> Poder dos ataques
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                  <Target className="text-blue-600" size={16} />
                  <span className="font-medium">Destreza:</span> Precisão dos golpes
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                  <Heart className="text-purple-600" size={16} />
                  <span className="font-medium">Força Mental:</span> Resistência à pressão
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                  <Zap className="text-green-600" size={16} />
                  <span className="font-medium">Velocidade:</span> Rapidez de movimento
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded md:col-span-2">
                  <Shield className="text-gray-600" size={16} />
                  <span className="font-medium">Defesa:</span> Capacidade de resistir ataques
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">📅 Atividades Diárias</h2>
              <p>
                A cada dia, você pode escolher entre treinar para melhorar seus atributos ou trabalhar para ganhar
                dinheiro. Balancear essas atividades é crucial para o seu sucesso.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-green-800">🏋️ Treinamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li>Melhora atributos específicos</li>
                      <li>Custa dinheiro</li>
                      <li>Gera experiência</li>
                      <li>Prepara para combates</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-blue-800">💼 Trabalho</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li>Ganha dinheiro</li>
                      <li>Não melhora atributos</li>
                      <li>Gera experiência</li>
                      <li>Financia treinamentos</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">⚔️ Sistema de Combate</h2>
              <p>
                O combate é baseado em turnos onde você escolhe ações baseadas nos seus atributos e habilidades aprendidas.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Arenas Diferentes:</span> Cada arena tem modificadores específicos (torcida, ambiente, pressão)
                </li>
                <li>
                  <span className="font-medium">Oponentes Dinâmicos:</span> Baseados no seu nível e na arena escolhida
                </li>
                <li>
                  <span className="font-medium">Habilidades Especiais:</span> Aprenda e use habilidades únicas para combate
                </li>
                <li>
                  <span className="font-medium">Histórico de Combates:</span> Acompanhe suas vitórias e derrotas
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">📈 Sistema de Progressão</h2>
              <p>Você progride através dos seguintes rankings baseados em vitórias:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>🥉 Iniciante</span>
                  <span className="text-sm text-gray-600">0-4 vitórias</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>🥈 Iniciante Avançado</span>
                  <span className="text-sm text-gray-600">5-9 vitórias</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>🏆 Amador Regional</span>
                  <span className="text-sm text-gray-600">10-14 vitórias</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>🏆 Amador Nacional</span>
                  <span className="text-sm text-gray-600">15-19 vitórias</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>🏆 Amador Mundial</span>
                  <span className="text-sm text-gray-600">20-24 vitórias</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded border-amber-200">
                  <span>👑 Profissional Japonês</span>
                  <span className="text-sm text-amber-600 font-medium">25+ vitórias</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Objetivo:</strong> Vencer 25 combates para se tornar Profissional Japonês e completar o jogo.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">🎮 Como Começar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <Plus className="mx-auto text-amber-600" size={24} />
                    <CardTitle className="text-base">1. Criar Personagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Escolha nome, país e distribua pontos nos atributos</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <Play className="mx-auto text-amber-600" size={24} />
                    <CardTitle className="text-base">2. Treinar e Trabalhar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Balanceie atividades para melhorar atributos e ganhar dinheiro</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardHeader className="pb-2">
                    <Trophy className="mx-auto text-amber-600" size={24} />
                    <CardTitle className="text-base">3. Competir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Entre em arenas e lute para subir de ranking</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-800">💾 Dicas de Jogo</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Salve frequentemente:</span> Seu progresso é salvo automaticamente
                </li>
                <li>
                  <span className="font-medium">Balance atributos:</span> Não foque apenas em um atributo
                </li>
                <li>
                  <span className="font-medium">Gerenciar dinheiro:</span> Trabalhe para financiar treinamentos
                </li>
                <li>
                  <span className="font-medium">Aprenda habilidades:</span> Use pontos de habilidade estrategicamente
                </li>
                <li>
                  <span className="font-medium">Múltiplos personagens:</span> Experimente diferentes estratégias
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="default" className="bg-amber-800 hover:bg-amber-900">
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/create-character">
            <Button variant="outline" className="border-amber-800 text-amber-800 hover:bg-amber-100">
              Criar Personagem
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

