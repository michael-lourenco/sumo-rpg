"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  getSaveMetadata, 
  activateSave, 
  deleteSave, 
  canCreateSave, 
  getMaxSaves,
  migrateOldSave,
  getActiveSave
} from "@/lib/storage"
import type { SaveMetadata } from "@/lib/types"
import { 
  Play, 
  Trash2, 
  Plus, 
  Clock, 
  Trophy, 
  User, 
  AlertTriangle,
  Save
} from "lucide-react"

interface SaveManagerProps {
  onSaveSelected?: () => void
  onNewGame?: () => void
}

export function SaveManager({ onSaveSelected, onNewGame }: SaveManagerProps) {
  const router = useRouter()
  const [saves, setSaves] = useState<SaveMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadSaves()
  }, [])

  const loadSaves = () => {
    setIsLoading(true)
    
    // Migra dados antigos se necessário
    migrateOldSave()
    
    const saveMetadata = getSaveMetadata()
    setSaves(saveMetadata)
    setIsLoading(false)
  }

  const handleLoadSave = async (saveId: string) => {
    console.log("handleLoadSave - Iniciando carregamento do save:", saveId)
    try {
      console.log("handleLoadSave - Ativando save...")
      await activateSave(saveId)
      console.log("handleLoadSave - Save ativado com sucesso")
      
      // Aguarda um pouco para garantir que o save foi salvo
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log("handleLoadSave - Verificando save ativo...")
      const activeSave = getActiveSave()
      console.log("handleLoadSave - Save ativo após ativação:", activeSave)
      
      // Aguarda mais um pouco para garantir que tudo foi processado
      await new Promise(resolve => setTimeout(resolve, 200))
      
      onSaveSelected?.()
      console.log("handleLoadSave - Redirecionando para /game")
      
      // Aguarda um pouco antes do redirecionamento
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push("/game")
    } catch (error) {
      console.error("handleLoadSave - Erro:", error)
      alert("Erro ao carregar save: " + error)
    }
  }

  const handleDeleteSave = (saveId: string) => {
    if (confirm("Tem certeza que deseja excluir este save? Esta ação não pode ser desfeita.")) {
      try {
        deleteSave(saveId)
        loadSaves()
        setShowDeleteConfirm(null)
      } catch (error) {
        alert("Erro ao excluir save: " + error)
      }
    }
  }

  const handleNewGame = () => {
    if (!canCreateSave()) {
      alert(`Você já tem ${getMaxSaves()} saves. Exclua um save para criar um novo.`)
      return
    }
    
    onNewGame?.()
    router.push("/create-character")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const getRankColor = (rank: string) => {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Saves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando saves...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="text-amber-600" size={24} />
            Gerenciar Saves
          </CardTitle>
          <CardDescription>
            Você pode ter até {getMaxSaves()} saves. {saves.length}/{getMaxSaves()} slots utilizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleNewGame}
              disabled={!canCreateSave()}
              className="bg-amber-800 hover:bg-amber-900"
            >
              <Plus size={16} className="mr-2" />
              Novo Jogo
            </Button>
            
            <Button 
              onClick={loadSaves}
              variant="outline"
            >
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Saves */}
      {saves.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <AlertTriangle className="mx-auto text-amber-600" size={48} />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum save encontrado</h3>
                <p className="text-gray-600 mt-2">
                  Crie seu primeiro personagem para começar a jogar!
                </p>
              </div>
              <Button 
                onClick={handleNewGame}
                className="bg-amber-800 hover:bg-amber-900"
              >
                <Plus size={16} className="mr-2" />
                Criar Primeiro Personagem
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {saves.map((save) => (
            <Card 
              key={save.id} 
              className={`relative ${save.isActive ? 'ring-2 ring-amber-500' : ''}`}
            >
              {save.isActive && (
                <div className="absolute top-2 right-2">
                  <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    Ativo
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  {save.characterName}
                </CardTitle>
                <CardDescription>
                  Nível {save.characterLevel} • {save.characterRank}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informações do personagem */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy size={16} className="text-amber-600" />
                    <span className={getRankColor(save.characterRank)}>
                      {save.characterRank}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{formatPlayTime(save.totalPlayTime)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Último jogo: {formatDate(save.lastPlayed)}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleLoadSave(save.id)}
                    size="sm"
                    className="flex-1 bg-amber-800 hover:bg-amber-900"
                  >
                    <Play size={16} className="mr-1" />
                    Carregar
                  </Button>
                  
                  <Button 
                    onClick={() => setShowDeleteConfirm(save.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Confirmação de exclusão */}
                {showDeleteConfirm === save.id && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-red-800">
                      Excluir este save?
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDeleteSave(save.id)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Sim, excluir
                      </Button>
                      <Button 
                        onClick={() => setShowDeleteConfirm(null)}
                        size="sm"
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Aviso sobre slots cheios */}
      {!canCreateSave() && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle size={20} />
              <span className="font-medium">
                Todos os slots de save estão ocupados
              </span>
            </div>
            <p className="text-amber-700 mt-2 text-sm">
              Exclua um save existente para criar um novo personagem.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 