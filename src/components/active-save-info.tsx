"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getActiveSave, getSaveMetadata } from "@/lib/storage"
import type { SaveMetadata } from "@/lib/types"
import { Save, Clock, User, ArrowLeft } from "lucide-react"

interface ActiveSaveInfoProps {
  onBackToMenu?: () => void
}

export function ActiveSaveInfo({ onBackToMenu }: ActiveSaveInfoProps) {
  const [activeSave, setActiveSave] = useState<SaveMetadata | null>(null)
  const [totalSaves, setTotalSaves] = useState(0)

  useEffect(() => {
    loadActiveSaveInfo()
  }, [])

  const loadActiveSaveInfo = () => {
    const save = getActiveSave()
    const metadata = getSaveMetadata()
    
    if (save) {
      setActiveSave({
        id: save.id,
        characterName: save.character.name,
        characterLevel: save.character.level,
        characterRank: save.character.rank,
        lastPlayed: save.lastPlayed,
        totalPlayTime: save.totalPlayTime,
        isActive: save.isActive
      })
    }
    
    setTotalSaves(metadata.length)
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

  if (!activeSave) {
    return null
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="text-amber-600" size={20} />
            <CardTitle className="text-lg">Save Ativo</CardTitle>
          </div>
          
          {onBackToMenu && (
            <Button 
              onClick={onBackToMenu}
              variant="outline"
              size="sm"
            >
              <ArrowLeft size={16} className="mr-1" />
              Menu
            </Button>
          )}
        </div>
        <CardDescription>
          {activeSave.characterName} • {totalSaves} save{totalSaves > 1 ? 's' : ''} total
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-amber-600" />
            <span>Nível {activeSave.characterLevel}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-600" />
            <span>{formatPlayTime(activeSave.totalPlayTime)}</span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Último jogo: {formatDate(activeSave.lastPlayed)}
        </div>
      </CardContent>
    </Card>
  )
} 