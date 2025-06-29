"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SaveManager } from "@/components/save-manager"
import { SaveDebug } from "@/components/save-debug"
import { hasSaves, migrateOldSave, getSaveCount, getSaveMetadata, getActiveSave } from "@/lib/storage"
import { Save, Play, Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { ClientOnly } from "@/components/client-only"

export default function Home() {
  const [showSaveManager, setShowSaveManager] = useState(false)
  const [hasExistingSaves, setHasExistingSaves] = useState(false)
  const [saveCount, setSaveCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadSaveInfo()
  }, [])

  const loadSaveInfo = () => {
    setIsLoading(true)
    
    // Migra dados antigos se necessário
    migrateOldSave()
    
    // Verifica se há saves existentes
    const hasSavesResult = hasSaves()
    const count = getSaveCount()
    
    console.log("Debug - Saves encontrados:", hasSavesResult, "Count:", count)
    
    setHasExistingSaves(hasSavesResult)
    setSaveCount(count)
    setIsLoading(false)
  }

  const handleNewGame = () => {
    setShowSaveManager(false)
  }

  const handleSaveSelected = () => {
    setShowSaveManager(false)
    // Recarrega informações após seleção
    setTimeout(loadSaveInfo, 100)
  }

  const handleContinueGame = async () => {
    console.log("handleContinueGame - Iniciando continuação do jogo")
    
    // Aguarda um pouco para garantir que tudo foi inicializado
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log("handleContinueGame - Verificando save ativo...")
    const activeSave = getActiveSave()
    console.log("handleContinueGame - Save ativo encontrado:", activeSave)
    
    if (activeSave) {
      console.log("handleContinueGame - Save ativo válido, redirecionando...")
      // Aguarda um pouco antes do redirecionamento
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push("/game")
    } else {
      console.log("handleContinueGame - Nenhum save ativo encontrado")
      alert("Nenhum save ativo encontrado. Por favor, crie um novo personagem ou carregue um save existente.")
    }
  }

  if (showSaveManager) {
    return (
      <ClientOnly
        fallback={
          <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
            <div className="max-w-6xl mx-auto">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
                <p className="text-amber-800">Carregando...</p>
              </div>
            </div>
          </main>
        }
      >
        <main className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-amber-100">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button 
                onClick={() => {
                  setShowSaveManager(false)
                  loadSaveInfo() // Recarrega ao voltar
                }}
                variant="outline"
                className="mb-4"
              >
                ← Voltar ao Menu Principal
              </Button>
            </div>
            
            <SaveManager 
              onSaveSelected={handleSaveSelected}
              onNewGame={handleNewGame}
            />
          </div>
        </main>
      </ClientOnly>
    )
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">Carregando...</p>
        </div>
      </main>
    )
  }

  return (
    <ClientOnly
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
            <p className="text-amber-800">Carregando...</p>
          </div>
        </main>
      }
    >
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

          {/* Status dos Saves */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="text-amber-600" size={20} />
                Status dos Saves
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm">
                {hasExistingSaves ? (
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">
                      ✓ {saveCount} save{saveCount > 1 ? 's' : ''} encontrado{saveCount > 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-600">
                      Clique em "Continuar Jogo" para carregar um save existente
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-amber-600 font-medium">
                      Nenhum save encontrado
                    </p>
                    <p className="text-gray-600">
                      Clique em "Novo Jogo" para criar seu primeiro personagem
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 items-center">
            {hasExistingSaves ? (
              <>
                <Button 
                  onClick={handleContinueGame}
                  variant="default" 
                  size="lg" 
                  className="w-full max-w-xs bg-amber-800 hover:bg-amber-900 text-lg"
                >
                  <Play className="mr-2" size={20} />
                  Continuar Jogo ({saveCount} save{saveCount > 1 ? 's' : ''})
                </Button>
                
                <Button 
                  onClick={() => setShowSaveManager(true)}
                  variant="outline"
                  size="lg" 
                  className="w-full max-w-xs border-amber-800 text-amber-800 hover:bg-amber-100 text-lg"
                >
                  <Save className="mr-2" size={20} />
                  Gerenciar Saves
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setShowSaveManager(true)}
                variant="default" 
                size="lg" 
                className="w-full max-w-xs bg-amber-800 hover:bg-amber-900 text-lg"
              >
                <Plus className="mr-2" size={20} />
                Novo Jogo
              </Button>
            )}

            <Button
              onClick={() => window.open('/about', '_blank')}
              variant="outline"
              size="lg" 
              className="w-full max-w-xs border-amber-800 text-amber-800 hover:bg-amber-100 text-lg"
            >
              Como Jogar
            </Button>

            {/* Botão de teste temporário */}
            <Button
              onClick={() => {
                console.log("=== TESTE DO SISTEMA DE SAVES ===")
                const { hasSaves, getSaveCount, getSaveMetadata, getActiveSave } = require("@/lib/storage")
                console.log("hasSaves:", hasSaves())
                console.log("saveCount:", getSaveCount())
                console.log("saveMetadata:", getSaveMetadata())
                console.log("activeSave:", getActiveSave())
                console.log("localStorage keys:", Object.keys(localStorage).filter(key => key.includes("sumo-rpg")))
              }}
              variant="outline"
              size="sm"
              className="text-xs text-gray-500"
            >
              Debug Saves
            </Button>

            {/* Botão de teste - Criar save diretamente */}
            <Button
              onClick={() => {
                console.log("=== CRIANDO SAVE DE TESTE ===")
                const { createSave, getActiveSave } = require("@/lib/storage")
                
                const testCharacter = {
                  name: "Teste",
                  country: "Brasil",
                  attributes: {
                    strength: 5,
                    dexterity: 5,
                    mentalStrength: 5,
                    speed: 5,
                    defense: 5,
                  },
                  level: 1,
                  experience: 0,
                  money: 1000,
                  skills: [],
                  passives: [],
                  wins: 0,
                  losses: 0,
                  rank: "Iniciante",
                  skillPoints: 3,
                  learnedSkills: []
                }
                
                try {
                  const saveId = createSave(testCharacter)
                  console.log("Save criado com ID:", saveId)
                  
                  const activeSave = getActiveSave()
                  console.log("Save ativo após criação:", activeSave)
                  
                  // Recarrega a página para ver se detecta o save
                  window.location.reload()
                } catch (error) {
                  console.error("Erro ao criar save:", error)
                }
              }}
              variant="outline"
              size="sm"
              className="text-xs text-red-500"
            >
              Criar Save Teste
            </Button>
          </div>

          {/* Informações sobre o sistema de saves */}
          <Card className="mt-8 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Save className="text-amber-600" size={20} />
                Sistema de Saves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Você pode ter até 3 personagens diferentes, cada um com seu próprio progresso e histórico de combate.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        {/* Componente de Debug */}
        <SaveDebug />
      </main>
    </ClientOnly>
  )
}

